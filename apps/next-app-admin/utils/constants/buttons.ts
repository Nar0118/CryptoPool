export interface RedirectButtonItem {
  text: string;
  link: string;
}

export const buttonPaths = {
  users: '/users',
  admins: '/admins',
  orders: '/orders',
  invoices: '/invoices',
  transactions: '/transactions',
  tempWallets: '/tempwallet',
  wallets: '/wallet',
  userPayments: '/userpayments',
};

export const redirectButtons: Array<RedirectButtonItem> = [
  {
    text: 'Users',
    link: buttonPaths.users,
  },
  {
    text: 'Admins',
    link: buttonPaths.admins,
  },
  // {
  //   text: 'Orders',
  //   link: buttonPaths.orders,
  // },
  {
    text: 'Invoices',
    link: buttonPaths.invoices,
  },
  {
    text: 'Transactions',
    link: buttonPaths.transactions,
  },
  {
    text: 'Temp Wallets',
    link: buttonPaths.tempWallets,
  },
  {
    text: 'Wallets',
    link: buttonPaths.wallets,
  },
  {
    text: 'User Payments',
    link: buttonPaths.userPayments,
  },
];

export const notificationIcons = {
  success: 'success',
  fail: 'fail',
};
