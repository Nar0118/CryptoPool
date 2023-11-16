import { useContext, useEffect, useMemo, useState } from 'react';
import Loader from 'components/shared/loader';
import PageTable from 'components/shared/table';
import { UserPayments } from 'types/user';
import { TempWallet } from './types';
import { UsersPaymentServiceContext } from 'utils/services/service/userspaymentService';
import { UsersPaymentNumbers } from 'utils/constants/enum';
import { formatDate } from 'utils/helpers';

import styles from './userpayments.module.scss';

export default function UsersPayment(): JSX.Element {
  const usersPaymentService = useContext(UsersPaymentServiceContext);
  const [limit, setLimit] = useState<number>(UsersPaymentNumbers.DEFAULT_LIMIT);
  const [users, setUsers] = useState<Array<UserPayments>>([]);
  const [currentPage, setCurrentPage] = useState<number>(
    UsersPaymentNumbers.DEFAULT_CURRENT_PAGE
  );
  const [countOfPage, setCountOfPage] = useState<number>(
    UsersPaymentNumbers.DEFAULT_COUNT_OF_PAGE
  );
  const [firstRefresh, setFirstRefresh] = useState<boolean>(true);

  const usersTableData: Array<UserPayments> = useMemo(
    (): Array<UserPayments> => users?.map((item: UserPayments) => item),
    [users]
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      tooltip: true,
    },
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      tooltip: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      tooltip: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      tooltip: true,
    },
    {
      title: 'Is Active User',
      dataIndex: 'isActiveUser',
      key: 'isActiveUser',
      tooltip: true,
      render: (val) => (val ? 'true' : 'false'),
    },
    {
      title: 'Temp Wallets',
      children: [
        {
          title: 'Status',
          dataIndex: 'tempWallets',
          key: 'tempWallets.status',
          tooltip: true,
          render: (tempWallets: TempWallet[]) => (
            <>
              {tempWallets.map((wallet: TempWallet) => (
                <span key={wallet.tempWalletId}>
                  {wallet.paymentInfo.status}
                  <br />
                </span>
              ))}
            </>
          ),
        },
        {
          title: 'Capacity',
          dataIndex: 'tempWallets',
          key: 'tempWallets.capacity',
          tooltip: true,
          render: (tempWallets: TempWallet[]) => (
            <>
              {tempWallets.map((wallet: TempWallet) => (
                <span key={wallet.tempWalletId}>
                  {wallet.paymentInfo.capacity}
                </span>
              ))}
            </>
          ),
        },
        {
          title: 'Created At',
          dataIndex: 'tempWallets',
          key: 'tempWallets.createdAt',
          tooltip: true,
          render: (tempWallets: TempWallet[]) => (
            <>
              {tempWallets.map((wallet: TempWallet) => (
                <span key={wallet.tempWalletId}>
                  {formatDate(wallet.createdAt)}
                  <br />
                </span>
              ))}
            </>
          ),
        },
      ],
    },
  ];

  useEffect(() => {
    getAllUsers();
  }, [limit]);

  const getAllUsers = async (): Promise<void> => {
    const res = await usersPaymentService.getAllPaymentUsers(
      limit,
      limit * (currentPage - 1)
    );
    if (Array.isArray(res?.data)) {
      setCountOfPage(Math.ceil(res.count));
      setUsers(res?.data);
      setFirstRefresh(false);
    }
  };

  return users.length || !firstRefresh ? (
    <div className={styles.container}>
      <div className={styles.headerText}>
        <h1>Users Payment</h1>
      </div>
      <PageTable
        columns={columns}
        dataSource={usersTableData}
        limit={limit}
        creatingItem="User Payment"
        countOfPage={countOfPage}
        setCurrentPage={setCurrentPage}
        setLimit={setLimit}
      />
    </div>
  ) : (
    <Loader />
  );
}
