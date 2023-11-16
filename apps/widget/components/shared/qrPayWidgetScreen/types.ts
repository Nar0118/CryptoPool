import { Currency } from 'components/feature/widgetPaymentModal/types';
import { PaymentType } from 'types/transaction';
import { ChildWallet } from 'utils/model/user';

export interface QrPayWidgetScreenProps {
  primaryWalletId: string;
  currency: Currency;
  payAmount: number;
  setIsSuccess: (value: boolean) => void;
  timer: string;
  email: string;
  paymentKey: string;
  tempWallet: ChildWallet;
  updateData: () => void;
  goBack: () => void;
}

export type Payment = {
  id: string;
  amount: number;
  balance: number;
  type: PaymentType;
  capacity: number;
};

export const CookiesKeys = {
  LAST_PAYMENT: 'lastPayment',
  LAST_PAYMENT_ID: 'lastPaymentId',
};
