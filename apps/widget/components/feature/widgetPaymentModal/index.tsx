import { useEffect, useState } from 'react';
import PayWidgetScreen from 'components/shared/payWidgetScreen';
import QrPayWidgetScreen from 'components/shared/qrPayWidgetScreen';
import { LoadingOutlined } from '@ant-design/icons';
import Modal from 'components/shared/modal';
import ResultWidgetScreen from 'components/shared/resultWidgetScreen';
import { PbPayCoins } from 'components/shared/payWidgetScreen/types';
import { useModalContext } from 'utils/context/modal/context';
import { useDisableUser } from 'utils/hook/useDisableUser';
import AuthPaymentUser from '../authPaymentUser';
import {
  AfterCompletion,
  AfterCompletionType,
  Currency,
  WidgetPaymentModalProps,
} from './types';

import styles from './widgetPaymentModal.module.scss';

export default function WidgetPaymentModal({
  open,
  primaryWalletId,
  amount,
  timer,
  isActive,
  tempWallet,
  updateData,
  userData,
  setUserData,
  updateWalletData,
  paymentError,
  setPaymentError,
  isFetched,
  merchantId,
}: WidgetPaymentModalProps): JSX.Element {
  const { modal, setModal, hide } = useModalContext();
  const disableActiveUser = useDisableUser();
  const [currency, setCurrency] = useState<Currency>();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [afterCompletion, setAfterCompletion] = useState<AfterCompletion>({
    type: AfterCompletionType.none,
    url: null,
  });

  useEffect(() => {
    if (userData) {
      if (userData.afterCompletionType === AfterCompletionType.redirect) {
        setAfterCompletion({
          type: AfterCompletionType.redirect,
          url: userData?.redirectionUrl,
        });
      }
    }
  }, [userData]);

  const goBack = (): void => {
    disableActiveUser();
    setModal({ hide: false, index: 0 });
  };

  const currentModal = (): JSX.Element => {
    if (!isFetched) {
      return (
        <div className={styles.loadingContainer}>
          <LoadingOutlined />
        </div>
      );
    }

    if (paymentError && isFetched) {
      return (
        <ResultWidgetScreen
          setPaymentError={setPaymentError}
          paymentError={paymentError}
          success={false}
          afterCompletion={afterCompletion}
        />
      );
    }

    if ((!userData && !userData?.key) || modal === 0) {
      return (
        <AuthPaymentUser
          setIsLogin={setUserData}
          updateWalletData={updateWalletData}
          merchantId={merchantId}
        />
      );
    }
    switch (modal) {
      case 1:
        return (
          <PayWidgetScreen
            payAmount={amount}
            setCurrency={setCurrency}
            convertedAmount={userData.amount}
            currency={currency}
            paymentKey={userData?.key}
            goBack={goBack}
          />
        );
      case 2:
        return (
          <QrPayWidgetScreen
            timer={timer}
            currency={currency}
            tempWallet={tempWallet}
            email={userData.email}
            paymentKey={userData.key}
            primaryWalletId={primaryWalletId}
            updateData={updateData}
            payAmount={amount}
            setIsSuccess={setIsSuccess}
            goBack={goBack}
          />
        );
      case 3:
        return (
          <ResultWidgetScreen
            success={isSuccess}
            afterCompletion={afterCompletion}
          />
        );
    }
  };

  function getKeyByValue(value: string): string {
    return Object.keys(PbPayCoins)
      .find((key) => PbPayCoins[key] === value)
      .toString();
  }

  useEffect(() => {
    const fetchConvertedCurrency = async () => {
      if (tempWallet && currency && !isChanged && isActive) {
        const userCurrency = {
          name: getKeyByValue(tempWallet.currency),
          token: tempWallet.currency,
          convertedValue: userData?.amount,
        };
        setModal({ hide: false, index: 2 });
        setCurrency(userCurrency);
        setIsChanged(true);
      }
    };
    fetchConvertedCurrency();
  }, [tempWallet, currency, isActive]);

  return (
    <Modal
      isModalVisible={open}
      onCancel={() => null}
      className={styles.widgetPaymentModal}
      closable={false}
    >
      <div
        style={{
          display: hide ? 'none' : 'block',
        }}
      >
        {currentModal()}
      </div>
      {hide && (
        <div className={styles.loadingContainer}>
          <LoadingOutlined />
        </div>
      )}
    </Modal>
  );
}
