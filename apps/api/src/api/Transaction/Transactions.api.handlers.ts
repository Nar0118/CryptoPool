import { Request, Response } from 'express';
import axios from 'axios';
import { Transaction } from '../../models/Transactions';
import env from '../../util/constants/env';

export const registerTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.create({ ...req.body });

    return res.json({ success: true, data: transaction });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    const count = await Transaction.collection.countDocuments();
    const data = await Transaction.find().skip(offset).limit(limit);

    return res.send({ success: true, data, count });
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};

export const getTransactionByHash = async (req: Request, res: Response) => {
  try {
    const { hash } = req.query;

    const transaction = await Transaction.findOne({
      hash,
    });
    if (!transaction) return res.json({ success: false });

    return res.json({ success: true, data: transaction });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
};

export const checkTransactions = async (array) => {
  try {
    let balance = 0;
    const res = await Promise.all(
      array.map(async (item) => {
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
        } = item;
        await Transaction.findOneAndUpdate(
          {
            hash: item?.transactionHash,
          },
          {
            pbId: id,
            transactionHash,
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
          },
          { upsert: true }
        );
        balance += amount;
        return item;
      })
    );
    return { balance, lastTransaction: res[res.length - 1] };
  } catch (err) {
    console.log(err.message);
  }
};

export const getTxBlockchainData = async (req: Request, res: Response) => {
  try {
    const { hash } = req.params;

    const response = await axios.get(
      `${env.etherscanApiUrl}&module=proxy&action=eth_getTransactionByHash&txhash=${hash}`
    );

    if (response.data.error) {
      throw new Error(response.data.error.message);
    }

    return res.json({ success: true, data: response.data.result });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
};
