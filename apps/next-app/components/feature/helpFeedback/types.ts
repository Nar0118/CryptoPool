export interface HelpProfile {
  helpCenter: string;
  href: string;
  firstText: string;
  secondText: string;
  thirdText: string;
}

export const helpProfile: Array<HelpProfile> = [
  {
    helpCenter: 'Customer Support Help Center',
    href: '/',
    firstText: 'Common rejection for verification documents?',
    secondText: 'How can i verify my source of funds?',
    thirdText: 'How can i verify my identity?',
  },
  {
    helpCenter: 'B2B Partner Help Center',
    href: '/',
    firstText: 'Is it safe to send cryptocurrency?',
    secondText: 'How to setup my account?',
    thirdText: 'Where to check my recent transactions?',
  },
];
