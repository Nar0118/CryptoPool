import { Context } from 'react';
import { Contextualizer } from 'utils/services/contextualizer';
import { ProvidedServices } from 'utils/services/providedServices';
import { axiosInstance } from 'utils/services/service/axiosService';
import { TransactionResponse } from 'types/transaction';

export interface ITransactionService {
  getAllTransactions(
    limit?: number,
    offset?: number
  ): Promise<TransactionResponse>;
}

export const TransactionServiceContext: Context<
  ITransactionService | undefined
> = Contextualizer.createContext(ProvidedServices.TransactionService);

export const useTransactionServices = () =>
  Contextualizer.use<ITransactionService>(ProvidedServices.TransactionService);

export const TransactionService = ({ children }: any) => {
  const transactionService = {
    async getAllTransactions(
      limit: number = 0,
      offset: number = 0
    ): Promise<TransactionResponse> {
      try {
        const response = await axiosInstance.get(
          `/transactions?limit=${limit}&offset=${offset}`
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
  };

  return (
    <TransactionServiceContext.Provider value={transactionService}>
      {children}
    </TransactionServiceContext.Provider>
  );
};
