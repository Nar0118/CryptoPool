export interface TransactionData {
  _id: string;
  pbId: string;
  wallet: {
    id: string;
    externalId: string;
  };
  destination: {
    id: string;
    type: string;
  };
  status: string;
  subStatus: string;
  amount: number;
  from: string;
  to: string;
  currency: string;
  estimatedFiatAmount: number;
  estimatedFiatCurrency: number;
  notificationUrl: string;
  hash: string;
  sender: string;
  receiver: string;
  tag: string;
  createdAt: string;
  modifiedAt: string;
  completedAt: string;
}
