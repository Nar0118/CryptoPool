import { UserPaymentResponse } from './constants/chains';

export interface CoinItem {
  base: string;
  coinId: string;
}

export enum Coins {
  BTC = 'BTC',
  ETH = 'ETH',
  USDT = 'USDT',
  USD = 'USD',
  XRP = 'XRP',
}

export enum PbPayCoins {
  ADA = 'ADA',
  BTC = 'BTC',
  ETH = 'ETH',
  BCH = 'BCH',
  BNB = 'BNB',
  DASH = 'DASH',
  DOGE = 'DOGE',
  LTC = 'LTC',
  MATIC = 'MATIC_POLYGON_MUMBAI',
  SOL = 'SOL',
  TRX = 'TRX',
  USDC = 'USDC',
  USDT = 'USDT_ERC20',
  XRP = 'XRP',
}

export interface MerchantWallets {
  childId: string;
  parentId: string;
  amount: number;
  email: string;
  key: string;
}

export interface MakeInitiatePaymentResponse {
  paymentUrl: string;
  paymentDetails: UserPaymentResponse;
}
export interface MakePaymentStatusResponse {
  paymentDetails: UserPaymentResponse;
}

export interface CheckRequiredParamsResponse {
  isFulfilled: boolean;
  missed: string[];
}
