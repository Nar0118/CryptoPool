import { useContext, useEffect, useState } from 'react';
import Loader from 'components/shared/loader';
import PageTable from 'components/shared/table';
import { invoiceColumns } from 'utils/constants/columns';
import { InvoiceServiceContext } from 'utils/services/service/invoiceService';
import { Invoice } from './types';

import styles from './invoice.module.scss';

export default function Invoices(): JSX.Element {
  const invoiceService = useContext(InvoiceServiceContext);

  const [invoices, setInvoices] = useState<Array<Invoice>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countOfPage, setCountOfPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [firstRefresh, setFirstRefresh] = useState<boolean>(true);

  const getAllInvoices = async (): Promise<void> => {
    const res = await invoiceService.getAllInvoices(
      limit,
      limit * (currentPage - 1)
    );

    if (Array.isArray(res?.data)) {
      setCountOfPage(Math.ceil(res.count / limit) * 10);
      setInvoices(res.data);
      setFirstRefresh(false);
    }
  };

  useEffect(() => {
    getAllInvoices();
  }, [currentPage, limit]);

  return invoices.length || !firstRefresh ? (
    <div className={styles.container}>
      <PageTable
        headerText="Invoices"
        dataSource={invoices}
        columns={invoiceColumns}
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
