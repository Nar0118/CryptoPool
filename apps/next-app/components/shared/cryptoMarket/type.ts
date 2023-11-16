export interface CryptoMarketProps {
  vertical?: boolean;
}

export enum Status {
  LIVE = 'Live',
  UPCOMING = 'Upcoming',
}

export enum Conversion {
  DOLLAR = 'dollar',
  BITCOIN = 'bitcoin',
}

export interface CoinsData {
  bitcoin?: number;
  ethereum?: number;
}
