import { useContext, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Header from 'components/feature/header';
import navBarPaths from 'utils/constants/navBarPaths';
import { AdminServiceContext } from 'utils/services/service/adminService';
import { getItemFromLocalStorage } from 'utils/services/localStorageService';
import localStorageKeys from 'utils/constants/localStorageKeys';
import * as localStorage from 'utils/services/localStorageService';
import { LayoutProps } from './types';

import styles from './layout.module.scss';

export default function Layout({ children }: LayoutProps): JSX.Element {
  const router = useRouter();

  const adminService = useContext(AdminServiceContext);

  const token = useMemo(
    () =>
      typeof window !== 'undefined' &&
      localStorage.getItemFromLocalStorage(localStorageKeys.TOKEN_KEY),
    [router.pathname]
  );

  const currentUserChecking = async (): Promise<void> => {
    const token = getItemFromLocalStorage(
      localStorageKeys.TOKEN_KEY
    ).toString();
    if (token) {
      const res = await adminService.getCurrentAdmin();
      if (res?.error) {
        localStorage.clearLocalStorage();
        router.push(navBarPaths.login);
      }
    }
  };

  useEffect(() => {
    if (token) currentUserChecking();
  }, [router.pathname]);

  const validPathChecking = useMemo(() => {
    return (
      router.pathname !== navBarPaths.dashboard &&
      router.pathname !== navBarPaths.login
    );
  }, [router.pathname]);

  useEffect(() => {
    document.getElementById('__next').style.height = '100%';
  }, []);

  return (
    <div className={styles.generalModeBg}>
      {router.pathname !== navBarPaths.login && <Header />}
      {children}
    </div>
  );
}
