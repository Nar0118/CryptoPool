import * as mongoose from 'mongoose';
import * as shortid from 'shortid';

export enum UserRoles {
  MERCHANT = 'merchant',
  ADMIN = 'admin',
}

export enum AuthProviders {
  BASIC = 'basic',
  GOOGLE = 'google',
}

export enum MerchantRoles {
  MANUALLY_DETAILS = 'manuallyDetails',
  AT_ONCE_DETAILS = 'atOnceDetails',
}

const embedType = {
  otherPayment: '/image/otherPayments.svg',
  cryptoCurrency: '/image/cryptoCurrency.svg',
};

const Schema = mongoose.Schema;
const bankAccountSchema = new Schema({
  accountNumber: {
    type: String,
    default: null,
  },
  ifscOrSwiftCode: {
    type: String,
    default: null,
  },
  cardNumber: {
    type: String,
    default: null,
  },
});

const userSchema = new Schema({
  fullName: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    default: null,
    select: false,
  },
  role: {
    type: String,
    default: UserRoles.MERCHANT,
    required: true,
    immutable: true,
  },
  paymentFormat: {
    type: MerchantRoles,
    required: true,
    default: MerchantRoles.MANUALLY_DETAILS,
  },
  bankAccount: {
    type: bankAccountSchema,
    default: null,
  },
  authProvider: {
    type: String,
    default: AuthProviders.BASIC,
    enum: AuthProviders,
  },
  emailVerificationCode: {
    type: Schema.Types.Mixed,
  },
  referralCode: {
    type: String,
    required: true,
    default: shortid.generate,
  },
  embed: {
    type: String,
    default: embedType.otherPayment,
  },
  primaryWalletId: {
    type: String,
    default: null,
  },
  identificationToken: {
    type: String,
    unique: true,
    required: true,
  },
});

export const User = mongoose.model('User', userSchema);
