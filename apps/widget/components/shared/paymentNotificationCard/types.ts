import { PaymentType } from 'types/transaction';
import { PbPayCoins } from 'types/payWidgetScreen';
import { ExtraPayment, PartialPayment } from '../transactionNotification/types';
import { imagesSvg } from 'utils/constants/imagesSrc';

export type PaymentNotificationCardProps = {
  recived: number;
  remaining: number;
  type: PaymentType;
  info: BaseInfo;
  currency: PbPayCoins;
  close: () => void;
};

interface BaseInfo {
  header: string;
  footer: string;
  remainingText: string;
  icon: string;
}
