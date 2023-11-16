import { MerchantRoles } from '../../models/User';
import { PbPayCoins } from '../types';

export interface ChainInfo {
  rpcUrl;
  wsUrl;
  name;
  currency;
}

export const chains: { [key: number]: ChainInfo } = {
  5: {
    rpcUrl:
      'https://eth-goerli.g.alchemy.com/v2/0BqaJuVoB5TQEXNkQOuE8KqIlrepb2Kq',
    wsUrl: 'wss://eth-goerli.g.alchemy.com/v2/0BqaJuVoB5TQEXNkQOuE8KqIlrepb2Kq',
    name: 'Goerli testnet',
    currency: 'ETH',
  },
};

export enum PaymentStatus {
  EXTRA = 'extra',
  PARTIAL = 'partial',
  EQUAL = 'equal',
  EMPTY = 'empty',
}

export enum NotificationTypes {
  TRANSACTION = 'TRANSACTION',
}

export enum PaymentType {
  EXTRA = 'extra',
  PARTIAL = 'partial',
  EQUAL = 'equal',
}

export enum UserPaymentStatus {
  INITIALIZED = 'initialized',
  PARTIAL = 'partial',
  SUCCESS = 'success',
  FAILED = 'failed',
  VOIDED = 'voided',
}

export enum PaymentProcess {
  FINISHED = 'finished',
  IN_PROGRESS = 'inProgress',
}

export type UserPaymentResponse = {
  paymentId: string;
  status?: UserPaymentStatus;
  completedAt?: Date;
  createdAt?: Date;
  merchantId?: string;
  externalId?: string;
  amount?: number;
  currency?: PbPayCoins;
  message?: string;
  less?: number;
  more?: number;
};

export type PaymentTempWallet = {
  isActive: boolean;
  timer: string;
  tempWalletId: string;
  tempWalletPbId: string;
  paymentInfo: {
    status: PaymentStatus;
    capacity: number | null;
  };
  isEmailSended: boolean;
  createdAt: Date;
};

export type Payment = {
  id: string;
  email: string;
  amount: number;
  currency: PbPayCoins;
  merchantId: string;
  externalId: string;
  afterCompletionType: AfterCompletionType;
  redirectionUrl: string;
  notificationUrl: string;
  status: UserPaymentStatus;
  createdAt: Date;
  completedAt: Date;
  paymentFormat: MerchantRoles;
  key: string;
  tempWallets: PaymentTempWallet[];
  isActiveUser: boolean;
  process?: PaymentProcess;
};

export enum AfterCompletionType {
  redirect = 'redirect',
  none = 'none',
}

export const PaymentErrorText = {
  success:
    'The payment has already been completed successfully. The URL is no longer valid.',
  fail:
    'The payment has already been completed unsuccessfully. The URL is no longer valid.',
  notFound: 'Something went wrong, please re-initiate the payment!',
};
