import { notification as antdNotification } from 'antd/lib';
import { NotificationProps } from './types';

export default function notification({
  messageType,
  ...rest
}: NotificationProps) {
  return antdNotification[messageType]({
    ...(rest as any),
    style: { borderRadius: '10px', ...rest.style },
  });
}
