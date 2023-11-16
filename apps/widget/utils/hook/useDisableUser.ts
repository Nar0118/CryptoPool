import { useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import { getPaymentInfo } from 'utils/getPaymentInfo';
import { AuthPaymentServiceContext } from 'utils/services/service/authPaymentService';
import * as localStorage from 'utils/services/localStorageService';
import localStorageKeys from 'utils/constants/localStorageKeys';

export const useDisableUser = () => {
  const authPaymentService = useContext(AuthPaymentServiceContext);
  const { push, asPath } = useRouter();

  const disableActiveUser = useCallback(async () => {
    const { key } = getPaymentInfo();
    const data = await authPaymentService.disabledIsActiveUser(key);

    if (data.success) {
      localStorage.removeItemFromLocalStorage(localStorageKeys.PAYMENT_KEY);

      push(asPath);
    }
  }, [authPaymentService]);

  return disableActiveUser;
};
