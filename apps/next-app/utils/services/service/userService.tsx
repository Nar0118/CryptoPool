import { Context } from 'react';
import { Contextualizer } from '../contextualizer';
import { ProvidedServices } from '../providedServices';
import { axiosInstance } from 'utils/services/service/axiosService';
import { BalanceResponse, ContextProps } from 'types/user';
import { ChildWallet, User } from 'utils/model/user';
import { Coins, ConvertTo } from 'components/shared/balanceCard/type';
import { PbPayCoins } from 'utils/context/auth/constants';

export interface IUserService {
  getCurrentUser(): Promise<{
    error?: string;
    success: boolean;
    data?: User;
  }>;
  getWalletBalance(
    coins: Array<PbPayCoins>,
    currencyType?: ConvertTo
  ): Promise<BalanceResponse>;
  updateEmbed(
    embed: string
  ): Promise<{
    success: boolean;
    data: string;
    message: string;
  }>;
  getUserInfoByIdentificationToken(
    identificationToken: string
  ): Promise<{
    error?: string;
    success: boolean;
    data?: User;
  }>;
  getPayWallet(
    primaryWalletId: string,
    currency: PbPayCoins | string
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
    async getCurrentUser(): Promise<{
      error?: string;
      success: boolean;
      data?: User;
    }> {
      try {
        const response = await axiosInstance.get(`/users/me`);

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async getWalletBalance(
      coins: Array<PbPayCoins> = [],
      currencyType?: ConvertTo
    ): Promise<BalanceResponse> {
      try {
        const response = await axiosInstance.get(
          `/users/wallet-balance?coins=${coins}&currencyType=${currencyType}`
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async getPayWallet(
      primaryWalletId: string,
      currency: PbPayCoins | string
    ): Promise<{
      error?: string;
      success: boolean;
      childWallet?: ChildWallet;
    }> {
      try {
        const response = await axiosInstance.get(
          `/users/child-wallet?primaryWalletId=${primaryWalletId}&currency=${currency}`
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async updateEmbed(
      embed: string
    ): Promise<{
      success: boolean;
      data: string;
      message: string;
    }> {
      try {
        const response = await axiosInstance.put('/users/update-embed', {
          embed,
        });

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

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
  };

  return (
    <UserServiceContext.Provider value={userService}>
      {children}
    </UserServiceContext.Provider>
  );
};
