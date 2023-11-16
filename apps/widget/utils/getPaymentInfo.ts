import * as localStorage from 'utils/services/localStorageService';
import localStorageKeys from 'utils/constants/localStorageKeys';

export const getPaymentInfo = () => {
  const key = localStorage
    .getItemFromLocalStorage(localStorageKeys.PAYMENT_KEY)
    .toString();

  return {
    key,
  };
};
