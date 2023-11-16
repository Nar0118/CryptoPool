import { Context } from 'react';
import { Contextualizer } from 'utils/services/contextualizer';
import { ProvidedServices } from 'utils/services/providedServices';
import { axiosInstance } from 'utils/services/service/axiosService';
import { Invoice } from 'components/shared/invoice/types';

export interface IInvoiceService {
  sendInvoice(
    invoice: Invoice
  ): Promise<{
    success: boolean;
    message: string;
    data?: Invoice;
  }>;
}

export const InvoiceServiceContext: Context<
  IInvoiceService | undefined
> = Contextualizer.createContext(ProvidedServices.InvoiceService);

export const useInvoiceServices = () =>
  Contextualizer.use<IInvoiceService>(ProvidedServices.InvoiceService);

export const InvoiceService = ({ children }: any) => {
  const invoiceService = {
    async sendInvoice(
      invoice: Invoice
    ): Promise<{ success: boolean; message: string; data?: Invoice }> {
      try {
        const response = await axiosInstance.post('/invoices/', invoice);

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
  };
  return (
    <InvoiceServiceContext.Provider value={invoiceService}>
      {children}
    </InvoiceServiceContext.Provider>
  );
};
