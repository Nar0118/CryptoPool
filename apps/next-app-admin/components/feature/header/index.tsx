import { useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'components/shared/image';
import notification from 'components/shared/notification';
import Button from 'components/shared/button';
import { AuthContext } from 'utils/context/auth/context';
import navBarPaths from 'utils/constants/navBarPaths';
import { clearLocalStorage } from 'utils/services/localStorageService';
import { AuthServiceContext } from 'utils/services/service/authService';
import { imagesSvg } from 'utils/constants/imagesSrc';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  const router = useRouter();
  const isAuthorized = useContext(AuthContext);
  const authService = useContext(AuthServiceContext);

  const redirectTo = async (path: string) => {
    if (path === navBarPaths.login) {
      const logout = await authService.logout();

      if (logout?.success) {
        clearLocalStorage();
        router.push(navBarPaths.login);
      } else {
        notification({
          messageType: 'error',
          message: 'Oops!',
          description: logout?.error ?? 'You are not registered',
        });
      }
    } else {
      router.push(path);
    }
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.container}>
        <div className={styles.headerLogo}>
          <Image
            src={imagesSvg.websiteLogo}
            width="157"
            height="60"
            onClick={() => redirectTo(navBarPaths.dashboard)}
          />
        </div>
        {isAuthorized && (
          <Button
            text="Log Out"
            onClick={() => redirectTo(navBarPaths.login)}
            className={styles.button}
          />
        )}
      </div>
    </header>
  );
}
