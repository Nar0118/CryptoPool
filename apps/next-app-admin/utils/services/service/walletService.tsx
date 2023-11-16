import { Context } from 'react';
import { Contextualizer } from 'utils/services/contextualizer';
import { ProvidedServices } from 'utils/services/providedServices';
import { axiosInstance } from './axiosService';
import { WalletResponse } from 'types/wallet';

export interface IWalletService {
  getAllWallets(limit: number, offset: number): Promise<WalletResponse>;
}

export const WalletServiceContext: Context<
  IWalletService | undefined
> = Contextualizer.createContext(ProvidedServices.WalletService);

export const useWalletServices = () =>
  Contextualizer.use<IWalletService>(ProvidedServices.WalletService);

export const WalletService = ({ children }: any) => {
  const walletService = {
    async getAllWallets(
      limit: number,
      offset: number
    ): Promise<WalletResponse> {
      try {
        const res = await axiosInstance.get(
          `/wallets?limit=${limit}&offset=${offset}`
        );

        return res.data;
      } catch (err) {
        console.log(err);
      }
    },
  };

  return (
    <WalletServiceContext.Provider value={walletService}>
      {children}
    </WalletServiceContext.Provider>
  );
};
