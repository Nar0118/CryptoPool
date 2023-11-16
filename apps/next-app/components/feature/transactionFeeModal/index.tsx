import Modal from 'components/shared/modal';
import TransactionFee from 'components/shared/transactionFees';
import Icon from 'components/shared/icon';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { TransactionFeeModalProps } from './types';

import styles from './transactionFeeModal.module.scss';

export default function TransactionFeeModal({
  open,
  setOpen,
  setOpenParent,
}: TransactionFeeModalProps): JSX.Element {
  return (
    <Modal
      isModalVisible={open}
      onCancel={() => {
        setOpenParent(true);
        setOpen(false);
      }}
      className={styles.container}
      closeIcon={<Icon src={imagesSvg.close} width={22} height={22} />}
    >
      <TransactionFee />
    </Modal>
  );
}
