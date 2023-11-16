import AcceptPaymentCard from 'components/shared/acceptPaymentCard';
import BalanceCard from 'components/shared/balanceCard';
import DashboardOverview from 'components/shared/dashboardOverview';
import PaymentSettings from 'components/shared/paymentSettings';
import DashboardTable from 'components/shared/table';
import TransactionFee from 'components/shared/transactionFees';
import ContentLayout from 'components/feature/contentLayout';
import { feeButtons, tableData } from 'utils/constants/fakeData';

import styles from './payments.module.scss';

export default function Payment(): JSX.Element {
  return (
    <ContentLayout title="Payments" isClock={true}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <BalanceCard />
          <DashboardOverview />
        </div>
        <div className={styles.middleSection}>
          <AcceptPaymentCard />
          <PaymentSettings />
          <TransactionFee buttons={feeButtons} />
        </div>
        <div className={styles.bottomSection}>
          <DashboardTable
            rowKey="_id"
            tableTitle="Recent Orders"
            dataSource={tableData}
          />
        </div>
      </div>
    </ContentLayout>
  );
}
