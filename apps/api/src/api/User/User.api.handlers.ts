import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as googleAuth from 'google-auth-library';
import { Socket } from 'socket.io';
import { AuthProviders, User } from '../../models/User';
import { CoinType } from '../../models/Order';
import { UserPayment } from '../../models/UserPayment';
import { MailOptions, sendEmail } from '../../util/email/email.util.nodemailer';
import {
  axiosInstance,
  pbPayAxiosInstance,
  selfAxiosInstance,
} from '../../util/custodial';
import env from '../../util/constants/env';
import { MerchantWallets, PbPayCoins } from '../../util/types';
import { PBPayConfigs } from '../../util/constants/config';
import { checkTransactions } from '../Transaction/Transactions.api.handlers';
import { checkTime } from '../../util/getTime';
import {
  PaymentProcess,
  PaymentType,
  UserPaymentStatus,
} from '../../util/constants/chains';
import { isObjectEmpty } from '../../util/helpers';

const googleClient = new googleAuth.OAuth2Client(env.clientId);

const SECRET_JWT_CODE = env.secretJwtCode;

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    const usersCount = await User.collection.countDocuments();
    const users = await User.find().skip(offset).limit(limit);

    return res.send({ data: users, count: usersCount });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, role, bankAccount } = req.body;

    const isUserExist = await User.findOne({
      email,
    });

    if (isUserExist) {
      return res.json({ success: false, message: `${email} already exist` });
    }

    const response = await axiosInstance.post('/wallets/');
    const user = await User.create({
      fullName,
      email,
      password,
      role,
      bankAccount,
      primaryWalletId: response?.data?.data?._id,
      identificationToken: jwt.sign({ id: email, fullName }, SECRET_JWT_CODE),
    });

    return res.json({
      success: true,
      message: `${email} successfully created`,
      data: user,
    });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = req['user'];

    if (!user) {
      return res.json({ success: false, error: 'User does not exist!' });
    }

    return res.send({ success: true, data: user });
  } catch (err) {
    res.send({ success: false, error: err });
  }
};

