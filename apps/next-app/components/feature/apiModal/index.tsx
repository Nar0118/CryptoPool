import { useContext, useState } from 'react';
import Modal from 'components/shared/modal';
import Icon from 'components/shared/icon';
import Image from 'components/shared/image';
import Notification from 'components/shared/notification';
import { AuthContext } from 'utils/context/auth/context';
import { UserServiceContext } from 'utils/services/service/userService';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { handleCopyText } from 'utils/constants/functions';
import { ApiModalProps, EmbedType } from './types';

import styles from './apiModal.module.scss';

const embedType: EmbedType = {
  otherPayment: '/image/otherPayments.svg',
  cryptoCurrency: '/image/cryptoCurrency.svg',
};

export default function ApiModal({
  open,
  setOpen,
  setOpenParentModal,
}: ApiModalProps): JSX.Element {
  const userService = useContext(UserServiceContext);
  const { user } = useContext(AuthContext);

  const [selectedEmbed, setSelectedEmbed] = useState<{
    otherPayment: boolean;
    cryptoCurrency: boolean;
  }>({
    otherPayment: user?.embed === embedType.otherPayment,
    cryptoCurrency: user?.embed === embedType.cryptoCurrency,
  });

  const setEmbed = (embed: string): void => {
    switch (embed) {
      case embedType.cryptoCurrency:
        setSelectedEmbed({
          otherPayment: false,
          cryptoCurrency: true,
        });
        break;
      default:
        setSelectedEmbed({
          otherPayment: true,
          cryptoCurrency: false,
        });
        break;
    }
  };

  const updateEmbed = async (embed: string): Promise<void> => {
    const res = await userService.updateEmbed(embed);
    if (res?.success) setEmbed(res.data);
  };

  const handleCopy = async (value: string): Promise<void> => {
    await handleCopyText(value);
    Notification('Link is copied to clipboard');
  };

  return (
    <Modal
      isModalVisible={open}
      onCancel={() => {
        setOpenParentModal && setOpenParentModal(true);
        setOpen(false);
      }}
      className={styles.apiModal}
      closable={true}
      closeIcon={<Icon src={imagesSvg.close} width={22} height={22} />}
    >
      <div className={styles.apiModalContent}>
        <div onClick={() => setOpen(false)} className={styles.modalCloseButton}>
          <Icon src={imagesSvg.crossIcon} width={7} height={7} />
        </div>
        <h1 className={styles.modalTitle}>API Button</h1>
        <p className={styles.modalDescription}>
          Select Button versions you would like to send or embed in your
          application
        </p>
        <div className={styles.otherPayments}>
          <Image
            src={imagesSvg.otherPaymentIcon}
            onClick={() => updateEmbed(embedType.otherPayment)}
            width={100}
            height={50}
          />
          {selectedEmbed.otherPayment && (
            <div className={styles.checkedIcon}>
              <Icon src={imagesSvg.mark} width={23} height={23} />
            </div>
          )}
        </div>
        <div
          className={styles.cryptoCurrency}
          onClick={() => updateEmbed(embedType.cryptoCurrency)}
        >
          <Image src={imagesSvg.cryptoCurrency} width={315} height={70} />
          {selectedEmbed.cryptoCurrency && (
            <div className={styles.checkedIcon}>
              <Icon src={imagesSvg.mark} width={23} height={23} />
            </div>
          )}
        </div>
        <div
          className={styles.copyButton}
          onClick={() => handleCopy('Here will be API Link')}
        >
          <span>Copy the API Link</span>
          <div className={styles.arrowRight}>
            <Icon src={imagesSvg.arrowRightSecond} width={20} height={10} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
