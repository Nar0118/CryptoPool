import { ReactNode } from 'react';
import { GeneralResponse } from '.';
import { UserRoles } from 'utils/constants/userRoles';

export interface ContextProps {
  [key: string]: string | ReactNode;
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

export enum PaymentFormat {
  MANUALLY_DETAILS = 'manuallyDetails',
  AT_ONCE_DETAILS = 'atOnceDetails',
}

export const PaymentFormatText = {
  manually: 'Manually details',
  atOnce: 'At Once details',
};

export interface User {
  _id: string;
  fullName: string;
  email: string;
  bankAccount: UserBankAccount;
  authProvider: AuthProviders;
  referralCode: string;
  primaryWalletId: string;
  paymentFormat?: PaymentFormat;
}

export interface UserPayments {
  _id: string;
  key: string;
  email: string;
  tempWalletId: string | null;
  amount: number;
  isActive: boolean;
}

export interface UserResponse extends GeneralResponse {
  data?: User;
}

export interface UserAllDataResponse extends GeneralResponse {
  data?: Array<User>;
}
