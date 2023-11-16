import Icon from 'components/shared/icon';
import Button from 'components/shared/button';
import WhiteBox from 'components/shared/whiteBox';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { NotificationCardProps } from './type';

import styles from './notificationCard.module.scss';

export default function NotificationCard({
  setOpen,
  title,
  message,
  isModal,
  onClose,
}: NotificationCardProps): JSX.Element {
  return (
    <WhiteBox style={styles.whiteBox}>
      <div
        className={
          isModal ? styles.modalContainer : styles.notificationContainer
        }
      >
        {!isModal && (
          <span className={styles.closeIcon}>
            <Icon
              src={imagesSvg.close}
              width={22}
              height={22}
              onClick={onClose}
            />
          </span>
        )}
        <span>
          <div className={styles.modalHeader}>
            <div className={styles.iconBox}>
              <Icon width={26} height={26} src={imagesSvg[title]} />
            </div>
            <p className={styles.modalTitle}>{title.toUpperCase()}</p>
          </div>
          <p className={styles.modalText}>{message}</p>
        </span>
        <div className={styles.footer}>
          {isModal && (
            <Button
              className={styles.cancelButton}
              text="Cancel"
              onClick={() => setOpen(false)}
            />
          )}
          <Button
            className={styles.supportButton}
            text="Chat with support"
            iconSrc={imagesSvg.url}
          />
        </div>
      </div>
    </WhiteBox>
  );
}
