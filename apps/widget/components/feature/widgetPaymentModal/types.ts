import {
  CurrencyNetworks,
  PaymentMethod,
  PbPayCoins,
} from 'components/shared/payWidgetScreen/types';
import { ChildWallet } from 'utils/model/user';
import { IPaymentUser, PaymentError } from '../paymentUser/type';

export interface WidgetPaymentModalProps {
  open: boolean;
  primaryWalletId: string;
  amount: number;
  timer: string;
  isActive: boolean;
  tempWallet: ChildWallet;
  updateData: () => void;
  userData: IPaymentUser;
  setUserData: (IPaymentUser) => void;
  updateWalletData: (user: IPaymentUser) => void;
  paymentError: string;
  setPaymentError: (value: string) => void;
  isFetched: boolean;
  merchantId: string;
}

export interface Currency {
  name: PaymentMethod | string;
  convertedValue: number;
  token: PbPayCoins;
  network?: CurrencyNetworks;
}

export enum AfterCompletionType {
  redirect = 'redirect',
  none = 'none',
}

export type AfterCompletion = {
  type: AfterCompletionType;
  url: string;
};
