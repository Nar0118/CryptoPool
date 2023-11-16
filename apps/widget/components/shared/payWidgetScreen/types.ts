import { Currency } from 'components/feature/widgetPaymentModal/types';

export interface PayWidgetScreenProps {
  payAmount: number;
  convertedAmount: number;
  setCurrency: (value: Currency) => void;
  currency: Currency;
  paymentKey: string;
  goBack: () => void;
}

export interface CoinList {
  key: string;
  value: Currency;
}

export enum PaymentMethod {
  USDT = 'USDT',
  BITCOIN = 'Bitcoin',
  XRP = 'XRP',
  USDC = 'USDC',
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

export enum CurrencyNetworks {
  ERC_20 = 'ERC - 20',
}
