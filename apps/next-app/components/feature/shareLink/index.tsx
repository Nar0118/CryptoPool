import Modal from 'components/shared/modal';
import Icon from 'components/shared/icon';
import SharedLink from 'components/shared/ShareLink';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { ShareLinkModalProps } from './type';

import styles from './shareLink.module.scss';

export default function ShareLinkModal({
  open,
  setOpen,
  setOpenParentModal,
}: ShareLinkModalProps): JSX.Element {
  return (
    <Modal
      bodyStyle={{
        paddingTop: 10,
        paddingLeft: 30,
        paddingBottom: 30,
        paddingRight: 30,
      }}
      isModalVisible={open}
      onCancel={() => {
        setOpenParentModal && setOpenParentModal(true);
        setOpen(false);
      }}
      className={styles.modal}
      closeIcon={<Icon src={imagesSvg.close} width={22} height={22} />}
    >
      <SharedLink />
    </Modal>
  );
}
