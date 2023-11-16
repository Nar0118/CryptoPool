import { Request, Response } from 'express';
import { Wallet } from '../../models/Wallet';
import generateAndStoreWallet from '../../walletManager/entities/createWallet';
import generateAndStoreWalletPbp from '../../walletManager/entities/createWalletPbp';
import generateAndStoreTempWallet from '../../walletManager/entities/createTempWallet';
import generateAndStoreTempWalletPbp from '../../walletManager/entities/createTempWalletPbp';
import sendFunds, { Status } from '../../walletManager/sendFunds';
import { TempWallet } from '../../models/TempWallet';
import getBalance from '../../util/helpers/getWalletBalance';
import { getSenders, getSendersPbp } from '../../walletManager/getSenders';
// import { contracts } from '../../util/constants/contracts';
// import { createTransferTxURL } from '../../walletManager/createTransferTxURL';
import { createPaymentURL } from '../../walletManager/createPaymentURL';
import { PbPayCoins } from '../../util/constants/contracts';
import { apiAxiosInsance } from '../../util/api';

export const getAllWallets = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    const walletsCount = await Wallet.collection.countDocuments();
    const wallets = await Wallet.find().skip(offset).limit(limit).lean();
    for (const wallet of wallets) {
      delete wallet.mnemonic; //todo
      delete wallet.privateKey; //todo
    }

    return res.send({ success: true, data: wallets, count: walletsCount });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err.message });
  }
};

export const createWallet = async (req: Request, res: Response) => {
  try {
    const resObj = await generateAndStoreWallet();

    if (!resObj) throw 'Could not create wallet';

    const wallet = await resObj.toObject();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete wallet.mnemonic; //todo
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete wallet.privateKey; //todo

    res.status(201);
    return res.json({ success: true, data: wallet });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err.message });
  }
};

export const createWalletPbp = async (req: Request, res: Response) => {
  try {
    const resObj = await generateAndStoreWalletPbp(req.body?.userId);

    if (!resObj) throw 'Could not create wallet';

    const wallet = await resObj.toObject();

    res.status(201);
    return res.json({ success: true, data: wallet });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err.message });
  }
};

export const getWallet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const wallet = await Wallet.findById(id).lean();

    if (!wallet) {
      res.status(404);
      return res.send({ success: false, data: null });
    }
    delete wallet.privateKey; //todo
    delete wallet.mnemonic; //todo

    return res.send({ success: true, data: { wallet } });
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};

export const deleteWallet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const wallet = await Wallet.findById(id);
    if (!wallet) {
      res.status(404);
      res.send({ success: false, error: 'Wallet not found' });
    }
    await wallet.remove();

    return res.send({ success: true });
  } catch (err) {
    res.status(400);
    res.send({ success: false, error: err.message });
  }
};

// -------------------------------- Child api handlers ------------------------------- //

export const getAllChildWallets = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    const wallets = await TempWallet.find({ parentWalletId: id })
      .skip(offset)
      .limit(limit)
      .lean();

    for (const wallet of wallets) {
      wallet.balance = await getBalance(wallet);
      delete wallet.mnemonic; //todo
      delete wallet.privateKey; //todo
    }

    return res.send({ success: true, data: wallets, count: wallets.length });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err.message });
  }
};

export const getAllTempwallets = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    const query = TempWallet.find().skip(offset).limit(limit);
    const countQuery = TempWallet.countDocuments();

    const [wallets, count] = await Promise.all([query.lean(), countQuery]);

    for (const wallet of wallets) {
      delete wallet.mnemonic; //todo
      delete wallet.privateKey; //todo
    }

    return res.send({ success: true, data: wallets, count });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err.message });
  }
};

export const createChildWallet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resObj = await generateAndStoreTempWallet(id);
    if (!resObj) throw 'Could not create wallet';
    const wallet = await resObj.toObject();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete wallet.mnemonic; //todo
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete wallet.privateKey; //todo

    return res.json({ success: true, data: wallet });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err.message });
  }
};

export const createChildWalletPbp = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { currency, key } = req.body;

    const resObj = await generateAndStoreTempWalletPbp(id, currency, key);
    if (!resObj) throw 'Could not create wallet';
    const wallet = await resObj.toObject();

    return res.json({ success: true, data: wallet });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err.message });
  }
};

