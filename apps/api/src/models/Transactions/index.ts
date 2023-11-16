import * as mongoose from 'mongoose';
import { dateParser } from '../../util/helpers';
import { PbPayCoins } from '../../util/types';

const Schema = mongoose.Schema;

const currentDate = dateParser(new Date());

const walletSchema = new Schema({
  id: {
    type: String,
    required: false,
  },
  externalId: {
    type: String,
    required: false,
  },
});

const destinationSchema = new Schema({
  id: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
});

const transactionSchema = new Schema({
  pbId: {
    type: String,
    required: false,
  },
  wallet: {
    type: walletSchema,
    required: false,
  },
  destination: {
    type: destinationSchema,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  subStatus: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: false,
  },
  from: {
    type: String,
    required: false,
  },
  to: {
    type: String,
    required: false,
  },
  currency: {
    type: PbPayCoins,
    required: false,
  },
  estimatedFiatAmount: {
    type: Number,
    default: 0,
    required: false,
  },
  estimatedFiatCurrency: {
    type: PbPayCoins,
    required: false,
  },
  notificationUrl: {
    type: String,
    required: false,
  },
  hash: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
    default: currentDate,
  },
  modifiedAt: {
    type: Date,
    required: false,
    default: currentDate,
  },
  completedAt: {
    type: Date,
    require: false,
  },
});

export const Transaction = mongoose.model('Transaction', transactionSchema);
