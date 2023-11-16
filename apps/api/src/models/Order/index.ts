import * as mongoose from 'mongoose';
import { dateParser } from '../../util/helpers';

export enum CoinType {
  BITCOIN = 'bitcoin',
  USDT = 'usdt',
  ETHEREUM = 'ethereum',
  LITECOIN = 'liteCoin',
  XRP = 'ripple',
}

export enum OrderStatus {
  DONE = 'done',
  PENDING = 'pending',
  FAILED = 'failed',
}

const Schema = mongoose.Schema;

const currentDate = dateParser(new Date());
const orderSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  coinType: {
    type: String,
    enum: CoinType,
    default: CoinType.USDT,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  },
  orderTime: {
    type: Date,
    default: currentDate,
  },
  merchantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  walletId: {
    type: Schema.Types.Mixed,
  },
});

export const Order = mongoose.model('Order', orderSchema);
