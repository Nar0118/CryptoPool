import { PaymentMethod, PbPayCoins } from 'utils/context/auth/constants';

export enum UserRoles {
  ADMIN = 'admin',
  MERCHANT = 'merchant',
}

export interface UserBankAccount {
  accountNumber: string;
  ifscOrSwiftCode: string;
  cardNumber: string;
}

export enum AuthProviders {
  BASIC = 'basic',
  GOOGLE = 'google',
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRoles;
  bankAccount: UserBankAccount;
  authProvider: AuthProviders;
  primaryWalletId: string;
  referralCode: string;
  embed: string;
}

export interface ChildWallet {
  _id: string;
  address: string;
  createdAt: string;
  merchantId: string;
  pbId: string;
  tag: string;
  currency: PbPayCoins;
  estimatedFiatCurrency: PaymentMethod;
}
