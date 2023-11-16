import {
  TempWalletsType,
  UserPaymentStatus,
} from 'components/feature/paymentUser/type';
import { PbPayCoins } from './payWidgetScreen';

export enum PaymentFormat {
  MANUALLY_DETAILS = 'manuallyDetails',
  AT_ONCE_DETAILS = 'atOnceDetails',
}

export interface AuthPaymentResponse {
  user: {
    key: string;
    amount: number;
    tempWallets: TempWalletsType[];
    isActiveUser: boolean;
    email: string;
    merchantId: string;
    status?: UserPaymentStatus;
    success: boolean;
    currency: PbPayCoins | null;
    error?: string;
    paymentFormat: PaymentFormat;
  };
  message?: string;
}
