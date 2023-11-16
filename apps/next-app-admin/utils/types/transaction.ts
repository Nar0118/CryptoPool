import { GeneralResponse } from '.';
import { TransactionData } from 'components/feature/transaction/type';

export interface TransactionResponse extends GeneralResponse {
  data: TransactionData;
}
