import router from 'next/router';
import { LoadingOutlined } from '@ant-design/icons';
import Icon from 'components/shared/icon';
import Button from 'components/shared/button';
import { UserPaymentStatus } from 'components/feature/paymentUser/type';
import { AfterCompletionType } from 'components/feature/widgetPaymentModal/types';
import { imagesSvg } from 'utils/constants/imagesSrc';
import env from 'utils/constants/env';
import { ResultWidgetModalProps } from './types';
import * as localStorage from 'utils/services/localStorageService';
import localStorageKeys from 'utils/constants/localStorageKeys';
import { useModalContext } from 'utils/context/modal/context';

import styles from './resultWidgetScreen.module.scss';
import { useEffect } from 'react';

export default function ResultWidgetScreen({
  success,
  paymentError,
  setPaymentError,
  afterCompletion,
}: ResultWidgetModalProps): JSX.Element {
  const { setModal } = useModalContext();
  const disableUser = (): void => {
    localStorage.removeItemFromLocalStorage(localStorageKeys.PAYMENT_KEY);
  };

  useEffect(() => {
    if (!paymentError) {
      disableUser();
    }
  }, []);

  const handleHomeClick = () => {
    const currentURLWithoutQuery =
      window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, currentURLWithoutQuery);
    setModal({ hide: false, index: 0 });
    setPaymentError(null);
  };

  const renderError = () => {
    if (!paymentError) {
      return success
        ? 'Your payment is successful, we have sent you a confirmation email, have a nice day.'
        : 'It was rejected due to insufficient wallet balance.';
    }
    return paymentError;
  };

  const renderType = () => {
    if (!paymentError) {
      return success ? 'Congratulations' : 'Reject';
    }
    const capitalizedPaymentType =
      UserPaymentStatus.FAILED.charAt(0).toUpperCase() +
      UserPaymentStatus.FAILED.slice(1);
    return capitalizedPaymentType;
  };

  const renderHomeButton = () => {
    if (
      !paymentError &&
      afterCompletion.type !== AfterCompletionType.redirect
    ) {
      return (
        <Button
          text="Go to Home"
          onClick={() => handleHomeClick()}
          className={styles.gotoHome}
        />
      );
    } else if (
      afterCompletion.type === AfterCompletionType.redirect &&
      afterCompletion.url &&
      !paymentError
    ) {
      let url = afterCompletion.url.substring(0, 30);
      if (afterCompletion.url.length > 30) {
        url += '...';
      }

      setTimeout(() => {
        router.push(afterCompletion.url);
      }, 2000);

      return (
        <div>
          <div
            onClick={() => handleHomeClick()}
            className={styles.redirectionBtn}
          >
            <div className={styles.top}>
              <p>Redirecting...</p>
              <LoadingOutlined />
            </div>
            <p className={styles.redirectingUrl}>to {url}</p>
          </div>
        </div>
      );
    }
    return <></>;
  };

  return (
    <div className={styles.container}>
      <p className={styles.headerText}>Payment Gateway</p>
      <div className={styles.congrats}>
        <Icon
          src={success ? imagesSvg.congrats : imagesSvg.rejectIcon}
          width={180}
          height={150}
        />
        <div className={styles.hands}>
          <span>{renderType()}</span>
          {!paymentError && (
            <Icon
              src={success ? imagesSvg.clappingHands : imagesSvg.fail}
              width={30}
              height={15}
            />
          )}
        </div>
        <div className={styles.text}>{renderError()}</div>
      </div>
      <div className={styles.buttonWrapper}>{renderHomeButton()}</div>
      <div className={styles.support}>
        <div>
          In case of transaction fail, go to{' '}
          <a href={`mailto:${env.supportEmailAddress}`}>Support Center</a>
        </div>
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
  );
}
