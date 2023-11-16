import { Context } from 'react';
import { Coins, ConvertTo } from 'components/shared/balanceCard/type';
import { PbPayCoins } from 'utils/context/auth/constants';
import { ConvertResponse, PaymentResponse, PayWithQr } from 'types/wallet';
import { Contextualizer } from 'utils/services/contextualizer';
import { ProvidedServices } from 'utils/services/providedServices';
import { axiosInstance } from 'utils/services/service/axiosService';

export interface IPaymentService {
  getCurrencyBalance(
    coins: Array<Coins>,
    amount: number,
    currencyType?: string
  ): Promise<PaymentResponse>;
  convertUsdToCoin(
    coins: Array<PbPayCoins>,
    amount: number
  ): Promise<ConvertResponse>;
  payWithQr(
    parentWalletId: string,
    childWalletId: string,
    price: number
  ): Promise<PayWithQr>;
  transferToBackUsers(childWalletId: string, chainId: number): Promise<any>;
}

export const PaymentServiceContext: Context<
  IPaymentService | undefined
> = Contextualizer.createContext(ProvidedServices.PaymentService);

export const usePaymentServices = () =>
  Contextualizer.use<IPaymentService>(ProvidedServices.PaymentService);

export const PaymentService = ({ children }: any) => {
  const paymentService = {
    async getCurrencyBalance(
      coins: Array<Coins> = [],
      amount: number,
      currencyType?: ConvertTo
    ): Promise<PaymentResponse> {
      try {
        const response = await axiosInstance.get(
          `/payments/convert?coins=${coins}&amount=${amount}&currencyType=${currencyType}`
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async convertUsdToCoin(
      coins: Array<PbPayCoins> = [],
      amount: number
    ): Promise<PaymentResponse> {
      try {
        const response = await axiosInstance.get(
          `/payments/convert-coin?coins=${coins}&amount=${amount}`
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async payWithQr(
      parentWalletId: string,
      childWalletId: string,
      price: number
    ): Promise<PayWithQr> {
      try {
        const response = await axiosInstance.get(
          `/payments/pay-with-qr?parentWalletId=${parentWalletId}&childWalletId=${childWalletId}&price=${price}`
        );

        return response?.data?.data;
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
  };

  return (
    <PaymentServiceContext.Provider value={paymentService}>
      {children}
    </PaymentServiceContext.Provider>
  );
};
