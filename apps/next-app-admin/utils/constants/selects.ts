import { CoinType, OrderStatus } from 'types/order';

export interface CoinsOptionType {
  value: CoinType;
}

export interface StatusOptionType {
  value: OrderStatus;
}

export const coinTypes: Array<CoinsOptionType> = [
  {
    value: CoinType.BITCOIN,
  },
  {
    value: CoinType.ETHEREUM,
  },
  {
    value: CoinType.LITECOIN,
  },
  {
    value: CoinType.USD,
  },
];

export const ordersStatuses: Array<StatusOptionType> = [
  {
    value: OrderStatus.PENDING,
  },
  {
    value: OrderStatus.FAILED,
  },
  {
    value: OrderStatus.DONE,
  },
];
