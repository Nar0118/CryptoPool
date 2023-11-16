import PaymentNotificationCard from 'components/shared/paymentNotificationCard';
import {
  EqualPayment,
  ExtraPayment,
  PartialPayment,
  PaymentNotificationProps,
} from './types';
import { PaymentType } from 'types/transaction';

import styles from './txNotification.module.scss';

export default function PaymentNotification({
  show,
  recived,
  remaining,
  type,
  currency,
  close,
}: PaymentNotificationProps) {
  const getInfo = () => {
    switch (type) {
      case PaymentType.EQUAL:
        return EqualPayment;
      case PaymentType.EXTRA:
        return ExtraPayment;
      default:
        return PartialPayment;
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.basePosition} ${show && styles.show}`}>
        <PaymentNotificationCard
          recived={recived}
          remaining={remaining}
          type={type ?? PaymentType.PARTIAL}
          info={getInfo()}
          currency={currency}
          close={close}
        />
      </div>
    </div>
  );
}
