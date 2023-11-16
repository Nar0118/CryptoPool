import Button from 'components/shared/button';
import { ButtonType } from 'components/shared/button/type';
import { Modal as AntdModal } from 'antd/lib';
import { WarningModalProps } from './types';

import styles from './WarningModal.module.scss';

const WarningModal = ({
  onCancel,
  onAccept,
  visible,
  messageTitle,
}: WarningModalProps): JSX.Element => {
  return (
    <AntdModal
      centered
      className={styles.modal}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <h3>{messageTitle}</h3>
      <div className={styles.buttonContainer}>
        <Button
          text="Yes"
          className={styles.button}
          onClick={onAccept}
          btnType={ButtonType.black}
        />
        <Button
          text="Cancel"
          className={styles.button}
          onClick={onCancel}
          btnType={ButtonType.white}
        />
      </div>
    </AntdModal>
  );
};

export default WarningModal;
