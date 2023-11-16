import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from './context';
import { isMobile } from 'react-device-detect';
import { UserServiceContext } from 'utils/services/service/userService';
import * as localStorage from 'utils/services/localStorageService';
import localStorageKeys from 'utils/constants/localStorageKeys';
import navBarPaths from 'utils/constants/navBarPaths';
import { withoutAuthRoutes } from './constants';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const router = useRouter();
  const userService = useContext(UserServiceContext);

  const getAuthToken = (): string | JSON => {
    return localStorage.getItemFromLocalStorage(localStorageKeys.TOKEN_KEY);
  };

  const [authData, setAuthorized] = useState<AuthContext>({
    authorized: !!getAuthToken(),
    path: '/',
    user: null,
  });

  const getContextUser = async (): Promise<void> => {
    if (getAuthToken()) {
      const res = await userService.getCurrentUser();

      if (res?.error) {
        setAuthorized({
          ...authData,
          authorized: false,
          user: null,
        });

        localStorage.clearLocalStorage();
        router.push(navBarPaths.login);
      }
      if (!isMobile) {
        setAuthorized({
          ...authData,
          authorized: true,
          user: res?.data,
        });
      }
    }
  };

  const redirectTo = (path: string): void => {
    if (!isMobile) {
      getContextUser();
      const authToken = getAuthToken();

      if (authToken === '') {
        setAuthorized({
          ...authData,
          authorized: false,
        });

        if (withoutAuthRoutes.includes(path.split('?')[0])) {
          router.push(path);
        } else {
          localStorage.clearLocalStorage();
          router.push(navBarPaths.login);
        }
      } else {
        setAuthorized({
          ...authData,
          authorized: true,
          path: '/',
        });

        if (path === navBarPaths.login || path === navBarPaths.signUp) {
          router.push('/');
        }
      }
    }
  };

  useEffect(() => {
    getContextUser();
  }, []);

  useEffect(() => {
    redirectTo(router.asPath);
  }, [router.pathname]);

  return (
    <AuthContext.Provider value={authData}> {children}</AuthContext.Provider>
  );
};
