import { useContext, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import Loader from 'components/shared/loader';
import Button from 'components/shared/button';
import PageTable from 'components/shared/table';
import { formatDate } from 'utils/helpers';
import { TransactionServiceContext } from 'utils/services/service/transactionService';
import { TransactionData } from './type';

import styles from './transaction.module.scss';

export const transactionColumns = [
  {
    title: 'ID',
    dataIndex: '_id',
    key: '_id',
  },
  {
    title: 'Wallet',
    dataIndex: 'wallet',
    key: 'wallet',
    render: (wallet: { id: string; externalId: string }) => (
      <Tooltip title={wallet.externalId}>{wallet.id}</Tooltip>
    ),
  },
  {
    title: 'Destination',
    children: [
      {
        title: 'ID',
        dataIndex: 'destination',
        width: 300,
        render: (i) => {
          return <span>{i?.id}</span>;
        },
      },
      {
        title: 'Type',
        dataIndex: 'destination',
        render: (i) => {
          return <span>{i?.type}</span>;
        },
      },
    ],
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Sub Status',
    dataIndex: 'subStatus',
    key: 'subStatus',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
  },
  {
    title: 'Estimated Fiat Amount',
    dataIndex: 'estimatedFiatAmount',
    key: 'estimatedFiatAmount',
  },
  {
    title: 'Estimated Fiat Currency',
    dataIndex: 'estimatedFiatCurrency',
    key: 'estimatedFiatCurrency',
  },
  {
    title: 'Sender',
    dataIndex: 'from',
    key: 'from',
  },
  {
    title: 'Receiver',
    dataIndex: 'to',
    key: 'to',
  },
  {
    title: 'Tag',
    dataIndex: 'tag',
    key: 'tag',
  },
  {
    title: 'Destination',
    children: [
      {
        title: 'ID',
        dataIndex: 'destination',
        render: (i) => {
          return <span>{i?.id}</span>;
        },
      },
      {
        title: 'Type',
        dataIndex: 'destination',
        render: (i) => {
          return <span>{i?.type}</span>;
        },
      },
    ],
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (createdAt: string) => formatDate(createdAt),
  },
  {
    title: 'Modified At',
    dataIndex: 'modifiedAt',
    key: 'modifiedAt',
    render: (modifiedAt: string) => formatDate(modifiedAt),
  },

  {
    title: 'Completed At',
    dataIndex: 'completedAt',
    key: 'completedAt',
    render: (completedAt: string) => formatDate(completedAt),
  },
  {
    title: 'Open Etherscan',
    dataIndex: 'hash',
    key: 'hash',
    render: (hash: string) => {
      return (
        <Button
          style={{ width: '100%' }}
          onClick={() =>
            window.open(`https://etherscan.io/tx/${hash}`, '_blank')
          }
        >
          Go To Transaction
        </Button>
      );
    },
  },
];

export default function Transaction(): JSX.Element {
  const transactionService = useContext(TransactionServiceContext);

  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countOfPage, setCountOfPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [firstRefresh, setFirstRefresh] = useState<boolean>(true);

  const getAllTransactions = async (): Promise<void> => {
    const res = await transactionService.getAllTransactions(
      limit,
      limit * (currentPage - 1)
    );

    if (Array.isArray(res?.data)) {
      setCountOfPage(Math.ceil(res.count / limit) * 10);
      setTransactions(res.data);
      setFirstRefresh(false);
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, [currentPage, limit]);

  return transactions.length || !firstRefresh ? (
    <div className={styles.container}>
      <PageTable
        headerText="Transactions"
        dataSource={transactions}
        columns={transactionColumns}
        limit={limit}
        setLimit={setLimit}
        countOfPage={countOfPage}
        setCurrentPage={setCurrentPage}
        tableLayout="auto"
      />
    </div>
  ) : (
    <Loader />
  );
}
