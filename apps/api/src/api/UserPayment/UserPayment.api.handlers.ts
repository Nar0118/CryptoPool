import { Request, Response } from 'express';
import { UserPayment } from '../../models/UserPayment';
import { generateKey } from '../../util/generateUniqueKey';
import { getUTCTime } from '../../util/getTime';
import { axiosInstance } from '../../util/custodial';
import { PaymentProcess, UserPaymentStatus } from '../../util/constants/chains';
import { PaymentErrorText } from '../../util/constants/chains';

/**
 * Get active user.
 *
 * @param email - Express request object
 * @param key - Express response object
 * */
const getActiveUser = async (email: string, key?: string) => {
  const param = email && key ? { isActiveUser: true } : {};
  if (key) Object.assign(param, { key });
  if (email) Object.assign(param, { email });
  return await UserPayment.findOne(param);
};

/**
 * Get user active temp wallet.
 *
 * @param tempWallets - Express request object
 *
 * */
const getUserActiveWallet = (tempWallets) =>
  tempWallets.find(({ isActive }) => isActive);

/**
 * Get active user temp wallet.
 *
 * @param req - Express request
 * @param res - Express request
 * */
export const getUserTempWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const _id = id;

    if (!_id) {
      return res.json({ success: false, message: 'Invalid id' });
    }

    const tempWallet = await axiosInstance.get(
      `/wallets/get-temp-wallet/${_id}`
    );

    return res.json({ success: true, data: tempWallet.data.data });
  } catch (err) {
    res.status(404);
    res.send({
      success: false,
      error: err,
      message: err.message,
    });
  }
};

/**
 * Create a new user for temporary wallet.
 *
 * @param req - Express request object
 * @param res - Express response object
 * */
export const authUserPayment = async (req: Request, res: Response) => {
  try {
    const { email, amountUSD, merchantId } = req.body;
    if (!email || !amountUSD || !merchantId) {
      return res.json({
        success: false,
        error: 'Submit all required parameters',
      });
    }

    if (amountUSD <= 10) {
      return res.json({
        success: false,
        error: 'Amount can not be lower than 10',
      });
    }

    const user = await getActiveUser(email);

    if (user && user.isActiveUser) {
      const tempWallet = getUserActiveWallet(user.tempWallets);

      if (tempWallet) {
        return res.json({
          success: true,
          userPayment: user,
        });
      }

      await UserPayment.findOneAndUpdate(
        { email, key: user.key },
        { isActiveUser: false }
      );
    }

    const key = generateKey(email);

    const defaultDate = new Date().toLocaleString('en-US', {
      timeZone: 'UTC',
    });

    const userPayment = await UserPayment.create({
      key,
      email,
      externalId: key,
      amountUSD,
      isActiveUser: true,
      merchantId,
      createdAt: defaultDate,
    });

    return res.json({ success: true, userPayment });
  } catch (err) {
    res.status(404);
    res.send({
      success: false,
      error: err,
      message: err.message,
    });
  }
};

/**
 * Get all users payment user.
 *
 * @param req - Express request object
 * @param res - Express response object
 * */
export const getAllUsersPayments = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    const usersCount = await UserPayment.collection.countDocuments();
    const users = await UserPayment.find().skip(offset).limit(limit);

    return res.send({ data: users, count: usersCount });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err });
  }
};

/**
 * Get user payment user.
 *
 * @param req - Express request object
 * @param res - Express response object
 * */
export const getPaymentUser = async (req: Request, res: Response) => {
  try {
    const { key } = req.query;
    if (!key) {
      return res.json({
        success: false,
        error: '"key" is missing.',
      });
    }

    const user = await UserPayment.findOne({
      key,
    });

    let message = '';

    switch (user?.status) {
      case UserPaymentStatus.SUCCESS:
        message = PaymentErrorText.success;
        break;
      case UserPaymentStatus.FAILED:
      case UserPaymentStatus.PARTIAL:
        message = PaymentErrorText.fail;
        break;
    }

    if (!user) {
      return res.json({
        status: 404,
        message: PaymentErrorText.notFound,
      });
    }

    const result = {
      user,
      message,
    };

    return res.json({ success: true, ...result });
  } catch (err) {
    res.status(404);
    res.send({
      success: false,
      error: err,
      message: err.message,
    });
  }
};

/**
 * Get user payment user by id and key.
 *
 * @param req - Express request object
 * @param res - Express response object
 * */
export const getPaymentUserById = async (req: Request, res: Response) => {
  try {
    const { id, key } = req.params;

    const user = await UserPayment.findOne({ _id: id, key });

    if (!user) {
      return res.json({
        status: 404,
        error: 'User not found',
      });
    }

    return res.json({ success: true, user });
  } catch (err) {
    res.status(404);
    res.send({
      success: false,
      error: err,
      message: err.message,
    });
  }
};

/**
 * Disabled is active user.
 *
 * @param req - Express request object
 * @param res - Express response object
 * */
export const disabledActiveUser = async (req: Request, res: Response) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.json({
        success: false,
        error: '"key" is missing.',
      });
    }
    const user = await UserPayment.findOne({ key, isActiveUser: true });

    if (!user) {
      return res.json({
        status: 404,
        error: 'User not found',
      });
    }

    const tempWallets = user.tempWallets.map((wallet) => {
      if (wallet.isActive) {
        wallet.isActive = false;
      }
      return wallet;
    });

    await UserPayment.findOneAndUpdate(
      { key, isActiveUser: true },
      { tempWallets, isActiveUser: false }
    );

    return res.json({ success: true });
  } catch (err) {
    res.status(404);
    res.send({
      success: false,
      error: err,
      message: err.message,
    });
  }
};

/**
 * Update payment user data walletId and  tomer.
 *
 * @param req - Express request object
 * @param res - Express response object
 * */
export const updateUserData = async (req: Request, res: Response) => {
  try {
    const {
      email,
      key,
      _id,
      createdAt,
      tempWalletPbId,
      currencyToken,
      convertedAmount,
    } = req.body;

    const numericConvertedAmount = Number(convertedAmount);

    if (!key) {
      return res.json({
        success: false,
        error: '"key" is required parameter',
      });
    }

    const user = await getActiveUser(email?.toString(), key?.toString());

    if (!user) {
      return res.json({
        status: 404,
        error: 'User not found',
      });
    }
    let updateUser = null;
    if (user.timer == null) {
      const defaultDate = new Date(createdAt);

      const tempWallets = [
        ...user.tempWallets,
        {
          tempWalletId: _id,
          timer: getUTCTime(),
          isActive: true,
          createdAt: defaultDate,
          tempWalletPbId: tempWalletPbId || null,
        },
      ];

      const updatedCurrency = currencyToken ?? user.currency;

      updateUser = await UserPayment.findOneAndUpdate(
        { email, key, isActiveUser: true },
        {
          tempWallets,
          amount: numericConvertedAmount,
          currency: updatedCurrency,
        }
      );
    }

    if (!updateUser) {
      return res.json({
        status: 404,
        error: 'update not exist',
      });
    }

    return res.json({ success: true });
  } catch (err) {
    res.status(404);
    res.send({
      success: false,
      error: err,
      message: err.message,
    });
  }
};
