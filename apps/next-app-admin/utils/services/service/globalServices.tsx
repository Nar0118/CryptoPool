import { AuthService } from './authService';
import { InvoiceService } from './invoiceService';
import { OrderService } from './orderService';
import { TransactionService } from './transactionService';
import { UserService } from './userService';
import { AdminService } from './adminService';
import { TempwalletService } from './tempwalletService';
import { WalletService } from './walletService';
import { UsersPaymentService } from './userspaymentService';

export const GlobalServices = ({ children }): JSX.Element => {
  return (
    <AuthService>
      <UserService>
        <UsersPaymentService>
          <AdminService>
            <OrderService>
              <TransactionService>
                <TempwalletService>
                  <WalletService>
                    <InvoiceService>{children}</InvoiceService>
                  </WalletService>
                </TempwalletService>
              </TransactionService>
            </OrderService>
          </AdminService>
        </UsersPaymentService>
      </UserService>
    </AuthService>
  );
};
