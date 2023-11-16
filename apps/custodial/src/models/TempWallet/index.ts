import * as mongoose from 'mongoose';
import { getContractRPC } from '../../walletManager/getContractRPC';
import { contracts } from '../../util/constants/contracts';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const tempWalletSchema = new Schema({
  address: {
    type: String,
    required: false,
  },
  mnemonic: {
    type: String,
    required: false,
  },
  privateKey: {
    type: String,
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
  },
  merchantId: {
    type: String,
    required: false,
  },
  destination: {
    type: Object,
    required: false,
    default: {},
  },
  totalDepositedAmount: {
    type: Number,
    required: false,
    default: 0,
  },
  currency: {
    type: String,
    required: false,
  },
  estimatedFiatAmount: {
    type: Number,
    required: false,
    default: 0,
  },
  estimatedFiatCurrency: {
    type: String,
    required: false,
  },
  notificationUrl: {
    type: String,
    required: false,
  },
  parentWalletId: {
    type: ObjectId,
    ref: 'Wallet',
    required: false,
  },
  pbId: {
    type: String,
    required: false,
  },
  tag: {
    type: String,
    required: false,
    default: null,
  },
});

tempWalletSchema.pre('remove', async function (next) {
  const [usdtContract] = getContractRPC(contracts['MTK']);

  if (!usdtContract) {
    return next(new Error('Some error has occurred'));
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const balance = await usdtContract.methods.balanceOf(this.address).call();
  if (BigInt(balance)) {
    return next(new Error('Child has positive balance'));
  }
  next();
});

export const TempWallet = mongoose.model('TempWallet', tempWalletSchema);
