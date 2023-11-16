import * as mongoose from 'mongoose';
import {
  AfterCompletionType,
  PaymentProcess,
  PaymentStatus,
  UserPaymentStatus,
} from '../../util/constants/chains';
import { PbPayCoins } from '../../util/types';
import { MerchantRoles } from '../User';

const Schema = mongoose.Schema;

const tempWalletSchema = new Schema({
  isActive: {
    type: Boolean,
    required: true,
  },
  timer: {
    type: String,
    default: null,
  },
  tempWalletId: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  tempWalletPbId: {
    type: String,
    require: false,
    default: null,
  },
  paymentInfo: {
    status: {
      type: PaymentStatus,
      default: PaymentStatus.EMPTY,
    },
    capacity: {
      type: Number,
      default: null,
    },
  },
  isEmailSended: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const userPaymentSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
  },
  amountUSD: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  currency: {
    type: PbPayCoins,
    required: false,
  },
  merchantId: {
    type: String,
    required: false,
  },
  externalId: {
    type: String,
    required: true,
  },
  afterCompletionType: {
    type: AfterCompletionType,
    require: false,
    default: AfterCompletionType.none,
  },
  redirectionUrl: {
    type: String,
    require: false,
    default: null,
  },
  notificationUrl: {
    type: String,
    require: false,
    default: null,
  },
  status: {
    type: UserPaymentStatus,
    require: false,
    default: UserPaymentStatus.INITIALIZED,
  },
  createdAt: {
    type: Date,
    require: false,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    require: false,
    default: null,
  },
  paymentFormat: {
    type: MerchantRoles,
    default: MerchantRoles.MANUALLY_DETAILS,
  },
  key: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 30,
  },
  transactions: {
    type: Schema.Types.ObjectId,
    ref: 'Transactions',
  },
  process: {
    type: PaymentProcess,
    default: PaymentProcess.IN_PROGRESS,
  },
  tempWallets: [tempWalletSchema],
  isActiveUser: {
    type: Boolean,
    required: true,
  },
});

export const UserPayment = mongoose.model('UserPayment', userPaymentSchema);
