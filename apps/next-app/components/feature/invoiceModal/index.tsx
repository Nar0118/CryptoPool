import Modal from 'components/shared/modal';
import Icon from 'components/shared/icon';
import Invoice from 'components/shared/invoice';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { InvoiceModalProps } from './types';

import styles from './invoiceModal.module.scss';

export default function InvoiceModal({
  open,
  setOpen,
  setOpenParentModal,
}: InvoiceModalProps): JSX.Element {
  return (
    <Modal
      isModalVisible={open}
      onCancel={() => {
        setOpenParentModal && setOpenParentModal(true);
        setOpen(false);
      }}
      className={styles.container}
      closeIcon={<Icon src={imagesSvg.close} width={22} height={22} />}
    >
      <Invoice setOpenParentModal={setOpenParentModal} setOpen={setOpen} />
    </Modal>
  );
}
