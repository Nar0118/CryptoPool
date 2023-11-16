import { GeneralResponse } from '.';
import { Wallet } from 'components/feature/wallet/type';

export interface WalletResponse extends GeneralResponse {
  data: Array<Wallet>;
}
