import { Request, Response } from 'express';
import { axiosInstance } from '../../util/custodial';

export const getAllWallets = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    const response = await axiosInstance.get(
      `/wallets?limit=${limit}&offset=${offset}`
    );

    return res.send(response.data);
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};

export const getAllChildrenWallets = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    const response = await axiosInstance.get(
      `/wallets/children?limit=${limit}&offset=${offset}`
    );

    return res.send(response.data);
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};
