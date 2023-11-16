import { GeneralResponse } from '.';
import { TempWallet } from 'components/feature/tempwallet/type';

export interface TempWalletResponse extends GeneralResponse {
  data: Array<TempWallet>;
}
