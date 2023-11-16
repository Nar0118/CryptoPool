import { ChildWallet, User } from 'utils/model/user';
import { PbPayCoins } from 'types/payWidgetScreen';
import { AfterCompletionType } from '../widgetPaymentModal/types';

export type TempWalletsType = {
  timer: string;
  tempWalletId: string;
  isActive: boolean;
  createdAt: string;
};

export type IPaymentUser = {
  key: string;
  amount: number;
  amountUSD?: number;
  tempWallets: TempWalletsType[];
  isActiveUser: boolean;
  merchantId: string;
  status?: UserPaymentStatus;
  currency: PbPayCoins | null;
  email: string;
  error?: string;
  afterCompletionType?: AfterCompletionType;
  redirectionUrl?: string;
} | null;

export interface IPaymentUserData {
  key: string;
  amountUSD?: number;
  timer: string;
  isActive?: boolean;
  email: string;
  error?: string;
  tempWallet: ChildWallet;
  updateData: () => void;
  userData: IPaymentUser;
  setUserData: (IPaymentUser) => void;
  updateWalletData: (user: IPaymentUser) => void;
  paymentError?: string;
  setPaymentError: (value: string) => void;
  isFetched?: boolean;
  merchant: User;
  setMerchant: (value: User) => void;
}

export type ITimerData = {
  minute: number;
  second: number;
};

export enum UserPaymentStatus {
  INITIALIZED = 'initialized',
  SUCCESS = 'success',
  FAILED = 'failed',
  EXPIRED = 'expired',
  PARTIAL = 'partial',
  VOIDED = 'voided',
}

export type PaymentError = {
  paymentType: UserPaymentStatus | null;
  error: string;
};

export type PaymentData = {
  email: string;
  key: string;
};
