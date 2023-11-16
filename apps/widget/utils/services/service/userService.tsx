import { Context } from 'react';
import { Contextualizer } from '../contextualizer';
import { ProvidedServices } from '../providedServices';
import { axiosInstance } from 'utils/services/service/axiosService';
import { ContextProps } from 'types/user';
import { ChildWallet, User } from 'utils/model/user';
import { PbPayCoins } from 'components/shared/payWidgetScreen/types';

export interface IUserService {
  getUserInfoByIdentificationToken(
    identificationToken: string
  ): Promise<{
    error?: string;
    success: boolean;
    data?: User;
  }>;
  getUserById(
    id: string
  ): Promise<{
    error?: string;
    success: boolean;
    data?: User;
  }>;
  getPayWallet(
    primaryWalletId: string,
    currency: PbPayCoins | string,
    paymentKey: string
  ): Promise<{
    error?: string;
    success: boolean;
    childWallet?: ChildWallet;
  }>;
}

export const UserServiceContext: Context<IUserService> = Contextualizer.createContext(
  ProvidedServices.UserService
);

export const useUserServices = (): IUserService =>
  Contextualizer.use<IUserService>(ProvidedServices.UserService);

export const UserService = ({ children }: ContextProps) => {
  const userService = {
    async getUserInfoByIdentificationToken(
      identificationToken: string
    ): Promise<{
      error?: string;
      success: boolean;
      data?: User;
    }> {
      try {
        const response = await axiosInstance.get(
          `/users/${identificationToken}`
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
    async getUserById(
      id: string
    ): Promise<{
      error?: string;
      success: boolean;
      user?: User;
    }> {
      try {
        const response = await axiosInstance.get(`/users/by-id/${id}`);

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
    async getPayWallet(
      primaryWalletId: string,
      currency: PbPayCoins | string,
      paymentKey: string
    ): Promise<{
      error?: string;
      success: boolean;
      childWallet?: ChildWallet;
    }> {
      try {
        const response = await axiosInstance.get(
          `/users/child-wallet?primaryWalletId=${primaryWalletId}&currency=${currency}&key=${paymentKey}`
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
  };

  return (
    <UserServiceContext.Provider value={userService}>
      {children}
    </UserServiceContext.Provider>
  );
};