export const getChildWallet = async (req: Request, res: Response) => {
  try {
    const { childId } = req.params;

    const wallet = await TempWallet.findById(childId).lean();

    if (!wallet) {
      res.status(404);
      return res.send({ success: false, data: null });
    }

    const { senders, transactions } = await getSenders(wallet.address);
    wallet.balance = await getBalance(wallet);
    wallet.senders = senders;

    delete wallet.mnemonic; //todo
    delete wallet.privateKey; //todo

    return res.send({ success: true, data: wallet, transactions });
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};

export const getChildWalletPbp = async (req: Request, res: Response) => {
  try {
    const { childId } = req.params;

    const wallet = await TempWallet.findOne({ pbId: childId }).lean();

    if (!wallet) {
      res.status(404);
      return res.send({ data: null });
    }
    const {
      error,
      updatedTransactions,
      lastTransaction,
      senders,
      balance,
    } = await getSendersPbp(wallet._id);
    if (error) {
      return res.send({ error });
    }
    wallet.balance = balance;
    wallet.senders = senders;

    return res.send({
      data: wallet,
      updatedTransactions,
      lastTransaction,
    });
  } catch (err) {
    res.send({ error: err.message });
  }
};

export const deleteChildWallet = async (req: Request, res: Response) => {
  try {
    const { id, childId } = req.params;

    const parentWallet = await Wallet.findById(id);
    const childWallet = await TempWallet.findById(childId);

    if (!parentWallet || !childWallet) {
      res.status(404);
      return res.send({ success: false, error: 'Wallets not found' });
    }

    const result = await sendFunds(
      parentWallet.address,
      childWallet.address,
      childWallet.privateKey //todo
    );

    switch (result.status) {
      case Status.SUCCESS:
      case Status.ZERO_BALANCE:
        await childWallet.remove();
        return res.send({ success: true, data: result });
      case Status.FAIL:
      case Status.CONTRACT_ERROR:
      case Status.AMOUNT_GREATER_THAN_BALANCE:
        return res.send({ success: false, data: result.data });
    }
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err.message });
  }
};

export const getTransactionURL = async (req: Request, res: Response) => {
  try {
    const { childId } = req.params;
    const { price } = req.query;
    const amount = Number(price);

    const wallet = await TempWallet.findById(childId);

    if (!wallet) {
      res.status(404);
      return res.send({ success: false, error: 'Wallet not found' });
    }

    if (!amount) {
      res.status(404);
      return res.send({ success: false, error: 'Amount is required' });
    }

    // const url = createTransferTxURL(
    //   contracts['MTK'].address,
    //   wallet.address,
    //   amount,
    //   contracts['MTK'].chainId
    // );

    if (
      !wallet.currency ||
      !Object.values(PbPayCoins).includes(wallet.currency)
    ) {
      res.send({ success: false, error: 'Invalid currency.' });
    }

    const url = createPaymentURL(
      wallet.address,
      wallet.currency,
      wallet.tag,
      amount
    );

    return res.send({ success: true, data: url });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err.message });
  }
};

export const getTransactionURLWidget = async (req: Request, res: Response) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.send({ success: false, error: '"key" is missing.' });
    }

    const response = await apiAxiosInsance.get(
      `/user-payments/get-payment-user?key=${key}`
    );

    if (!response.data.success) {
      return res.send({ success: false, error: 'Payment not found.' });
    }

    const payment = response.data.user;

    if (!payment.tempWallets) {
      return res.send({
        success: false,
        error: 'Wallet is not initialized yet.',
      });
    }

    const tempWalletId = payment.tempWallets[0].tempWalletId;
    const { amount } = payment;
    const wallet = await TempWallet.findById(tempWalletId);

    if (!wallet) {
      res.status(404);
      return res.send({ success: false, error: 'Wallet not found' });
    }

    if (!amount) {
      res.status(404);
      return res.send({ success: false, error: 'Amount is required' });
    }

    // const url = createTransferTxURL(
    //   contracts['MTK'].address,
    //   wallet.address,
    //   amount,
    //   contracts['MTK'].chainId
    // );

    const url = createPaymentURL(
      wallet.address,
      wallet.currency,
      wallet.tag,
      amount
    );

    return res.send({ success: true, data: url });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err.message });
  }
};

export const transferBackToUsers = async (req: Request, res: Response) => {
  try {
    const { childId } = req.params;
    const wallet = await TempWallet.findById(childId).lean();

    if (!wallet) {
      res.status(404);
      return res.send({ success: false, data: null });
    }

    const { senders } = await getSenders(wallet?.address);
    wallet.balance = await getBalance(wallet);

    const resData = {};

    if (senders) {
      for (const [recipientAddress, value] of Object.entries(senders)) {
        const result = await sendFunds(
          recipientAddress,
          wallet.address,
          wallet.privateKey, //todo
          Number(value)
        );

        switch (result.status) {
          case Status.SUCCESS:
          case Status.ZERO_BALANCE:
            resData[recipientAddress] = { success: true };
            break;
          case Status.CONTRACT_ERROR:
          case Status.FAIL:
          case Status.AMOUNT_GREATER_THAN_BALANCE:
            resData[recipientAddress] = { success: false, data: result.data };
            break;
        }
      }
    }
    res.send({ success: true, data: resData });
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};

export const getTempWallet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const wallet = await TempWallet.findById(id);

    if (!wallet) {
      res.status(404);
      return res.send({ success: false, data: null });
    }

    res.send({ success: true, data: wallet });
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};
