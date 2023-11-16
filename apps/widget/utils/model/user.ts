import {
  PaymentMethod,
  PbPayCoins,
} from 'components/shared/payWidgetScreen/types';
import { PaymentFormat } from 'types/paymentAuth';

export interface UserBankAccount {
  accountNumber: string;
  ifscOrSwiftCode: string;
  cardNumber: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  bankAccount: UserBankAccount;
  primaryWalletId: string;
  referralCode: string;
  embed: string;
  paymentFormat: PaymentFormat;
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
