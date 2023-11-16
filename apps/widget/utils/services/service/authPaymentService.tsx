import { Context } from 'react';
import * as localStorage from 'utils/services/localStorageService';
import localStorageKeys from 'utils/constants/localStorageKeys';
import { axiosInstance } from 'utils/services/service/axiosService';
import { Contextualizer } from 'utils/services/contextualizer';
import { ProvidedServices } from 'utils/services/providedServices';
import { ChildWallet } from 'utils/model/user';
import { GeneralResponse } from 'utils/types/transaction';
import { AuthPaymentResponse } from 'types/paymentAuth';
import { ContextProps } from 'types/user';

interface IAuthPaymentService {
  login(email: string, amountUSD: number, merchantId: string): Promise<any>;
  getPaymentUser(key: string): Promise<AuthPaymentResponse>;
  getActiveTempWallet(
    _id: string
  ): Promise<{ status: boolean; data: ChildWallet }>;
  disabledIsActiveUser(key: string): Promise<GeneralResponse>;
  updateUserData(
    email: string,
    key: string,
    _id: string,
    createdAt: string,
    tempWalletPbId?: string,
    convertedAmount?: number,
    currencyToken?: string
  ): Promise<GeneralResponse>;
}

const AuthPaymentServiceContext: Context<
  IAuthPaymentService | undefined
> = Contextualizer.createContext(ProvidedServices.AuthPaymentService);

const AuthPaymentService = ({ children }: ContextProps): JSX.Element => {
  const authPaymentService = {
    async login(
      email: string,
      amountUSD: number,
      merchantId: string
    ): Promise<AuthPaymentResponse> {
      try {
        const response = await axiosInstance.post('/user-payments/auth', {
          email,
          amountUSD,
          merchantId,
        });

        const data = response?.data?.userPayment;
        if (!response?.data?.success) return response?.data;

        if (data?.key) {
          localStorage.setItemInLocalStorage(
            localStorageKeys.PAYMENT_KEY,
            data.key
          );
        }

        return data;
      } catch (err) {
        console.log(err);
      }
    },
    async getPaymentUser(key: string): Promise<AuthPaymentResponse> {
      try {
        const response = await axiosInstance.get(
          `/user-payments/get-payment-user`,
          {
            params: {
              key,
            },
          }
        );

        const data = response?.data;

        return data;
      } catch (err) {
        console.log(err);
      }
    },
    async getActiveTempWallet(
      _id: string
    ): Promise<{ status: boolean; data: ChildWallet }> {
      try {
        const response = await axiosInstance.get(
          `/user-payments/temp-wallet/${_id}`
        );

        const data = response?.data;

        return data;
      } catch (err) {
        console.log(err);
      }
    },
    async disabledIsActiveUser(key: string): Promise<GeneralResponse> {
      try {
        const response = await axiosInstance.put(
          `/user-payments/disable-active-user`,
          {
            key,
          }
        );

        const data = response?.data;

        return data;
      } catch (err) {
        console.log(err);
      }
    },
    async updateUserData(
      email: string,
      key: string,
      _id: string,
      createdAt: string,
      tempWalletPbId?: string,
      convertedAmount?: number,
      currencyToken?: string
    ): Promise<GeneralResponse> {
      try {
        const response = await axiosInstance.put(
          `/user-payments/update-user-data`,
          {
            email,
            key,
            _id,
            createdAt,
            tempWalletPbId,
            currencyToken,
            convertedAmount,
          }
        );

        const data = response?.data;

        return data;
      } catch (err) {
        console.log(err);
      }
    },
  };
  return (
    <AuthPaymentServiceContext.Provider value={authPaymentService}>
      {children}
    </AuthPaymentServiceContext.Provider>
  );
};

export { AuthPaymentService, AuthPaymentServiceContext };
