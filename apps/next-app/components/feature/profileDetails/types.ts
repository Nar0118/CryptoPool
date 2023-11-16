export interface MerchantDetail {
  title: string;
  icon: string;
  href: string;
}

export const merchantDetails: Array<MerchantDetail> = [
  {
    title: 'Refund Requests',
    icon: 'arrowRight.svg',
    href: '/',
  },
  {
    title: 'Settlement Details',
    icon: 'arrowRight.svg',
    href: '/',
  },
];
