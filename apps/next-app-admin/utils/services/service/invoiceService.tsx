import { Context } from 'react';
import { Contextualizer } from 'utils/services/contextualizer';
import { ProvidedServices } from 'utils/services/providedServices';
import { axiosInstance } from 'utils/services/service/axiosService';
import { InvoiceResponse } from 'types/invoice';

export interface IInvoiceService {
  getAllInvoices(limit: number, offset: number): Promise<InvoiceResponse>;
}

export const InvoiceServiceContext: Context<
  IInvoiceService | undefined
> = Contextualizer.createContext(ProvidedServices.InvoiceService);

export const useInvoiceServices = () =>
  Contextualizer.use<IInvoiceService>(ProvidedServices.InvoiceService);

export const InvoiceService = ({ children }: any) => {
  const invoiceService = {
    async getAllInvoices(
      limit: number,
      offset: number
    ): Promise<InvoiceResponse> {
      try {
        const res = await axiosInstance.get(
          `/invoices?limit=${limit}&offset=${offset}`
        );
        
        return res.data;
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
