import { Request, Response } from 'express';
import { User } from '../../models/User';
import { Order, OrderStatus } from '../../models/Order';

export const registerOrder = async (req: Request, res: Response) => {
  try {
    const { identificationToken, orderId } = req.body;

    const merchant = await User.findOne({ identificationToken });

    if (!merchant)
      return res.json({ success: false, error: 'Merchant not found' });

    let isOrderExist;
    if (orderId) isOrderExist = await Order.findById(orderId);

    if (isOrderExist) return res.json({ success: true, data: isOrderExist });

    const data = await Order.create({ ...req.body, merchantId: merchant.id });

    return res.json({ success: true, data });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    const count = await Order.collection.countDocuments();
    const data = await Order.find()
      .skip(offset)
      .populate('merchantId')
      .limit(limit);

    return res.send({ success: true, data, count });
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};

export const getCurrentUserOrders = async (req: Request, res: Response) => {
  try {
    const user = req['user'];

    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    const filter = {
      merchantId: user.id,
    };

    const count = await Order.collection.countDocuments(filter);
    const orders = await Order.find(filter)
      .skip(offset)
      .populate('merchantId')
      .limit(limit);

    if (!orders) res.send({ success: false, error: "Orders doesn't exist" });

    return res.send({ success: true, data: orders, count });
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) res.send({ success: false, error: "Order doesn't exist" });

    return res.send(order);
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id, identificationToken } = req.query;

    const merchant = await User.findOne({ identificationToken });

    if (!merchant)
      return res.json({ success: false, error: 'Merchant not found' });

    const order = await Order.findOneAndUpdate(
      {
        _id: id,
        merchantId: merchant.id,
      },
      req.body
    );

    if (req.body.status !== OrderStatus.PENDING) {
      order.walletId = undefined;
      await order.save();
    }

    return res.send({ success: true, data: order });
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Order.deleteOne({ _id: id });

    return res.send({ success: true });
  } catch (err) {
    res.send({ success: false, error: err.message });
  }
};
