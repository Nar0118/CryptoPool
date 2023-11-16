import { notification } from 'antd';
import Icon from 'components/shared/icon';
import { imagesSvg } from 'utils/constants/imagesSrc';

import styles from './notification.module.scss';

export default function Notification(message: string, type?: string) {
  const key = `open${Date.now()}`;

  notification.open({
    message: (
      <div className={styles.message}>
        {type && <Icon width={40} height={40} src={imagesSvg[type]} />}
        <p className={styles.text}>{message}</p>
        <Icon
          onClick={() => notification.close(key)}
          width={11}
          height={11}
          src={imagesSvg.closeNotification}
        />
      </div>
    ),
    closeIcon: <></>,
    duration: 5,
    placement: 'bottom',
    key,
    className: styles.notification,
  });
}
