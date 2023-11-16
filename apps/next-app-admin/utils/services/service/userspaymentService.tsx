import { Context } from 'react';
import { UserPayments } from 'types/user';
import { Contextualizer } from '../contextualizer';
import { ProvidedServices } from '../providedServices';
import { axiosInstance } from 'utils/services/service/axiosService';

export interface IUsersPaymentService {
  getAllPaymentUsers(
    limit?: number,
    offset?: number
  ): Promise<{
    data: Array<UserPayments>;
    count: number;
  }>;
}

export const UsersPaymentServiceContext: Context<
  IUsersPaymentService | undefined
> = Contextualizer.createContext(ProvidedServices.UsersPaymentService);

export const useUsersPaymentServices = () =>
  Contextualizer.use<IUsersPaymentService>(
    ProvidedServices.UsersPaymentService
  );

export const UsersPaymentService = ({ children }: any) => {
  const usersPaymentService = {
    async getAllPaymentUsers(
      limit: number = 0,
      offset: number = 0
    ): Promise<{
      data: Array<UserPayments>;
      count: number;
    }> {
      try {
        const response = await axiosInstance.get(
          `/user-payments/all?limit=${limit}&offset=${offset}`
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
  };

  return (
    <UsersPaymentServiceContext.Provider value={usersPaymentService}>
      {children}
    </UsersPaymentServiceContext.Provider>
  );
};
