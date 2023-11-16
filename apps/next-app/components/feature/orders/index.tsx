import { useContext, useEffect, useState } from 'react';
import DashboardTable from 'components/shared/table';
import ContentLayout from 'components/feature/contentLayout';
import ShareBar from 'components/shared/filterBar';
import { OrderServiceContext } from 'utils/services/service/orderService';
import { OrderData } from 'types/orders';

import styles from './orders.module.scss';

export default function Orders(): JSX.Element {
  const orderService = useContext(OrderServiceContext);

  const [limit, setLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countOfPage, setCountOfPage] = useState<number>(0);
  const [orders, setOrders] = useState<Array<OrderData>>([]);

  const getCurrentUserOrders = async (): Promise<void> => {
    const res = await orderService.getCurrentUserOrders(
      limit,
      limit * (currentPage - 1)
    );

    if (Array.isArray(res?.data)) {
      setCountOfPage(Math.ceil(res.count / limit) * 10);
      setOrders(res.data);
    }
  };

  useEffect(() => {
    getCurrentUserOrders();
  }, [currentPage]);

  return (
    <ContentLayout
      title="Orders"
      isClock={true}
      headerChildren={<ShareBar isHeader />}
    >
      <div className={styles.container}>
        <DashboardTable
          rowKey="_id"
          dataSource={orders}
          limit={limit}
          countOfPage={countOfPage}
          setLimit={setLimit}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </ContentLayout>
  );
}
