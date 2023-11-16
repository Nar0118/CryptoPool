import BalanceCard from 'components/shared/balanceCard';
import CryptoMarket from 'components/shared/cryptoMarket';
import DashboardOverview from 'components/shared/dashboardOverview';
import DashboardTable from 'components/shared/table';
import ContentLayout from 'components/feature/contentLayout';
import { tableData } from 'utils/constants/fakeData';

import styles from './dashboard.module.scss';

export default function Dashboard(): JSX.Element {
  return (
    <ContentLayout title="Good Evening" isClock={true}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <BalanceCard />
          <DashboardOverview />
        </div>
        <div className={styles.bottomSection}>
          <CryptoMarket />
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
