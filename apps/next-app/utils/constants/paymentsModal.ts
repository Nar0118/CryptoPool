import { ConversionItem } from 'components/shared/balanceCard/type';
import { imagesSvg } from './imagesSrc';

export interface PaymentsModalProps {
  type: PaymentModalType;
  icon: string;
  title: string;
  href: string;
  width: number;
  height: number;
}

export interface ConversionTypeProps {
  icon: string;
  title?: string;
  type: ConversionItem;
}

export interface InvoiceItem {
  icon: string;
  title: InvoiceItemType;
}

export enum InvoiceItemType {
  Dollar = 'Dollar',
  Rupee = 'Rupee',
}

export enum PaymentModalType {
  API = 'Api',
  INVOICE = 'Invoice',
  SHARE = 'Share',
}

export const paymentsModal: Array<PaymentsModalProps> = [
  {
    type: PaymentModalType.API,
    icon: imagesSvg.generatorApi,
    title: 'Generate API Button',
    href: '/',
    width: 45,
    height: 22,
  },
  {
    type: PaymentModalType.INVOICE,
    icon: imagesSvg.invoiceLink,
    title: 'Generate Invoice Link',
    href: '/',
    width: 26,
    height: 34,
  },
  {
    type: PaymentModalType.SHARE,
    icon: imagesSvg.shareLink,
    title: 'Generate Share Link',
    href: '/',
    width: 30,
    height: 33,
  },
];

export const conversionType: Array<ConversionTypeProps> = [
  {
    icon: imagesSvg.bitcoinCash,
    title: 'Bitcoin',
    type: ConversionItem.BITCOIN,
  },
  {
    icon: imagesSvg.dollarIcon,
    title: 'Dollars',
    type: ConversionItem.DOLLAR,
  },
];

export const invoiceItems: Array<InvoiceItem> = [
  {
    icon: imagesSvg.rupeeIcon,
    title: InvoiceItemType.Rupee,
  },
  {
    icon: imagesSvg.dollarIcon,
    title: InvoiceItemType.Dollar,
  },
];
