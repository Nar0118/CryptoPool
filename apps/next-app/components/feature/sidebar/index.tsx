import { useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'components/shared/image';
import NavItem from 'components/feature/sidebar/navItem';
import logoutIcon from 'public/icons/logout-icon.svg';
import { AuthServiceContext } from 'utils/services/service/authService';
import * as localStorage from 'utils/services/localStorageService';
import navBarPaths from 'utils/constants/navBarPaths';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { navItems, NavItemsTypes } from './types';

import styles from './sidebar.module.scss';

export default function SideBar() {
  const router = useRouter();
  const authService = useContext(AuthServiceContext);
  const currentRoute = router.asPath.split('?')[0];

  const redirectTo = async (): Promise<void> => {
    const logout = await authService.logout();

    if (logout?.success) {
      localStorage.clearLocalStorage();
      router.push(navBarPaths.login);
    }
  };

  return (
    <div className={styles.navBar}>
      <div>
        <div
          className={styles.logoSection}
          onClick={() => router.push(navBarPaths.dashboard)}
        >
          <Image src={imagesSvg.cryptoPoolLogo} width="157" height="60" />
        </div>
        <div className={styles.list}>
          {navItems.map((item: NavItemsTypes) => (
            <NavItem
              key={item.text}
              href={item.href}
              icon={item.icon}
              text={item.text}
              activeIcon={item.activeIcon}
              active={currentRoute === item.href}
            />
          ))}
        </div>
      </div>
      <div className={styles.logoutSection} onClick={redirectTo}>
        <Image src={logoutIcon} width="16" height="16" />
        <span>Logout</span>
      </div>
    </div>
  );
}
