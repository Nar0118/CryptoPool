import { AuthService } from './authService';
import { OrderService } from './orderService';
import { UserService } from './userService';
import { InvoiceService } from './invoiceService';
import { PaymentService } from './paymentService';
import { TimerService } from './timerService';

export const GlobalServices = ({ children }): JSX.Element => {
  return (
    <UserService>
      <AuthService>
        <PaymentService>
          <OrderService>
            <InvoiceService>
              <TimerService>{children}</TimerService>
            </InvoiceService>
          </OrderService>
        </PaymentService>
      </AuthService>
    </UserService>
  );
};
