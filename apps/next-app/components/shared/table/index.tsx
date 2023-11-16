import { useState } from 'react';
import { Menu, Table } from 'antd';
import WhiteBox from 'components/shared/whiteBox';
import Modal from 'components/shared/modal';
import NotificationCard from 'components/shared/notificationCard';
import Icon from 'components/shared/icon';
import ShareBar from 'components/shared/filterBar';
import { orderColumns, warningModalContent } from 'utils/constants/fakeData';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { OrderData, OrderStatus } from 'types/orders';
import DashboardTableProps, { ModalContent } from './types';

import styles from './table.module.scss';

export default function DashboardTable({
  tableTitle,
  className,
  dataSource,
  countOfPage,
  setCurrentPage,
  rowKey,
  ...rest
}: DashboardTableProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ModalContent>();

  const openWarningModal = (status: OrderStatus): void => {
    if (status == OrderStatus.FAILED) {
      setModalContent({
        title: warningModalContent.filedModalTitle,
        message: warningModalContent.filedModalMessage,
        cardType: warningModalContent.filedModalIcon,
      });
    } else {
      setModalContent({
        title: warningModalContent.wrongModalTitle,
        message: warningModalContent.wrongModalMessage,
        cardType: warningModalContent.wrongModalIcon,
      });
    }
    setOpen(true);
  };

  const statusColumn = [
    {
      title: 'Order Status',
      key: 'status',
      render: (item: OrderData) => (
        <div className={styles.orderStatusRow}>
          <span className={`${item.status}`}>{item.status}</span>
          {item.status != OrderStatus.DONE && (
            <Icon
              className={styles.statusIcon}
              src={imagesSvg.warning}
              width={20}
              height={20}
              onClick={() => openWarningModal(item.status)}
            />
          )}
        </div>
      ),
      ellipsis: true,
    },
  ];

  const columns = [...orderColumns, ...statusColumn];

  const menu: JSX.Element = (
    <Menu>
      <Menu.Item>Amount</Menu.Item>
      <Menu.Item>Date</Menu.Item>
      <Menu.Item>Status</Menu.Item>
    </Menu>
  );

  return (
    <>
      {open && (
        <Modal
          closable={false}
          bodyStyle={{
            paddingTop: 25,
            paddingLeft: 30,
            paddingBottom: 15,
            paddingRight: 10,
          }}
          isModalVisible={open}
          onCancel={() => setOpen(false)}
          className={styles.modal}
        >
          <NotificationCard
            setOpen={setOpen}
            title={modalContent.title}
            message={modalContent.message}
            cardType={modalContent.cardType}
            isModal
          />
        </Modal>
      )}
      <div className={styles.table}>
        <WhiteBox>
          {tableTitle && (
            <div className={styles.header}>
              <span className={styles.title}>{tableTitle}</span>
              <ShareBar />
            </div>
          )}
          <div className={className}>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={{ total: countOfPage }}
              onChange={(e) => setCurrentPage(e.current)}
              rowKey={rowKey}
              {...rest}
            />
          </div>
        </WhiteBox>
      </div>
    </>
  );
}
