import { Context } from 'react';
import { OrderData, OrderDataResponse, OrdersDataResponse } from 'types/orders';
import { Contextualizer } from 'utils/services/contextualizer';
import { ProvidedServices } from 'utils/services/providedServices';
import { axiosInstance } from 'utils/services/service/axiosService';

export interface IOrderService {
  getCurrentUserOrders(
    limit?: number,
    offset?: number
  ): Promise<OrdersDataResponse>;
  registerOrder(data: {
    orderId: string;
    title: string;
    amount: number;
    identificationToken: string;
    walletId: string;
  }): Promise<OrderDataResponse>;
  updateOrder(
    id: string,
    identificationToken: string,
    data: OrderData
  ): Promise<OrderDataResponse>;
}

export const OrderServiceContext: Context<
  IOrderService | undefined
> = Contextualizer.createContext(ProvidedServices.OrderService);

export const useOrderServices = () =>
  Contextualizer.use<IOrderService>(ProvidedServices.OrderService);

export const OrderService = ({ children }: any) => {
  const orderService = {
    async getCurrentUserOrders(
      limit: number = 0,
      offset: number = 0
    ): Promise<OrdersDataResponse> {
      try {
        const response = await axiosInstance.get(
          `/orders/current-user-orders?limit=${limit}&offset=${offset}`
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async registerOrder(data: {
      orderId: string;
      title: string;
      amount: number;
      identificationToken: string;
      walletId: string;
    }): Promise<OrderDataResponse> {
      try {
        const response = await axiosInstance.post(`/orders`, data);

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async updateOrder(
      id: string,
      identificationToken: string,
      data: OrderData
    ): Promise<OrderDataResponse> {
      try {
        const response = await axiosInstance.put(
          `/orders?id=${id}&identificationToken=${identificationToken}`,
          data
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
  };

  return (
    <OrderServiceContext.Provider value={orderService}>
      {children}
    </OrderServiceContext.Provider>
  );
};
