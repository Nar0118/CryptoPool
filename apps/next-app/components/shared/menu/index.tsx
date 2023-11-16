import { useContext } from 'react';
import { useRouter } from 'next/router';
import Icon from 'components/shared/icon';
import Notification from 'components/shared/notification';
import { AuthServiceContext } from 'utils/services/service/authService';
import { removeItemFromLocalStorage } from 'utils/services/localStorageService';
import localStorageKeys from 'utils/constants/localStorageKeys';
import navBarPaths from 'utils/constants/navBarPaths';
import { warningModalContent } from 'utils/constants/fakeData';
import { MenuItemType, MenuType } from './types';

import styles from './menu.module.scss';

export default function Menu({ menu, changeVisible }: MenuType): JSX.Element {
  const router = useRouter();

  const authService = useContext(AuthServiceContext);

  const redirectTo = async (path: string) => {
    if (path === navBarPaths.login) {
      const logout = await authService.logout();

      if (logout?.success) {
        Notification(logout.message, warningModalContent.acceptModalIcon);
        removeItemFromLocalStorage(localStorageKeys.TOKEN_KEY);
        router.push(navBarPaths.login);
      } else {
        Notification(
          logout?.error ?? 'You are not registered',
          warningModalContent.filedModalIcon
        );
      }
    } else {
      router.push(path);
    }
    changeVisible();
  };

  return (
    <div className={styles.dropdown}>
      {menu.map((item: MenuItemType, index: number) => (
        <div
          className={styles.dropdownItem}
          key={index}
          onClick={() => redirectTo(item.redirectLink)}
        >
          <Icon src={item.icon} width={15} height={15} />
          <span>{item.title}</span>
        </div>
      ))}
    </div>
  );
}
