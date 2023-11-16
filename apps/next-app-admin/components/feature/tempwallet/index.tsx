import { useContext, useEffect, useState } from 'react';
import Loader from 'components/shared/loader';
import PageTable from 'components/shared/table';
import { formatDate } from 'utils/helpers';
import { TempWalletServiceContext } from 'utils/services/service/tempwalletService';
import { TempWallet as TempwalletType } from './type';

import styles from './tempwallet.module.scss';

const tempWalletColumns = [
  {
    title: 'ID',
    dataIndex: '_id',
    key: '_id',
    ellipsis: true,
  },
  {
    title: 'Total Deposited Amount',
    dataIndex: 'totalDepositedAmount',
    key: 'totalDepositedAmount',
    ellipsis: true,
  },
  {
    title: 'Estimated Fiat Currency',
    dataIndex: 'estimatedFiatAmount',
    key: 'estimatedFiatAmount',
    ellipsis: true,
  },
  {
    title: 'Tag',
    dataIndex: 'tag',
    key: 'tag',
    ellipsis: true,
  },
  {
    title: 'Parent Wallet Id',
    dataIndex: 'parentWalletId',
    key: 'parentWalletId',
    ellipsis: true,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    ellipsis: true,
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
    ellipsis: true,
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
    title: 'Estimated Fiat Currency',
    dataIndex: 'estimatedFiatCurrency',
    key: 'estimatedFiatCurrency',
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
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    ellipsis: true,
    render: (createdAt: string) => formatDate(createdAt),
  },
  {
    title: 'Modified At',
    dataIndex: 'modifiedAt',
    key: 'modifiedAt',
    ellipsis: true,
    render: (modifiedAt: string) => formatDate(modifiedAt),
  },
];

export default function TempWallet(): JSX.Element {
  const tempWalletService = useContext(TempWalletServiceContext);

  const [tempwallet, setTempwallet] = useState<Array<TempwalletType>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countOfPage, setCountOfPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [firstRefresh, setFirstRefresh] = useState<boolean>(true);

  const getAllTempwallets = async (): Promise<void> => {
    const res = await tempWalletService.getAllTempwallets(
      limit,
      limit * (currentPage - 1)
    );

    if (Array.isArray(res?.data)) {
      setCountOfPage(Math.ceil(res.count / limit) * 10);
      setTempwallet(res.data);
      setFirstRefresh(false);
    }
  };

  useEffect(() => {
    getAllTempwallets();
  }, [currentPage, limit]);

  return tempwallet.length || !firstRefresh ? (
    <div className={styles.container}>
      <PageTable
        headerText="Temp Wallets"
        dataSource={tempwallet}
        columns={tempWalletColumns}
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
