import Modal from 'components/shared/modal';
import AcceptPaymentCard from 'components/shared/acceptPaymentCard';
import { PaymentModalProps } from './types';

import styles from './paymentModal.module.scss';

export default function PaymentModal({
  open,
  setOpen,
}: PaymentModalProps): JSX.Element {
  return (
    <Modal
      isModalVisible={open}
      onCancel={() => setOpen(false)}
      className={styles.paymentModal}
      closable={false}
    >
      <AcceptPaymentCard setOpen={setOpen} />
    </Modal>
  );
}
