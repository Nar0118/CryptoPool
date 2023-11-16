import { ReactNode } from 'react';
import { GeneralResponse } from './auth';
import { CoinsAmount } from './wallet';

export interface ContextProps {
  [key: string]: string | ReactNode;
}

export interface BalanceResponse extends GeneralResponse {
  data?: CoinsAmount;
  bitcoin?: number;
  ethereum?: number;
  dollarBalance?: number;
}
