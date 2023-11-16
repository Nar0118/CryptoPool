import * as mongoose from 'mongoose';
import { TempWallet } from '../TempWallet';
import { PbPayCoins } from '../../util/constants/contracts';

const Schema = mongoose.Schema;

const walletSchema = new Schema({
  mnemonic: {
    type: String,
    required: false,
  },
  privateKey: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    trim: true,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
  externalId: {
    type: String,
    required: false,
    unique: true,
  },
  merchantId: {
    type: String,
    required: false,
  },
  destination: {
    type: Object,
    default: {},
    required: false,
  },
  totalDepositedAmount: {
    type: Number,
    default: 0,
    required: false,
  },
  currency: {
    type: String,
    required: false,
    default: PbPayCoins.XRP,
  },
  estimatedFiatAmount: {
    type: Number,
    default: 0,
    required: false,
  },
  estimatedFiatCurrency: {
    type: String,
    required: false,
    default: PbPayCoins.XRP,
  },
  notificationUrl: {
    type: String,
    required: false,
  },
});

walletSchema.pre('remove', function (next) {
  TempWallet.countDocuments({ parentWalletId: this._id }, (error, count) => {
    if (error) return next(error);
    if (count > 0)
      return next(new Error("Can't delete parent with existing child"));

    next();
  });
});

export const Wallet = mongoose.model('Wallet', walletSchema);
