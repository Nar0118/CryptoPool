import Icon from 'components/shared/icon';
import { PaymentNotificationCardProps } from './types';
import { PaymentType } from 'types/transaction';

import styles from './paymentNotificationCard.module.scss';

export default function PaymentNotificationCard({
  recived,
  remaining,
  info,
  type,
  currency,
  close,
}: PaymentNotificationCardProps) {
  return (
    <div
      className={`${styles.notificationItem} ${
        type === PaymentType.PARTIAL ? styles.partial : styles.extra
      }`}
    >
      <div className={styles.header}>
        <span
          className={`${styles.stdLine} ${
            type === PaymentType.PARTIAL ? styles.redLine : styles.greenLine
          }`}
        />
        <div className={styles.closeButton} onClick={close}>
          <Icon
            className={styles.closeButtonImg}
            height={20}
            width={20}
            src={info?.icon}
          />
        </div>
      </div>
      <p className={styles.headerText}>{info.header}</p>
      <div
        className={`${styles.content} ${
          type === PaymentType.PARTIAL
            ? styles.contentBorderRed
            : styles.contentBorderGreen
        }`}
      >
        <div className={styles.context}>
          <p className={styles.infoTitle}>
            Received:{' '}
            <span className={styles.recived}>
              {recived} {currency}
            </span>
          </p>
        </div>
        {type !== PaymentType.EQUAL && (
          <div className={styles.context}>
            <p className={`${styles.infoTitle} ${styles.remainingContext}`}>
              {info.remainingText}
              <span className={styles.recived}>
                {remaining} {currency}*
              </span>
            </p>
          </div>
        )}
      </div>
      <div className={styles.footer}>
        <p>{info.footer}</p>
      </div>
    </div>
  );
}
