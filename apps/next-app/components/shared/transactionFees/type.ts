import { FeeButton } from 'types/transactions';

export interface TransactionProps {
  buttons?: Array<FeeButton>;
  data?: TransactionFeeData;
}

export interface TransactionFeeData {
  daily: Array<IntermediateData>;
  weekly: Array<IntermediateData>;
  monthly: Array<IntermediateData>;
}

export interface IntermediateData {
  key: string;
  value: string;
}

export const defaultData: TransactionFeeData = {
  daily: [
    {
      key: 'Domestic wires',
      value: '$3',
    },
    {
      key: 'International wires',
      value: '$10',
    },
    {
      key: 'ACH',
      value: 'No fee',
    },
    {
      key: 'EUR SEPA',
      value: '0.01%( min 2 EUR )',
    },
    {
      key: 'Transaction tracer',
      value: '$6',
    },
    {
      key: 'Free transactions per month',
      value: '0',
    },
  ],
  weekly: [
    {
      key: 'Domestic wires',
      value: '$8',
    },
    {
      key: 'International wires',
      value: '$20',
    },
    {
      key: 'ACH',
      value: 'No fee',
    },
    {
      key: 'EUR SEPA',
      value: '0.05%( min 2 EUR )',
    },
    {
      key: 'Transaction tracer',
      value: '$14',
    },
    {
      key: 'Free transactions per month',
      value: '0',
    },
  ],
  monthly: [
    {
      key: 'Domestic wires',
      value: '$15',
    },
    {
      key: 'International wires',
      value: '$50',
    },
    {
      key: 'ACH',
      value: 'No fee',
    },
    {
      key: 'EUR SEPA',
      value: '0.09%( min 2 EUR )',
    },
    {
      key: 'Transaction tracer',
      value: '$75',
    },
    {
      key: 'Free transactions per month',
      value: '0',
    },
  ],
};
