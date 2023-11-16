import { useContext, useEffect, useState } from 'react';
import Loader from 'components/shared/loader';
import PageTable from 'components/shared/table';
import { formatDate } from 'utils/helpers';
import { WalletServiceContext } from 'utils/services/service/walletService';
import { Wallet as WalletType } from './type';

import styles from './wallet.module.scss';

const walletColumns = [
  {
    title: 'ID',
    dataIndex: '_id',
    key: '_id',
    ellipsis: true,
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
    ellipsis: true,
  },
  {
    title: 'Balance',
    dataIndex: 'totalDepositedAmount',
    key: 'totalDepositedAmount',
    ellipsis: true,
  },
  {
    title: 'Estimated Fiat Currency',
    dataIndex: 'estimatedFiatCurrency',
    key: 'estimatedFiatCurrency',
    ellipsis: true,
  },
  {
    title: 'Estimated Fiat Amount',
    dataIndex: 'estimatedFiatAmount',
    key: 'estimatedFiatAmount',
    ellipsis: true,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    ellipsis: true,
  },
  {
    title: 'Notification URL',
    dataIndex: 'notificationUrl',
    key: 'notificationUrl',
    render: (notificationUrl: string) => (
      <a href={notificationUrl}>{notificationUrl}</a>
    ),
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
    ellipsis: true,
    render: (createdAt: string) => formatDate(createdAt),
  },
  {
    title: 'Modified At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    ellipsis: true,
    render: (createdAt: string) => formatDate(createdAt),
  },
];

export default function Wallet(): JSX.Element {
  const walletService = useContext(WalletServiceContext);

  const [wallet, setWallet] = useState<Array<WalletType>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countOfPage, setCountOfPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [firstRefresh, setFirstRefresh] = useState<boolean>(true);

  const getAllWallets = async (): Promise<void> => {
    const res = await walletService.getAllWallets(
      limit,
      limit * (currentPage - 1)
    );

    if (Array.isArray(res?.data)) {
      setCountOfPage(Math.ceil(res.count / limit) * 10);
      setWallet(res.data);
      setFirstRefresh(false);
    }
  };

  useEffect(() => {
    getAllWallets();
  }, [currentPage, limit]);

  return wallet.length || !firstRefresh ? (
    <div className={styles.container}>
      <PageTable
        headerText="Wallets"
        dataSource={wallet}
        columns={walletColumns}
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
