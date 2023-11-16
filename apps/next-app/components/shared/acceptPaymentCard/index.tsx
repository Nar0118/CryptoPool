import { useState } from 'react';
import Icon from 'components/shared/icon';
import InvoiceModal from 'components/feature/invoiceModal';
import ShareLinkModal from 'components/feature/shareLink';
import ApiModal from 'components/feature/apiModal';
import WhiteBox from 'components/shared/whiteBox';
import {
  PaymentModalType,
  paymentsModal,
  PaymentsModalProps,
} from 'utils/constants/paymentsModal';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { AcceptPaymentCardProps } from './type';

import styles from './acceptPaymentCard.module.scss';

export default function AcceptPaymentCard({
  setOpen,
}: AcceptPaymentCardProps): JSX.Element {
  const [openApiModal, setOpenApiModal] = useState<boolean>(false);
  const [openInvoiceModal, setOpenInvoiceModal] = useState<boolean>(false);
  const [openLinkModal, setOpenLinkModal] = useState<boolean>(false);

  const handlePayments = (type: PaymentModalType): void => {
    switch (type) {
      case PaymentModalType.API:
        setOpenApiModal(true);
        break;
      case PaymentModalType.INVOICE:
        setOpenInvoiceModal(true);
        break;
      case PaymentModalType.SHARE:
        setOpenLinkModal(true);
        break;
    }
    if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <WhiteBox style={styles.whiteBox}>
      <ApiModal
        open={openApiModal}
        setOpen={setOpenApiModal}
        setOpenParentModal={setOpen}
      />
      <InvoiceModal
        open={openInvoiceModal}
        setOpen={setOpenInvoiceModal}
        setOpenParentModal={setOpen}
      />
      <ShareLinkModal
        open={openLinkModal}
        setOpen={setOpenLinkModal}
        setOpenParentModal={setOpen}
      />
      <div className={styles.paymentModalContent}>
        <h1 className={styles.modalTitle}>Accept Payment through</h1>
        <div className={styles.buttonsWrapper}>
          {paymentsModal.map(
            (e: PaymentsModalProps, index: number): JSX.Element => (
              <div
                key={index}
                className={styles.modalItem}
                onClick={() => handlePayments(e.type)}
              >
                <div className={styles.modalItemContent}>
                  <div className={styles.imageBox}>
                    <Icon
                      src={e.icon}
                      width={e.width}
                      height={e.height}
                      className={styles.icon}
                    />
                  </div>
                  <span className={styles.title}>{e.title}</span>
                </div>
                <Icon src={imagesSvg.goTo} width={6} height={10} />
              </div>
            )
          )}
        </div>
      </div>
    </WhiteBox>
  );
}
