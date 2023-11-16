import { IPaymentUser } from 'components/feature/paymentUser/type';

export default interface AuthPaymentProps {
  setIsLogin: (data: IPaymentUser) => void;
  updateWalletData: (user: IPaymentUser) => void;
  merchantId: string
}
