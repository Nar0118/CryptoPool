import { AuthPaymentService } from 'utils/services/service/authPaymentService';
import { UserService } from 'utils/services/service/userService';
import { TimerService } from 'utils/services/service/timerService';
import { PaymentService } from 'utils/services/service/paymentService';
import { SocketProvider } from 'utils/context/socket/provider';
import { ModalProvider } from 'utils/context/modal/provider';

export const GlobalServices = ({ children }): JSX.Element => {
  return (
    <AuthPaymentService>
      <PaymentService>
        <SocketProvider>
          <ModalProvider>
            <UserService>
              <TimerService>{children}</TimerService>
            </UserService>
          </ModalProvider>
        </SocketProvider>
      </PaymentService>
    </AuthPaymentService>
  );
};
