import {
  Payment,
  PaymentProcess,
  UserPaymentResponse,
  UserPaymentStatus,
} from './constants/chains';
import { PBPayConfigs } from './constants/config';
import env from './constants/env';
import { axiosInstance } from './custodial';
import {
  CheckRequiredParamsResponse,
  CoinItem,
  MakeInitiatePaymentResponse,
} from './types';

export const dateParser = (date: Date): number => {
  return Date.parse(date.toString());
};

export const isValidUrl = (input: string): boolean => {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

  return urlRegex.test(input);
};

export const checkRequiredParams = (arr): CheckRequiredParamsResponse => {
  const required = [
    'currency',
    'amount',
    'merchantId',
    'externalId',
    'afterCompletionType',
    'notificationUrl',
  ];

  let isFulfilled = true;
  const missed = [];
  for (let i = 0; i < required.length; i++) {
    if (!arr.hasOwnProperty(required[i])) {
      if (isFulfilled) {
        isFulfilled = false;
      }
      missed.push(required[i]);
    }
  }
  return { isFulfilled, missed };
};

export const getPaymentTransactions = async (
  merchantId: string,
  childId: string
) => {
  const childWalletResponse = await axiosInstance.get(
    `/wallets/children/${childId}/pbp`
  );

  const res = childWalletResponse.data.updatedTransactions;
  return res;
};

export const makeInitiatePaymentResponse = (
  payment: Payment
): MakeInitiatePaymentResponse => {
  const { status, key } = payment;
  const paymentUrl = `${env.deployedFrontendUrl}?key=${key}`;

  const paymentDetails: UserPaymentResponse = {
    paymentId: payment.id,
    status,
  };

  if (payment.status === UserPaymentStatus.VOIDED) {
    paymentDetails.createdAt = payment.createdAt;
  } else {
    paymentDetails.completedAt = payment.completedAt;
  }
  return { paymentUrl, paymentDetails };
};

export const isObjectEmpty = (obj: object): boolean => {
  if (obj && typeof obj === 'object') {
    return Object.keys(obj).length === 0;
  }
  return false;
};

const UserMessages = {
  success: 'Payment Successful: Your payment has been completed successfully.',
  failed:
    'Payment Expired: The payment request has reached its time limit and is no longer valid.',
  partial:
    "Partial Payment: You've transferred a portion of the required funds.",
};

const generateTextForStatus = (
  status: UserPaymentStatus,
  process: PaymentProcess
): string => {
  if (process === PaymentProcess.IN_PROGRESS) {
    return 'Payment is in progress.';
  }
  switch (status) {
    case UserPaymentStatus.SUCCESS:
      return UserMessages.success;
    case UserPaymentStatus.FAILED:
      return UserMessages.failed;
    case UserPaymentStatus.PARTIAL:
      return UserMessages.partial;
    default:
      return '';
  }
};

// Initializing the final response for /Initiate API
export const makePaymentStatusResponse = (payment: Payment) => {
  const {
    status,
    id,
    merchantId,
    externalId,
    amount,
    currency,
    process,
  } = payment;
  const message = generateTextForStatus(status, process);

  const paymentDetails: UserPaymentResponse = {
    paymentId: id,
    merchantId,
    externalId,
    amount,
    currency,
    message,
  };

  if (payment.status === UserPaymentStatus.VOIDED) {
    paymentDetails.createdAt = payment.createdAt;
  } else {
    paymentDetails.completedAt = payment.completedAt;
  }

  return { paymentDetails };
};

export const isValidMongoId = (id: string): boolean => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;

  return objectIdPattern.test(id);
};

export const coinsAbbreviation = (coins: Array<string>): Array<string> => {
  const data = [];
  coins.map((item: string) => {
    coinsData.map((element: CoinItem) => {
      if (item === element.base) data.push(element.base);
    });
  });
  return data;
};

export const coinsData: Array<CoinItem> = [
  {
    base: 'ETH',
    coinId: 'ethereum',
  },
  {
    base: 'BTC',
    coinId: 'bitcoin',
  },
  {
    base: 'USDT_ERC20',
    coinId: 'tether',
  },
  {
    base: 'USDC',
    coinId: 'usd-coin',
  },
  {
    base: 'XRP',
    coinId: 'ripple',
  },
];
