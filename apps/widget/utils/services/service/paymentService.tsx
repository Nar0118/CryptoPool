import { Context } from 'react';
import { PayWithQr } from 'types/wallet';
import { Contextualizer } from 'utils/services/contextualizer';
import { ProvidedServices } from 'utils/services/providedServices';
import { axiosInstance } from 'utils/services/service/axiosService';
import { ConvertResponse, PaymentResponse } from 'utils/types/wallet';

export interface IPaymentService {
  convertUsdToCoinWidget(key: string): Promise<ConvertResponse>;
  payWithQr(key: string): Promise<PayWithQr>;
  transferToBackUsers(childWalletId: string, chainId: number): Promise<any>;
  changePaymentInfo(
    paymentStatus: string,
    capacity: number,
    key: string
  ): Promise<any>;
}

export const PaymentServiceContext: Context<
  IPaymentService | undefined
> = Contextualizer.createContext(ProvidedServices.PaymentService);

export const usePaymentServices = () =>
  Contextualizer.use<IPaymentService>(ProvidedServices.PaymentService);

export const PaymentService = ({ children }: any) => {
  const paymentService = {
    async payWithQr(key: string): Promise<PayWithQr> {
      try {
        const response = await axiosInstance.get(
          `/payments/pay-with-qr-widget?&key=${key}`
        );

        return response?.data?.data;
      } catch (err) {
        console.log(err);
      }
    },
    async convertUsdToCoinWidget(key: string): Promise<PaymentResponse> {
      try {
        const response = await axiosInstance.get(
          `/payments/usd-currency-conversation?key=${key}`
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async transferToBackUsers(
      childWalletId: string,
      chainId: number
    ): Promise<any> {
      try {
        const response = await axiosInstance.get(
          `/payments/transfer-back-to-users/${childWalletId}?chainId=${chainId}`
        );

        return response?.data?.data;
      } catch (err) {
        console.log(err);
      }
    },

    async changePaymentInfo(
      paymentStatus: string,
      capacity: number,
      key: string
    ): Promise<any> {
      try {
        const response = await axiosInstance.put(
          `/payments/payment-status/${key}`,
          {
            status: paymentStatus,
            capacity,
          }
        );

        return response?.data?.data;
      } catch (err) {
        console.log(err);
      }
    },
  };

  return (
    <PaymentServiceContext.Provider value={paymentService}>
      {children}
    </PaymentServiceContext.Provider>
  );
};
