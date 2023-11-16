import { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PaymentWidget from 'components/feature/paymentWidget';
import { useDisableUser } from 'utils/hook/useDisableUser';
import { AuthPaymentServiceContext } from 'utils/services/service/authPaymentService';
import { ChildWallet, User } from 'utils/model/user';
import { getPaymentInfo } from 'utils/getPaymentInfo';
import { getTimeZoneDifference } from 'utils/convetTime';
import { useModalContext } from 'utils/context/modal/context';
import { UserServiceContext } from 'utils/services/service/userService';
import { PaymentServiceContext } from 'utils/services/service/paymentService';
import { IPaymentUser, PaymentData, TempWalletsType } from './type';
import { PaymentFormat } from 'types/paymentAuth';

import styles from './paymentUser.module.scss';

const PaymentUser = () => {
  const authPaymentService = useContext(AuthPaymentServiceContext);
  const paymentService = useContext(PaymentServiceContext);
  const userService = useContext(UserServiceContext);
  const disableActiveUser = useDisableUser();
  const [userData, setUserData] = useState<IPaymentUser>(null);
  const [merchant, setMerchant] = useState<User>();
  const [windowReady, setWindowReady] = useState<boolean>(false);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const { setModal } = useModalContext();
  const [paymentData, setPaymentData] = useState<PaymentData>({
    email: '',
    key: '',
  });
  const [isKeyFetched, setIsKeyFetched] = useState<boolean>(false);
  const [tempWallet, setWallet] = useState<ChildWallet>();
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [activePaymentData, setData] = useState<TempWalletsType>({
    isActive: false,
    timer: '',
    tempWalletId: '',
    createdAt: '',
  });

  const disablePayment = async (isActive: boolean, timer: string) => {
    if (isActive && getTimeZoneDifference(timer).minute >= 15) {
      const { key } = getPaymentInfo();
      disableActiveUser();
      getPaymentUserData(key);
      setData(null);
    }
  };

  useEffect(() => {
    if ((router.query.key as string) && windowReady) {
      const key = (router.query.key as string) || '';

      if (!key) {
        router.push('/404');
      }

      setPaymentData({ ...paymentData, key });
      setIsKeyFetched(true);
    } else if (windowReady) {
      setIsKeyFetched(true);
    }
  }, [router.query, windowReady]);

  const getCurrentDate = (): string => {
    const currentDate = new Date()
      .toLocaleString('en-US', { timeZone: 'UTC' })
      .split(',')[0]
      .split('/')
      .reverse()
      .map((el) => {
        if (el.length === 1) {
          return '0' + el;
        }
        return el;
      });

    const tmp = currentDate[2];
    currentDate[2] = currentDate[1];
    currentDate[1] = tmp;

    return currentDate.join('-');
  };

  useEffect(() => {
    disablePayment(activePaymentData?.isActive, activePaymentData?.timer);
    if (!paymentData.key) {
      setWallet(null);
    }
  }, [activePaymentData]);

  const updateWalletData = async (
    user: IPaymentUser,
    create: boolean = false
  ) => {
    try {
      const formattedCurrentDate = getCurrentDate();

      const data = user?.tempWallets?.find(({ isActive, createdAt }) => {
        const createdAtDate = createdAt.split('T')[0];
        return isActive && createdAtDate === formattedCurrentDate;
      });
      setData({ ...data });

      if (data && data?.tempWalletId) {
        const userTempWallet = await authPaymentService.getActiveTempWallet(
          data?.tempWalletId
        );
        if (!create) {
          setModal({ hide: true, index: 1 });
        }

        setWallet(userTempWallet.data);
      } else if (create && user) {
        const merchant = await userService.getUserById(user?.merchantId);
        if (merchant?.data && merchant?.data.primaryWalletId) {
          const primaryWalletId = merchant?.data.primaryWalletId;

          const walletResponse = await userService.getPayWallet(
            primaryWalletId,
            user?.currency,
            user?.key
          );

          const childWallet = walletResponse.childWallet;

          const defaultDate = new Date().toLocaleString('en-US', {
            timeZone: 'UTC',
          });

          const price = await paymentService.convertUsdToCoinWidget(user?.key);
          const convertedAmount = Number(price.data[user?.currency]);

          await authPaymentService.updateUserData(
            user?.email?.toString(),
            user?.key?.toString(),
            childWallet?._id,
            defaultDate,
            childWallet?.pbId,
            convertedAmount
          );

          getPaymentUserDataByPaymentInfo(false);

          const res = await authPaymentService.getPaymentUser(paymentData?.key);
          const paymentUser = res.user;
          const activePaymentWallet = paymentUser?.tempWallets?.find(
            ({ isActive, createdAt }) => {
              const createdAtDate = createdAt.split('T')[0];
              return isActive && createdAtDate === formattedCurrentDate;
            }
          );
          setData({ ...activePaymentWallet });
          setWallet(childWallet);
        }
      }
      setIsFetched(true);
    } catch {
      setIsFetched(true);
    }
  };

  const getPaymentUserDataByPaymentInfo = async (
    updateWallet: boolean = true
  ) => {
    try {
      const res = await authPaymentService.getPaymentUser(paymentData.key);
      const payment = res.user;
      const message = res.message;
      if (message) {
        setError(message);
        setModal({ hide: false, index: 3 });
      }

      if (
        !payment ||
        (payment && payment?.paymentFormat !== PaymentFormat.AT_ONCE_DETAILS)
      ) {
        setModal({ hide: false, index: 3 });
      } else {
        setUserData(payment);
      }
      if (updateWallet) {
        await updateWalletData(payment, true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getPaymentUserData = useCallback(
    async (key: string) => {
      try {
        const res = await authPaymentService.getPaymentUser(key);
        const user = res.user;
        const message = res.message;
        setUserData(message ? null : user);
        await updateWalletData(user);
      } catch (e) {
        console.log(e);
      }
    },
    [authPaymentService]
  );

  const updateData = () => {
    const { key } = getPaymentInfo();
    if (!paymentData.key && windowReady) {
      getPaymentUserData(key);
    }
  };

  useEffect(() => {
    const { key } = getPaymentInfo();

    if (key && windowReady && isKeyFetched && !paymentData.key) {
      getPaymentUserData(key);
    } else {
      setIsFetched(true);
    }
  }, [getPaymentUserData, windowReady, isKeyFetched, paymentData]);

  useEffect(() => {
    window.addEventListener('load', () => {
      if (window.document.readyState === 'complete') setWindowReady(true);
    });
  }, []);

  useEffect(() => {
    if (paymentData.key && windowReady) {
      setModal({ hide: true, index: 1 });
      getPaymentUserDataByPaymentInfo();
    }
  }, [paymentData, windowReady]);

  return (
    <div className={styles.container}>
      <PaymentWidget
        {...userData}
        updateWalletData={updateWalletData}
        tempWallet={tempWallet}
        timer={activePaymentData?.timer}
        updateData={updateData}
        userData={userData}
        isActive={activePaymentData?.isActive}
        setUserData={setUserData}
        paymentError={error}
        setPaymentError={setError}
        isFetched={isFetched}
        merchant={merchant}
        setMerchant={setMerchant}
      />
    </div>
  );
};

export default PaymentUser;
