import { Invoice } from 'components/feature/invoice/types';
import { GeneralResponse } from '.';

export interface InvoiceResponse extends GeneralResponse {
  data?: Array<Invoice>;
}