export const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = req['user'];

    user.email = req.body.email;

    await user.save();
    return res.send(user);
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.deleteOne({ _id: id });

    return res.send({ success: true });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const user = req['user'];

    if (!user) {
      res.send({ success: false, message: 'Invalid Token' });
    }

    req['user'] = null;

    return res.json({ success: true, message: 'user logout successfully' });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const signup = async (req: Request, res: Response) => {
  const { fullName, email, password, referralCode } = req.body;

  if (!email || !password || !fullName) {
    return res.json({
      success: false,
      error: 'Submit all required parameters',
    });
  }

  try {
    const registeredUser = await User.findOne({ email }).select('+password');
    if (registeredUser) {
      return res.json({ success: false, error: 'You already have an account' });
    }

    let user = await User.create({
      fullName,
      email,
      password,
      primaryWalletId: '',
      identificationToken: jwt.sign({ id: email, fullName }, SECRET_JWT_CODE),
    });

    let response: any = {};
    if (env.isPbpay) {
      response = await axiosInstance.post('/wallets/pbp', {
        userId: user._id,
      });
    } else {
      response = await axiosInstance.post('/wallets', {
        userId: user._id,
      });
    }

    user = await User.findByIdAndUpdate(user.id, {
      primaryWalletId: response.data?.data?._id,
    });

    const token = jwt.sign({ id: user._id, email }, SECRET_JWT_CODE);

    const mailOptions: MailOptions = {
      to: email,
      subject: 'You have successfully registered',
      text: 'Welcome to CryptoPool',
    };

    await sendEmail(mailOptions);
    return res.json({ success: true, token, user });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      error: 'Submit all required parameters',
    });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.json({
        success: false,
        error: `Account with ${email} doesn't exist`,
      });
    }

    if (password !== user.password) {
      return res.json({ success: false, error: 'Wrong password' });
    }

    user.password = undefined;
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_JWT_CODE
    );

    return res.json({ success: true, token, user });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const signupByGoogle = async (req: Request, res: Response) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.send({
        success: false,
        error: 'Token is empty',
      });
    }

    const googleResponse = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: env.clientId,
    });

    const { name, email, picture } = googleResponse.getPayload();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send({
        success: false,
        error: `${email} has already been registered`,
      });
    }

    const newUser = await User.create({
      email,
      authProvider: AuthProviders.GOOGLE,
    });

    const token = jwt.sign({ id: newUser._id, email }, SECRET_JWT_CODE);

    return res.json({ success: true, token, user: newUser });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const loginByGoogle = async (req: Request, res: Response) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.send({
        success: false,
        error: 'Token is empty',
      });
    }

    const googleResponse = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: env.clientId,
    });

    const { email } = googleResponse.getPayload();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const token = jwt.sign({ id: existingUser._id, email }, SECRET_JWT_CODE);

      return res.send({
        email,
        success: true,
        existingUser,
        token,
      });
    }

    return res.send({
      success: false,
      error: `There is no account for ${email}`,
    });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const currentUser = req['user'];
    const { oldPassword, newPassword } = req.body;

    const dbUser = await User.findById(currentUser.id).select('+password');

    if (oldPassword !== dbUser.password) {
      return res.json({ success: false, error: 'Wrong password' });
    }

    dbUser.password = newPassword;
    await dbUser.save();

    dbUser.password = undefined;

    const mailOptions: MailOptions = {
      to: currentUser.email,
      subject: 'You have successfully changed your password!',
      text: 'Change Password Alert',
    };

    await sendEmail(mailOptions);

    return res.send({ success: true });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, email, role, bankAccount, paymentFormat } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.json({ success: false, error: 'User does not exist!' });
    }

    user.role = role;
    user.email = email;
    user.fullName = fullName;
    user.bankAccount = bankAccount;
    user.paymentFormat = paymentFormat;

    await user.save();
    return res.send({ success: true, data: user });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const inviteFriends = async (req: Request, res: Response) => {
  try {
    const user = req['user'];
    const { toEmail } = req.body;

    if (!toEmail) {
      return res.json({ success: false, error: 'Send email' });
    }

    if (user.email === toEmail) {
      return res.json({
        success: false,
        error: "You can't send invitation to your email",
      });
    }

    const isExistUser = await User.findOne({
      email: toEmail,
    });

    if (isExistUser) {
      return res.send({
        success: false,
        error: `${toEmail} is already registered`,
      });
    }

    const mailOptions: MailOptions = {
      from: user.email,
      to: toEmail,
      subject: 'Please join to CryptoPool',
      html: `<div>
                <div>It will be very interesting</div>
                  <div>
                    <a href=http://localhost:4200/signup?referralCode=${user.referralCode} target="_blank">
                      Join to CryptoPool
                    </a>
                  </div>
               </div>`,
    };

    await sendEmail(mailOptions);

    return res.send({
      success: true,
      message: `It was successfully sent to ${toEmail}`,
    });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const sendRecoverPasswordEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.send({
        success: false,
        error: 'Please send email',
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.send({
        success: false,
        error: `There is no user with ${email} email`,
      });
    }

    const code = Math.floor(1000 + Math.random() * 9000);
    user.emailVerificationCode = code;

    const mailOptions: MailOptions = {
      to: email,
      subject: 'Recover Password',
      html: `<div>
              <div>Change your password</div>
              <div>Your code - ${code}</div>
             </div>`,
    };

    await sendEmail(mailOptions);

    await user.save();

    return res.send({
      success: true,
      message: `It was successfully sent to ${email}`,
    });
  } catch (err) {
    res.json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
};

export const checkVerificationCode = async (req: Request, res: Response) => {
  try {
    const { emailVerificationCode, email } = req.body;
    const user = await User.findOne({
      email,
    });

    if (user.emailVerificationCode == emailVerificationCode)
      return res.json({ success: true, user });
    else
      return res.json({
        success: false,
        message: 'Entered code is not correct, please try again',
      });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};

export const updateForgottenPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword, email } = req.body;

    if (!newPassword || !email) {
      return res.send({
        success: false,
        error: 'Send all necessary parameters',
      });
    }

    const user = await User.findOne({
      email,
    }).select('+password');

    if (!user) {
      return res.send({
        success: false,
        error: 'Wrong token',
      });
    }

    user.password = newPassword;
    user.emailVerificationCode = undefined;

    await user.save();
    user.password = undefined;

    return res.send({
      success: true,
      message: 'Password successfully updated',
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};

export const updateEmbed = async (req: Request, res: Response) => {
  try {
    const user = req['user'];
    const { embed } = req.body;

    user.embed = embed;
    await user.save();

    return res.send({
      success: true,
      data: user.embed,
      message: 'Embed has been updated successfully!',
    });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

// need to refactor this API
export const getWalletBalance = async (req: Request, res: Response) => {
  try {
    const currencyType = String(req.query.currencyType);
    const coinTypes = String(req.query.coins);

    const user = req['user'];

    const wallet = await axiosInstance.get(`/wallets/${user.primaryWalletId}
    `);

    const walletBalance = Number(wallet.data.data.wallet.totalDepositedAmount);
    const coinsData = coinTypes.split(',');
    const coins = {};
    await Promise.all(
      coinsData.map(async (coin: string) => {
        const result = await pbPayAxiosInstance.post(
          `merchant/${PBPayConfigs.MERCHANT_ID}/rates`,
          {
            fromCurrency: currencyType,
            toCurrency: coin,
            fromAmount: walletBalance,
          }
        );
        coins[coin] = result?.data?.data?.toAmount;

        if (coin === PbPayCoins.BTC) {
          coins[CoinType.BITCOIN] = result?.data?.data?.rate;
        } else if (coin === PbPayCoins.ETH) {
          coins[CoinType.ETHEREUM] = result?.data?.data?.rate;
        }
      })
    );

    return res.send({
      success: true,
      data: coins,
      dollarBalance: walletBalance,
    });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

export const getUserInfoByIdentificationToken = async (
  req: Request,
  res: Response
) => {
  try {
    const { identificationToken } = req.params;

    if (!identificationToken)
      return res.send({
        success: false,
        message: 'identificationToken is empty!',
      });

    const user = await User.findOne({ identificationToken });

    if (!user) return res.send({ success: false, message: 'User not found!' });

    return res.send({ success: true, data: user });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { query } = req;

    if (!id)
      return res.send({
        success: false,
        message: 'id is empty!',
      });

    const user = await User.findById(id);

    if (!user || !isObjectEmpty(query))
      return res.send({ success: false, message: 'User not found!' });

    return res.send({ success: true, data: user });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

export const getPayWallet = async (req: Request, res: Response) => {
  try {
    const { primaryWalletId, currency, key } = req.query;
    const isCoinInEnum = Object.values(PbPayCoins).includes(
      currency as PbPayCoins
    );

    if (!isCoinInEnum)
      return res.send({
        success: false,
        message: `${currency} is an invalid currency`,
      });

    const childWallet = await axiosInstance.post(
      `/wallets/${primaryWalletId}/children${env.isPbpay && '/pbp'}`,
      {
        currency,
        key,
      }
    );

    return res.send({
      success: true,
      childWallet: childWallet.data.data,
    });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

export const checkChildWalletBalancePbp = async (
  socket: Socket,
  data: MerchantWallets
) => {
  let response;
  const { key } = data;
  try {
    if (!key) {
      response = { success: false, error: '"key" is required.' };
      socket.emit('childWallet', response);
      return;
    }

    let paymentUser = await UserPayment.findOne({ key });

    if (!paymentUser) {
      response = { success: false, error: 'Payment not found.' };
      socket.emit('childWallet', response);
      return;
    }
    if (!paymentUser.tempWallets) {
      response = { success: false, error: 'Wallet is not initialized yet.' };
      socket.emit('childWallet', response);
      return;
    }

    const childId = paymentUser.tempWallets[0].tempWalletPbId;

    response = await axiosInstance.get(`/wallets/children/${childId}/pbp`);

    const { balance } = response.data.data; // tempWallet balance
    const lastTransaction = response.data.lastTransaction || {};

    const activeTempWallet = paymentUser.tempWallets.find(
      (wallet) => wallet.isActive
    );

    const { merchantId, id, notificationUrl, email, amount } = paymentUser;

    const mailOptions: MailOptions = {
      to: email,
      subject: '',
      text: '',
    };

    let isSendEmail = false;

    if (activeTempWallet && !activeTempWallet?.isEmailSended) {
      if (balance >= amount) {
        if (email) {
          mailOptions.subject = 'Successful Payment';
          mailOptions.text =
            'Congratulations, your payment is successful! Thank you!';
        }
        isSendEmail = true;
      } else if (checkTime(activeTempWallet)) {
        if (email) {
          mailOptions.subject = 'Unsuccessful Payment';
          mailOptions.text =
            'Your payment was not successful, please initiate the payment again';
        }
        isSendEmail = true;
      }
    }

    const success = balance >= amount;

    if (isSendEmail) {
      if (email) {
        sendEmail(mailOptions);
      }
      const status = !success
        ? balance === 0
          ? UserPaymentStatus.FAILED
          : UserPaymentStatus.PARTIAL
        : UserPaymentStatus.SUCCESS;

      const type =
        balance > amount
          ? PaymentType.EXTRA
          : balance < amount
          ? PaymentType.PARTIAL
          : PaymentType.EQUAL;

      const capacity =
        type === PaymentType.EXTRA ? balance - amount : amount - balance;

      const newTempWallets = [];
      paymentUser.tempWallets.map((el) => {
        if (el.id === activeTempWallet.id) {
          el.isActive = false;
          el.isEmailSended = true;
          el.paymentInfo = { status: type, capacity };
          newTempWallets.push(el);
        }
        return el;
      });

      const defaultDate = new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
      });

      paymentUser = await UserPayment.findByIdAndUpdate(
        paymentUser.id,
        {
          status,
          isActiveUser: false,
          process: PaymentProcess.FINISHED,
          $set: { tempWallets: newTempWallets },
          completedAt: defaultDate,
        },
        { new: true }
      );

      // calling to the initate API
      if (notificationUrl) {
        await selfAxiosInstance.post('/payments/initiate', {
          id,
          merchantId,
          status,
        });
      }
    }

    socket.emit('childWallet', {
      success,
      lastTransaction,
      balance,
    });
  } catch (err) {
    response = { success: false, error: err.message };
    socket.emit('childWallet', response);
  }
};

export const checkChildWalletBalance = async (
  socket: Socket,
  data: MerchantWallets
) => {
  let response;
  try {
    response = await axiosInstance.get(
      `/wallets/${data.parentId}/children/${data.childId}`
    );
    checkTransactions(response.data.transactions);

    const balance = response.data.data.balance / 10 ** 18;

    socket.emit('childWallet', {
      success: balance >= data.amount,
    });
  } catch (err) {
    response = { success: false, error: err.message };
    socket.emit('childWallet', response);
  }
};

export const getChildWalletBalance = async (req: Request, res: Response) => {
  try {
    const { primaryWalletId } = req.query;

    const childWallet = await axiosInstance.post(
      `/wallets/${primaryWalletId}/children`
    );

    return res.send({
      success: true,
      childWallet: childWallet.data.data,
    });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};
