import { PaymentType } from 'types/transaction';
import { PbPayCoins } from 'types/payWidgetScreen';
import { imagesSvg } from 'utils/constants/imagesSrc';

export type PaymentNotificationProps = {
  show: boolean;
  recived: number;
  remaining: number;
  type: PaymentType;
  currency: PbPayCoins;
  close: () => void;
};

export const ExtraPayment = {
  header: 'Extra Payment Received',
  footer:
    '*Extra payment will be reverted back to your wallet within 24 hours.',
  remainingText: 'Extra',
  icon: imagesSvg.cancelIconGreen,
};

export const EqualPayment = {
  header: 'Payment Received',
  footer: '',
  remainingText: '',
  icon: imagesSvg.cancelIconGreen,
};

export const PartialPayment = {
  header: 'Partial Payment Received',
  footer: '*Please pay the remaining amount to avoid a failed transaction.',
  remainingText: 'Remaining',
  icon: imagesSvg.cancelIconRed,
};
