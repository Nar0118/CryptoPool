import { PaymentError } from 'components/feature/paymentUser/type';
import { AfterCompletion } from 'components/feature/widgetPaymentModal/types';

export interface ResultWidgetModalProps {
  success: boolean;
  paymentError?: string;
  setPaymentError?: (value: string) => void;
  afterCompletion: AfterCompletion;
}
