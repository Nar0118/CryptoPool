import { FC, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/router';
import WidgetPaymentModal from 'components/feature/widgetPaymentModal';
import { IPaymentUserData } from 'components/feature/paymentUser/type';
import Button from 'components/shared/button';
import Spinner from 'components/shared/loadingSpinner';
import { UserServiceContext } from 'utils/services/service/userService';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { PaymentFormat } from 'types/paymentAuth';

import styles from './paymentWidget.module.scss';

const PaymentWidget: FC<IPaymentUserData> = ({
  amountUSD,
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
  merchant,
  setMerchant,
}): JSX.Element => {
  const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false);
  const [windowReady, setWindowReady] = useState<boolean>(false);
  const [isMerchantFetched, setIsMerchantFetched] = useState<boolean>(false);
  const userService = useContext(UserServiceContext);
  const router = useRouter();
  const { merchantId, key } = router.query;

  const handleModalOpen = (): void => {
    setOpenPaymentModal(true);
  };

  const getMerchantInfo = async (): Promise<void> => {
    let currentMerchantId = merchantId as string;
    if (!currentMerchantId && !(key as string)) {
      // If merchant id is missing from URL its working depend on Rinky merchant by default
      currentMerchantId = '6482e1bd4085ab5e149a9c2f'; // todo
    }

    if (currentMerchantId) {
      if (key as string) {
        router.push('/404');
      }
      const { data } = await userService.getUserById(currentMerchantId);

      if (!data) {
        router.push('/404');
      }

      if (data) {
        setMerchant(data);
      }
    } else if (userData) {
      const { data } = await userService.getUserById(userData.merchantId);

      setMerchant(data);
    }
    setIsMerchantFetched(true);
  };

  useEffect(() => {
    if (userData) {
      setOpenPaymentModal(true);
    }
  }, [userData]);

  useEffect(() => {
    if (!isMerchantFetched) {
      return;
    }

    const checkingValidity = () => {
      if (merchant && windowReady) {
        const { merchantId, key } = router.query;
        if (merchant.paymentFormat === PaymentFormat.MANUALLY_DETAILS && key) {
          router.push('/404');
        } else if (
          (merchant.paymentFormat === PaymentFormat.AT_ONCE_DETAILS &&
            merchantId) ||
          (merchant.paymentFormat === PaymentFormat.AT_ONCE_DETAILS && !key)
        ) {
          router.push('/404');
        } else if (merchantId && !merchant) {
          router.push('/404');
        }
      } else if (!merchant && windowReady && !paymentError) {
        router.push('/404');
      }
    };

    checkingValidity();
  }, [merchant, merchantId, key, isMerchantFetched]);

  useEffect(() => {
    if (windowReady || userData) {
      setTimeout(() => {
        getMerchantInfo();
      }, 1000);
    }
  }, [tempWallet, merchantId, key, userData, windowReady]);

  useEffect(() => {
    window.addEventListener('load', () => {
      if (window.document.readyState === 'complete') setWindowReady(true);
    });
  }, []);

  const handleRedirect = (): void => {
    window.location.replace('https://cryptopool.typeform.com/to/LIu3l0ZV');
  };

  useEffect(() => {
    if (paymentError) {
      setOpenPaymentModal(true);
    }
  }, [paymentError]);

  return (
    <div>
      {isMerchantFetched ? (
        <>
          <div className={styles.button}>
            <Button
              className={styles.redirectButton}
              width={300}
              height={300}
              isIcon
              widgetSrc={imagesSvg.purchaseCurrency}
              onClick={handleRedirect}
            />
            <Button
              width={300}
              height={300}
              className={styles.modalButton}
              widgetSrc={merchant?.embed}
              onClick={handleModalOpen}
            />
          </div>
          {(merchant || paymentError) && (
            <WidgetPaymentModal
              isFetched={isFetched}
              isActive={isActive}
              open={openPaymentModal}
              timer={timer}
              updateData={updateData}
              tempWallet={tempWallet}
              primaryWalletId={merchant?.primaryWalletId}
              merchantId={merchant?._id}
              paymentError={paymentError}
              amount={Number(amountUSD)}
              userData={userData}
              setUserData={setUserData}
              updateWalletData={updateWalletData}
              setPaymentError={setPaymentError}
            />
          )}
        </>
      ) : (
        <div className={styles.loadingContainer}>
          <Spinner />
        </div>
      )}
    </div>
  );
};
export default PaymentWidget;
