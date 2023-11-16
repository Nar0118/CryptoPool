import { Context } from 'react';
import { Contextualizer } from 'utils/services/contextualizer';
import { ProvidedServices } from 'utils/services/providedServices';
import { axiosInstance } from './axiosService';
import { TempWalletResponse } from 'types/tempwallet';

export interface ITempwalletService {
  getAllTempwallets(limit: number, offset: number): Promise<TempWalletResponse>;
}

export const TempWalletServiceContext: Context<
  ITempwalletService | undefined
> = Contextualizer.createContext(ProvidedServices.TempWalletService);

export const useTempwalletServices = () =>
  Contextualizer.use<ITempwalletService>(ProvidedServices.TempWalletService);

export const TempwalletService = ({ children }: any) => {
  const tempwalletService = {
    async getAllTempwallets(
      limit: number,
      offset: number
    ): Promise<TempWalletResponse> {
      try {
        const res = await axiosInstance.get(
          `/wallets/children?limit=${limit}&offset=${offset}`
        );

        return res.data;
      } catch (err) {
        console.log(err);
      }
    },
  };

  return (
    <TempWalletServiceContext.Provider value={tempwalletService}>
      {children}
    </TempWalletServiceContext.Provider>
  );
};
