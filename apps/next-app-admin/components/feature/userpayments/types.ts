interface PaymentInfo {
  status: string;
  capacity: number;
}

export interface TempWallet {
  paymentInfo: PaymentInfo;
  timer: string;
  tempWalletId: string;
  _id: string;
  isActive: boolean;
  createdAt: string;
}
