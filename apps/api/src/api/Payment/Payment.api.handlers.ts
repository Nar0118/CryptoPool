import { Request, Response } from 'express';
import * as CoinGecko from 'coingecko-api';
import {
  checkRequiredParams,
  coinsAbbreviation,
  getPaymentTransactions,
  isValidMongoId,
  isValidUrl,
  makeInitiatePaymentResponse,
  makePaymentStatusResponse,
} from '../../util/helpers';
import { axiosInstance, pbPayAxiosInstance } from '../../util/custodial';
import { PBPayConfigs } from '../../util/constants/config';
import { Coins, PbPayCoins } from '../../util/types';
import { CoinType } from '../../models/Order';
import { UserPayment } from '../../models/UserPayment';
import { Transaction } from '../../models/Transactions';
import { generateKey } from '../../util/generateUniqueKey';
import {
  AfterCompletionType,
  NotificationTypes,
  PaymentStatus,
  PaymentType,
  UserPaymentStatus,
} from '../../util/constants/chains';
import { throwPaymentError } from '../../util/error/error.util';
import { checkTime } from '../../util/getTime';
import { MerchantRoles, User } from '../../models/User';
import axios from 'axios';
import { MailOptions, sendEmail } from '../../util/email/email.util.nodemailer';

// Using for creating payments from outside of our website
export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const {
      id,
      currency,
      amount,
      merchantId,
      externalId,
      afterCompletionType,
      redirectionUrl,
      notificationUrl,
      status,
      email,
    } = req.body;

    let payment;
    let primaryWalletId = '';
    let transactionDetails = [];
    let mainWallet = null;

    if (!merchantId) {
      throwPaymentError(
        "'merchantId' is missing.",
        payment?.notificationUrl ?? ''
      );
    }

    if (id) {
      if (!isValidMongoId(id)) {
        throwPaymentError("'id' has an invalid format.");
      }
      payment = await UserPayment.findById(id);
    }

    if (merchantId && !isValidMongoId(merchantId)) {
      throwPaymentError("'merchantId' has an invalid format.");
    }

    if (externalId && !payment) {
      payment = await UserPayment.findOne({ externalId, merchantId });
    }

    // checking is that merchant exist in our db or no
    const user = await User.findById(merchantId);
    if (!user) {
      throwPaymentError(
        `The merchant with the provided ${merchantId} "merchantId" does not exist.`,
        payment?.notificationUrl ?? ''
      );
    }

    // if merchant can do this action or no
    if (user.paymentFormat !== MerchantRoles.AT_ONCE_DETAILS) {
      throwPaymentError(
        `Merchant ${user.name} does not have access to this operation.`,
        payment?.notificationUrl ?? ''
      );
    }

    primaryWalletId = user.primaryWalletId;

    // checking is merchant has wallet
    const mainWalletResponse: any = await axiosInstance
      .get(`/wallets/${primaryWalletId}`)
      .then((res) => {
        return res;
      })
      .catch(() => {
        // when merchant has not a main wallet
        throwPaymentError(
          `Wallet for ${merchantId} does not exist.`,
          payment?.notificationUrl ?? ''
        );
      });

    mainWallet = mainWalletResponse?.data?.data?.wallet;

    // when merchant has not a main wallet
    if (!mainWallet) {
      throwPaymentError(
        `Wallet for ${merchantId} does not exist.`,
        payment?.notificationUrl ?? ''
      );
    }

    // the second part of API (its only working when we pass `id` in body)
    // id is payment id which we returned in the first response when generating url
    if (id) {
      if (!payment) {
        throwPaymentError(`Payment not found with ${id} id.`);
      }

      if (!status) {
        throwPaymentError("'status' is missing.", payment.notificationUrl);
      }

      if (!payment.tempWallets.length) {
        throwPaymentError(
          'The status cannot be changed because the wallet is not initialized.',
          payment.notificationUrl
        );
      }

      // checking for status field, if provided status is correct
      const enumValues = Object.values(UserPaymentStatus) as string[];
      if (typeof status === 'string' && !enumValues.includes(status)) {
        throwPaymentError(
          `Provided 'status' (${status}) for payment is not valid. Avialable statuses (${(Object.values(
            UserPaymentStatus
          ) as string[]).join(', ')})`,
          payment.notificationUrl
        );
      }

      // checking for temp wallet expiration
      const tempWallet = payment.tempWallets[0];
      const isTimePassed = checkTime(tempWallet);
      if (isTimePassed) {
        throwPaymentError(
          `Payment with ${id} id has already expired or been closed.`,
          payment.notificationUrl
        );
      }

      payment.status = status;
    } else {
      // the first part of API ( url generation for widget )

      // 'externalId' is required field!
      if (!externalId) {
        throwPaymentError(
          "'externalId' is missing.",
          payment?.notificationUrl ?? notificationUrl
        );
      }

      const key = generateKey(email);

      // getting or creating the payment with unique external id and other props
      if (!payment) {
        // checking currency in avialable currencies
        const isCoinInEnum = Object.values(PbPayCoins).includes(currency);
        if (!isCoinInEnum) {
          throwPaymentError(
            `The provided ${currency} coin is not supported.`,
            notificationUrl
          );
        }

        const requiredParams = checkRequiredParams(req.body);
        if (!requiredParams.isFulfilled) {
          throwPaymentError(
            `Not all parameters are passed, required ${requiredParams.missed.join(
              ', '
            )}.`,
            notificationUrl ?? ''
          );
        }

        // checking "afterCompletionType" (must be 'none' or 'redirect')
        if (!(afterCompletionType in AfterCompletionType)) {
          throwPaymentError(
            `The provided ${redirectionUrl} redirectionUrl is not a valid url.`,
            notificationUrl
          );
        }

        if (!isValidUrl(redirectionUrl)) {
          throwPaymentError(
            `Provided 'redirectionUrl' (${redirectionUrl}) is not valid url.`,
            notificationUrl
          );
        }

        const defaultDate = new Date().toLocaleString('en-US', {
          timeZone: 'UTC',
        });

        if (!currency) {
          throwPaymentError(`"currency" is required`, notificationUrl);
        }

        payment = await UserPayment.create({
          key,
          email,
          amountUSD: amount,
          isActiveUser: true,
          merchantId,
          paymentFormat: user.paymentFormat,
          externalId,
          afterCompletionType,
          redirectionUrl,
          notificationUrl,
          currency,
          createdAt: defaultDate,
        });
      }
    }

    // when payment has not 'tempWallets' need to create, in the second time it will take that created
    if (payment?.tempWallets?.length) {
      // taking that created wallet, about which is written above in comment
      const tempWallet = payment.tempWallets[0];
      const isTimePassed = checkTime(tempWallet);

      // checking expiration
      if (isTimePassed && !tempWallet.isActive) {
        throwPaymentError(
          `The payment with ExternalId ${externalId} has already expired or been closed.`,
          payment?.notificationUrl ?? ''
        );
      }

      // getting transactions
      transactionDetails = await getPaymentTransactions(
        mainWallet?.merchantId,
        tempWallet.tempWalletPbId
      );
    }

    // final result creation process
    const result = makeInitiatePaymentResponse(payment);

    // `payment.save()` for saving changes which we will apply in the code above
    payment.save();

    // do post callback to provided notificationUrl

    const url = payment?.notificationUrl;
    if (url) {
      axios
        .post(url, { success: true, ...result, transactionDetails })
        .catch((error) => {
          throwPaymentError(
            `Something went wrong during callback \`error: ${error.message}`
          );
        });
    }
    res.json({ success: true, ...result, transactionDetails });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });

    // do post callback to provided notificationUrl
    const url = err?.notificationUrl;
    if (url) {
      axios
        .post(url, {
          success: false,
          error: err.message,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    if (!paymentId) {
      throw new Error("'paymentId' is missing.");
    }

    const payment = await UserPayment.findById(paymentId);

    if (!payment) {
      throwPaymentError(`Payment not found with ${paymentId} id.`);
    }

    const responseResult = makePaymentStatusResponse(payment);

    const user = await User.findById(payment.merchantId);
    if (!user) {
      throwPaymentError(
        `The merchant with the provided ${payment.merchantId} "merchantId" does not exist.`,
        payment.notificationUrl
      );
    }

    const mainWalletResponse = await axiosInstance.get(
      `/wallets/${user.primaryWalletId}`
    );

    const mainWallet = mainWalletResponse?.data?.data?.wallet;

    if (!mainWallet) {
      throwPaymentError(
        `Wallet for ${payment.merchantId} does not exist.`,
        payment.notificationUrl
      );
    }

    const finalResult = {
      ...responseResult,
      transactionDetails: [],
    };

    const tempWallet = payment?.tempWallets[0];

    if (tempWallet) {
      const transactionDetails = await getPaymentTransactions(
        mainWallet.merchantId,
        tempWallet.tempWalletPbId
      );
      finalResult.transactionDetails = transactionDetails;

      const { status, capacity } = tempWallet.paymentInfo;

      const isTimePassed = checkTime(tempWallet);

      const paymentStatus =
        status === PaymentStatus.EMPTY && isTimePassed
          ? UserPaymentStatus.FAILED
          : status === PaymentStatus.PARTIAL
          ? UserPaymentStatus.PARTIAL
          : status === PaymentStatus.EQUAL || status === PaymentStatus.EXTRA
          ? UserPaymentStatus.SUCCESS
          : UserPaymentStatus.INITIALIZED;

      finalResult.paymentDetails.status = paymentStatus;

      if (paymentStatus === UserPaymentStatus.PARTIAL) {
        finalResult.paymentDetails.less = capacity;
      } else if (status === PaymentStatus.EXTRA) {
        finalResult.paymentDetails.more = capacity;
      }
    } else {
      finalResult.paymentDetails.status = UserPaymentStatus.INITIALIZED;
    }

    res.json(finalResult);

    const url = payment.notificationUrl;

    if (url) {
      axios
        .post(url, finalResult)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  } catch (err) {
    const responseResult = {
      success: false,
      error: err.message,
    };

    res.json(responseResult);

    // do post callback to provided notificationUrl
    const url = err.notificationUrl;

    if (url) {
      axios
        .post(url, responseResult)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
};

// Test API which will test the callback function (it will replace merchant callback for testing)
export const defaultCallback = async (req: Request, res: Response) => {
  try {
    console.log('body =', req.body);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};

export const getTransactionNotification = async (
  req: Request,
  res: Response
) => {
  try {
    const { key } = req.params;
    const { data, type } = req.body;

    if (type === NotificationTypes.TRANSACTION && data) {
      const {
        id,
        transactionHash,
        address,
        sourceAddress,
        wallet,
        destination,
        status,
        subStatus,
        amount,
        currency,
        estimatedFiatAmount,
        estimatedFiatCurrency,
        tag,
        createdAt,
        completedAt,
        modifiedAt,
      } = data;

      let transaction = await Transaction.findOne({ hash: transactionHash });
      if (!transaction) {
        transaction = await Transaction.create({
          pbId: id,
          hash: transactionHash,
          to: address,
          from: sourceAddress,
          wallet,
          destination,
          status,
          subStatus,
          amount,
          currency,
          estimatedFiatAmount,
          estimatedFiatCurrency,
          tag,
          createdAt: createdAt * 1000,
          completedAt: completedAt * 1000,
          modifiedAt: modifiedAt * 1000,
        });

        if (key) {
          let payment = await UserPayment.findOne({ key });
          if (!payment) {
            return;
          } else if (payment.email) {
            const tempWallet = payment.tempWallets[0];
            const { status } = tempWallet.paymentInfo;

            const mailOptions: MailOptions = {
              to: payment.email,
              subject: '',
              text: '',
            };

            const response = await axiosInstance.get(
              `/wallets/children/${tempWallet.tempWalletPbId}/pbp`
            );

            const wallet = response.data.data;

            const { balance } = wallet;

            const newCapacity =
              status === PaymentType.EXTRA
                ? balance - payment.amount
                : payment.amount - balance;

            const type =
              balance > payment.amount
                ? PaymentType.EXTRA
                : balance < payment.amount
                ? PaymentType.PARTIAL
                : PaymentType.EQUAL;

            let text = '';
            let subject = '';

            if (balance < payment.amount) {
              text = `Partial payment received : (${amount} ${
                payment.currency
              }), need more ${
                payment.amount - balance
              } for finalizing your payment.`;
              subject = 'Partial payment.';
            } else if (balance > payment.amount) {
              text = `Extra payment received : (${amount} ${
                payment.currency
              }), transfered more ${
                balance - payment.amount
              } amount will be transfered back.`;
              subject = 'Extra payment.';
            } else {
              subject = 'Payment';
              text = `Payment received : (${amount} ${payment.currency})`;
            }

            tempWallet.paymentInfo = { status: type, capacity: newCapacity };

            payment = await UserPayment.findOneAndUpdate(
              { key },
              {
                $set: { tempWallets: [tempWallet] },
              },
              { new: true }
            );

            mailOptions.text = text;
            mailOptions.subject = subject;
            sendEmail(mailOptions);
          }
        }
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};

// This is API for getting your wallet ballance with Dollar and with Passed coins and the current One Bitcoin price
// With the Request, query need to pass the coin or coins name as a string and your balance
export const getCurrencyBalance = async (req: Request, res: Response) => {
  try {
    const CoinGeckoClient = new CoinGecko();

    const coinTypes = String(req.query.coins);
    const currencyType = String(req.query.currencyType);
    let amount = Number(req.query.amount);

    const coinsData = coinTypes.split(',');
    if (!coinsData.includes('ethereum')) coinsData.push('ethereum');

    const coinsBases = coinsAbbreviation(coinsData);

    const data = await CoinGeckoClient.exchanges.fetchTickers('bitfinex', {
      coin_ids: coinsData,
    });

    const coinList = {};
    const coinData = data.data.tickers.filter((t) => t.target === Coins.USD);

    const ethereum = coinData.filter((t) => t.base === Coins.ETH)[0].last;
    amount *= ethereum;

    if (currencyType === Coins.USD) {
      return res.send({
        success: true,
        data: coinList,
        dollarBalance: amount,
      });
    }

    if (currencyType === Coins.BTC) {
      [Coins.BTC].forEach((item: string) => {
        const temp = coinData.filter((t) => t.base === item);
        const res = temp.length === 0 ? [] : temp[0];
        coinList[item] = amount / res.last;
      });
      return res.send({
        success: true,
        data: coinList,
        dollarBalance: amount,
      });
    }

    const bitcoin = coinData.filter((t) => t.base === Coins.BTC)[0].last;
    coinsBases.forEach((item: string) => {
      const temp = coinData.filter((t) => t.base === item);
      const res = temp.length === 0 ? [] : temp[0];
      coinList[item] = amount / res.last;
    });

    return res.send({
      success: true,
      data: coinList,
      bitcoin,
      dollarBalance: amount,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
};

export const convertUsdToCoin = async (req: Request, res: Response) => {
  try {
    const coinTypes = String(req.query.coins);
    const amount = Number(req.query.amount);
    const coinsData = coinTypes.split(',');
    const coins = {};

    await Promise.all(
      coinsData.map(async (coin: string) => {
        const result = await pbPayAxiosInstance.post(
          `merchant/${PBPayConfigs.MERCHANT_ID}/rates`,
          {
            fromCurrency: Coins.USD,
            toCurrency: coin,
            fromAmount: amount,
          }
        );
        coins[coin] = result?.data?.data?.toAmount;

        if (coin === PbPayCoins.BTC) {
          coins[CoinType.BITCOIN] = result?.data?.data?.rate;
        }
      })
    );

    return res.send({
      success: true,
      data: coins,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
};

export const convertUsdToSelectedCurrency = async (
  req: Request,
  res: Response
) => {
  try {
    const { key } = req.query;

    const payment = await UserPayment.findOne({ key });

    if (!payment || !payment.amountUSD) {
      return res.json({
        success: false,
        error: 'Payment doesn`t exist.',
      });
    }

    const { amountUSD, currency } = payment;
    const supportedCoins = currency
      ? [currency]
      : [
          PbPayCoins.BTC,
          PbPayCoins.USDT,
          PbPayCoins.ETH,
          PbPayCoins.XRP,
          PbPayCoins.USDC,
        ];

    const coins = {};

    await Promise.all(
      supportedCoins.map(async (coin: string) => {
        const result = await pbPayAxiosInstance.post(
          `merchant/${PBPayConfigs.MERCHANT_ID}/rates`,
          {
            fromCurrency: Coins.USD,
            toCurrency: coin,
            fromAmount: amountUSD,
          }
        );
        coins[coin] = result?.data?.data?.toAmount;

        if (coin === PbPayCoins.BTC) {
          coins[CoinType.BITCOIN] = result?.data?.data?.rate;
        }
      })
    );

    return res.send({
      success: true,
      data: coins,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
};

export const payWithQr = async (req: Request, res: Response) => {
  try {
    const parentWalletId = String(req.query.parentWalletId);
    const childWalletId = String(req.query.childWalletId);
    const price = req.query.price;

    const response = await axiosInstance.get(
      `/wallets/${parentWalletId}/children/${childWalletId}/transaction-url?price=${price}`
    );

    return res.send({
      success: true,
      data: response.data,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
};

export const payWithQrWidget = async (req: Request, res: Response) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.json({
        success: false,
        error: '"key" is missing.',
      });
    }

    const response = await axiosInstance.get(
      `/wallets/children/transaction-url-widget?key=${key}`
    );

    return res.send({
      data: response.data,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
};

export const changePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { status, capacity } = req.body;

    const paymentUser = await UserPayment.findOne({ key });

    const activeItem = paymentUser.tempWallets.find((item) => item.isActive);
    if (activeItem) {
      activeItem.paymentInfo = {
        status,
        capacity,
      };
    }

    await paymentUser.save();

    return res.send({
      success: true,
      data: paymentUser,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
};

export const transferBackToUsers = async (req: Request, res: Response) => {
  try {
    const { childId } = req.params;
    const chainId = req.query.chainId;

    const response = await axiosInstance.get(
      `/wallets/transfer-to-back/${childId}?chainId=${chainId}`
    );

    return res.send({
      success: true,
      data: response.data,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
};
