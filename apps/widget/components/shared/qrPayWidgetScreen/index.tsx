import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setTimeout } from 'timers';
import Cookies from 'js-cookie';
import Notification from 'components/shared/notification';
import Icon from 'components/shared/icon';
import Timer from 'components/shared/timer';
import PaymentNotification from 'components/shared/transactionNotification';
import Spinner from 'components/shared/loadingSpinner';
import { ITimerData } from 'components/feature/paymentUser/type';
import { useSocketContext } from 'utils/context/socket/context';
import { TimerServiceContext } from 'utils/services/service/timerService';
import { PaymentServiceContext } from 'utils/services/service/paymentService';
import { UserServiceContext } from 'utils/services/service/userService';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { handleCopyText, handleQrCode } from 'utils/constants/functions';
import { ChildWallet } from 'utils/model/user';
import { getTimeZoneDifference } from 'utils/convetTime';
import { AuthPaymentServiceContext } from 'utils/services/service/authPaymentService';
import env from 'utils/constants/env';
import { useModalContext } from 'utils/context/modal/context';
import { CookiesKeys, Payment, QrPayWidgetScreenProps } from './types';
import { PaymentType } from 'types/transaction';
import { PbPayCoins } from '../payWidgetScreen/types';

import styles from './qrPayWidgetScreen.module.scss';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const QrPayWidgetScreen: FC<QrPayWidgetScreenProps> = ({
  primaryWalletId,
  currency,
  payAmount,
  setIsSuccess,
  timer,
  tempWallet,
  email,
  paymentKey,
  updateData,
  goBack,
}): JSX.Element => {
  const userService = useContext(UserServiceContext);
  const paymentService = useContext(PaymentServiceContext);
  const authPaymentService = useContext(AuthPaymentServiceContext);

  const { checkTime, setCheckTime, setIsCleared } = useContext(
    TimerServiceContext
  );

  const { socket } = useSocketContext();
  const { setModal } = useModalContext();
  const { query } = useRouter();

  const lastPaymentCookie = Cookies.get(CookiesKeys.LAST_PAYMENT);
  const lastPaymentIdCookie = Cookies.get(CookiesKeys.LAST_PAYMENT_ID);

  const [childWallet, setChildWallet] = useState<ChildWallet>(tempWallet);
  const [timerData, setTimerData] = useState<ITimerData>();
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [hideBackButton, setHideBackButton] = useState<boolean>(false);
  const [listenerSet, setListenerSet] = useState<boolean>(false);
  const [qrContent, setQrContent] = useState<string>();
  const [loadingQr, setLoadingQr] = useState<boolean>(true);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [lastPayment, setLastPayment] = useState<Payment>(
    lastPaymentCookie
      ? JSON.parse(lastPaymentCookie)
      : {
          id: null,
          amount: null,
          balance: null,
          type: null,
          capacity: null,
        }
  );
  const [lastPaymentId, setLastPaymentId] = useState<string>(
    lastPaymentIdCookie
  );

  const handleCopyAddress = async (): Promise<void> => {
    await handleCopyText(childWallet.address);
    Notification('Wallet address copied successfully');
  };

  const handleCopyTag = async (): Promise<void> => {
    await handleCopyText(childWallet.tag);
    Notification('Wallet tag copied successfully');
  };

  const handleChangeModal = (): void => {
    setIsSuccess(true);
    setIsCleared(true);
    setCheckTime(false);
    setModal({ hide: false, index: 3 });
    removeCookies();
  };

  const getChildWalletForPay = async (): Promise<void> => {
    const wallet = await userService.getPayWallet(
      primaryWalletId,
      currency.token,
      paymentKey
    );

    if (wallet?.success) {
      const url = await paymentService.payWithQr(paymentKey);

      setChildWallet(wallet.childWallet);
      setIsCleared(false);

      if (url?.success) {
        setQrContent(url?.data);
        setLoadingQr(false);
      }

      socket.emit('childWallet', {
        key: paymentKey,
      });
    } else {
      Notification('Something gone wrong when trying to create a wallet');
      setCheckTime(false);
      setModal({ hide: false, index: 1 });
    }
  };

  useEffect(() => {
    if (query.key) {
      setHideBackButton(true);
    }
  }, [query]);

  const getChildWalletForUserPayment = async () => {
    if (tempWallet) {
      const url = await paymentService.payWithQr(paymentKey);
      setChildWallet(tempWallet);

      if (url?.success) {
        setQrContent(url?.data);
        setLoadingQr(false);
      }
      setIsCleared(false);

      socket.emit('childWallet', {
        key: paymentKey,
      });
    }
  };

  useEffect(() => {
    if (tempWallet) {
      getChildWalletForUserPayment();
    }
  }, [tempWallet]);

  useEffect(() => {
    socket.connect();
    if (!tempWallet) {
      getChildWalletForPay();
    } else {
      getChildWalletForUserPayment();
    }
  }, []);

  useEffect(() => {
    if (qrContent) {
      const qr = handleQrCode(qrContent);
      setQrDataUrl(qr);
    }
  }, [qrContent]);

  const checkPaymentStatus = async (): Promise<void> => {
    if (checkTime) {
      paymentService.transferToBackUsers(childWallet?._id, 5);

      socket.disconnect();
      return;
    }

    if (!listenerSet) {
      socket.on('childWallet', async (socketChildWallet) => {
        if (socketChildWallet?.lastTransaction) {
          const { id, amount } = socketChildWallet.lastTransaction;
          let { balance } = socketChildWallet;

          const type =
            balance > currency?.convertedValue
              ? PaymentType.EXTRA
              : balance < currency.convertedValue
              ? PaymentType.PARTIAL
              : PaymentType.EQUAL;

          const capacity =
            type === PaymentType.EXTRA
              ? balance - currency?.convertedValue
              : currency?.convertedValue - balance;

          setLastPayment({
            id,
            type,
            amount,
            balance,
            capacity,
          });
          Cookies.set(
            Cookies.LAST_PAYMENT,
            JSON.stringify({
              id,
              type,
              amount,
              balance,
              capacity,
            })
          );
          setLastPaymentId(id);
          Cookies.set(CookiesKeys.LAST_PAYMENT_ID, id);
        }
        if (socketChildWallet?.success && !showPayment) {
          socket.disconnect();
        }
      });

      setListenerSet(true);
    }
  };

  const removeCookies = (): void => {
    Cookies.remove(CookiesKeys.LAST_PAYMENT);
    Cookies.remove(CookiesKeys.LAST_PAYMENT_ID);
  };

  const checkPassedTime = async (): Promise<void> => {
    if (checkTime) {
      setIsSuccess(false);
      setCheckTime(false);
      setModal({ hide: false, index: 3 });
      removeCookies();
    }
  };

  useEffect(() => {
    if (lastPayment?.id && lastPayment?.id !== lastPaymentId) {
      setShowPayment(true);
    }

    if (showPayment) {
      setTimeout(() => {
        if (
          lastPayment?.type === PaymentType.EQUAL ||
          lastPayment?.type === PaymentType.EXTRA
        ) {
          handleChangeModal();
        }
        setShowPayment(false);
      }, 3000);
    }
  }, [lastPayment, showPayment]);

  const payInMetamask = (): void => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = window.ethereum;
      if (provider) {
        provider
          .request({ method: 'eth_requestAccounts' })
          .then(() => {
            Notification('It is already open on browser, check extension.');
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.error('No provider found.');
      }
    } else {
      window.open('https://metamask.io/download.html', '_blank');
    }
  };

  const setTime = useCallback(async () => {
    if (!timer || !childWallet?._id) {
      const defaultDate = new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
      });

      const update = await authPaymentService.updateUserData(
        email,
        paymentKey,
        childWallet?._id,
        defaultDate,
        childWallet.pbId,
        currency.convertedValue,
        currency.token
      );
      if (update) updateData();
    }
  }, [childWallet]);

  const handleClose = (): void => {
    setShowPayment(false);
  };

  useEffect(() => {
    if (childWallet && childWallet._id) {
      setTime();
    }
  }, [childWallet]);

  useEffect(() => {
    checkPaymentStatus();
  }, [listenerSet, checkTime]);

  useEffect(() => {
    checkPassedTime();
  }, [checkTime]);

  useEffect(() => {
    if (timer) {
      const ms: ITimerData = getTimeZoneDifference(timer);
      setTimerData(ms);
    } else {
      setTimerData(null);
    }
  }, [timer, tempWallet]);

  return (
    <div className={styles.container}>
      <PaymentNotification
        show={showPayment}
        recived={lastPayment?.amount}
        remaining={lastPayment?.capacity}
        type={lastPayment?.type}
        currency={currency?.token}
        close={handleClose}
      />
      <div className={!childWallet ? styles.loading : styles.hide}>
        <Spinner />
      </div>
      <div className={(!childWallet && styles.hide) || ''}>
        <p className={styles.headerText}>Payment Gateway</p>
        <div className={styles.goBack}>
          {!hideBackButton && (
            <div className={styles.goBackButton}>
              <Icon
                src={imagesSvg.goBack}
                width={30}
                height={20}
                onClick={goBack}
              />
            </div>
          )}
          <div className={styles.price}>
            <div className={styles.payingContainer}>
              Paying: <span>${payAmount}</span>
            </div>
            <div className={styles.currencyContainer}>
              By {currency?.name}:{' '}
              <span>
                {currency?.convertedValue} {currency?.name}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.payMethods}>
          <div className={styles.title}>Scan QR</div>
          <div className={styles.qrWrapper}>
            {!loadingQr ? (
              <img src={qrDataUrl} width={150} height={150} />
            ) : (
              <div className={styles.spinnerLoader}>
                <Spinner />
              </div>
            )}
          </div>
          <span>or</span>
          <div className={styles.title}>Send to Wallet Address</div>
          <div
            className={`${styles.walletAddress} ${styles.addresCopyContainer}`}
          >
            <div className={styles.addressWrapper}>
              <Icon
                src={imagesSvg.wallet}
                className={styles.walletIcon}
                width={20}
                height={20}
              />
              <div className={styles.address}>{childWallet?.address}</div>
            </div>
            <div className={styles.copyBackground}>
              <div className={styles.copyWrapper} onClick={handleCopyAddress}>
                <Icon src={imagesSvg.copy} width={20} height={20} />
                <span>Copy</span>
              </div>
            </div>
            <div className={styles.copyBackground}>
              <div className={styles.copyWrapper} onClick={payInMetamask}>
                <Icon src={imagesSvg.metamask} width={20} height={20} />
                <span>Metamask</span>
              </div>
            </div>
          </div>
          {currency?.token === PbPayCoins.XRP && (
            <div className={styles.tagContainer}>
              <span>Dest. Tag</span>
              <div className={styles.walletAddress}>
                <div
                  className={styles.addressWrapper}
                  style={{ width: '100%' }}
                >
                  <div className={styles.tag}>{childWallet?.tag}</div>
                </div>
                <div className={styles.copyBackground}>
                  <div className={styles.copyWrapper} onClick={handleCopyTag}>
                    <Icon src={imagesSvg.copy} width={20} height={20} />
                    <span>Copy</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.time}>
          <Icon src={imagesSvg.timer} width={20} height={20} />
          <div className={styles.text}>
            <p>
              Payment expires in
              {timerData && <Timer {...timerData} timer={timer} />} Minutes
            </p>
          </div>
        </div>
        <div className={styles.support}>
          <div>
            If you need any help, please visit {''}
            <a href={`mailto:${env.supportEmailAddress}`}>Support Center</a>
          </div>
          <div className={styles.hide}>
            If it is taking time, you can check the status on this <a>link</a>
          </div>
        </div>
        <div className={styles.stdLine}>
          <hr />
        </div>
        <div className={styles.modalFooter}>
          <Icon src={imagesSvg.logoSmall} width={110} height={41} />
          <div className={styles.infoSection}>
            <a href={`mailto:${env.supportEmailAddress}`}>
              Help & Privacy Policy
            </a>
            <a href={`mailto:${env.supportEmailAddress}`}>Terms & Conditions</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrPayWidgetScreen;
