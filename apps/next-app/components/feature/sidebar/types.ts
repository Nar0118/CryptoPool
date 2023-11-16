export interface NavItemProps {
  text: string;
  icon: string;
  active?: boolean;
  activeIcon?: string;
  href: string;
  item?: any;
}

export interface NavItemsTypes {
  text: string;
  icon: string;
  activeIcon: string;
  href: string;
}

export const navItems: NavItemsTypes[] = [
  {
    text: 'Dashboard',
    icon: 'dashboard.svg',
    activeIcon: 'dashboardActive.svg',
    href: '/',
  },
  {
    text: 'Analytics',
    icon: 'analytics.svg',
    activeIcon: 'analyticsActive.svg',
    href: '/analytics',
  },
  {
    text: 'Payments',
    icon: 'payments.svg',
    activeIcon: 'paymentsActive.svg',
    href: '/payments',
  },
  {
    text: 'Orders',
    icon: 'orders.svg',
    activeIcon: 'ordersActive.svg',
    href: '/orders',
  },
  {
    text: 'Notifications',
    icon: 'notifications.svg',
    activeIcon: 'notificationsActive.svg',
    href: '/notifications',
  },
  {
    text: 'Profile',
    icon: 'profile.svg',
    activeIcon: 'profileActive.svg',
    href: '/profile',
  },
  {
    text: 'Settings',
    icon: 'settings.svg',
    activeIcon: 'settingsActive.svg',
    href: '/settings',
  },
];
