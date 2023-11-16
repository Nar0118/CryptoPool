import { Modal as AntdModal } from 'antd/lib';
import { ModalProps } from './types';

export default function Modal({
  children,
  isModalVisible,
  onCancel,
  ...rest
}: ModalProps): JSX.Element {
  return (
    <AntdModal
      centered
      visible={isModalVisible}
      onCancel={onCancel}
      footer={null}
      {...rest}
      maskStyle={{
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(15px)',
        zIndex: 100,
      }}
      style={{
        marginLeft: '212px',
      }}
    >
      {children}
    </AntdModal>
  );
}
