import { imagesSvg } from 'utils/constants/imagesSrc';

export interface PaymentsSettingsProps {
  title?: string;
  settingsArray?: Array<PaymentCard>;
}

export interface PaymentCard {
  icon?: string;
  title?: string;
  href: string;
  width?: number;
  height?: number;
}

export const paymentsSettings: Array<PaymentCard> = [
  {
    title: 'API Button Settings',
    href: '/',
  },
  {
    icon: imagesSvg.linkSettings,
    title: 'Link Settings',
    href: '/',
    width: 30,
    height: 30,
  },
  {
    icon: imagesSvg.invoiceIcon,
    title: 'Invoice Settings',
    href: '/',
    width: 23,
    height: 30,
  },
  {
    icon: imagesSvg.qrIcon,
    title: 'QR Settings',
    href: '/',
    width: 30,
    height: 30,
  },
  {
    title: 'Refund Requests',
    href: '/',
  },
];
