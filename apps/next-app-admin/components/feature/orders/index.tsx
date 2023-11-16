import { useContext, useEffect, useState } from 'react';
import Loader from 'components/shared/loader';
import PageTable from 'components/shared/table';
import { OrderServiceContext } from 'utils/services/service/orderService';
import { orderColumns } from 'utils/constants/columns';
import { OrderData } from 'types/order';

import styles from './order.module.scss';

export default function Order(): JSX.Element {
  const orderService = useContext(OrderServiceContext);

  const [orders, setOrders] = useState<OrderData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countOfPage, setCountOfPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [firstRefresh, setFirstRefresh] = useState<boolean>(true);

  const getAllOrders = async (): Promise<void> => {
    const res = await orderService.getAllOrders(
      limit,
      limit * (currentPage - 1)
    );

    if (Array.isArray(res?.data)) {
      setCountOfPage(Math.ceil(res.count / limit) * 10);
      setOrders(res.data);
      setFirstRefresh(false);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, [currentPage, limit]);

  return orders.length || !firstRefresh ? (
    <div className={styles.container}>
      <PageTable
        headerText="Orders"
        dataSource={orders}
        columns={orderColumns}
        limit={limit}
        setLimit={setLimit}
        countOfPage={countOfPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  ) : (
    <Loader />
  );
}
