import { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import Icon from 'components/shared/icon';
import Button from 'components/shared/button';
import PaymentModal from 'components/feature/paymentModal';
import WithdrawModal from 'components/feature/withdrawModal';
import WhiteBox from 'components/shared/whiteBox';
import TransactionFeeModal from 'components/feature/transactionFeeModal';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { UserServiceContext } from 'utils/services/service/userService';
import { PbPayCoins } from 'utils/context/auth/constants';
import { ConversionItem, ConvertTo } from './type';

import styles from './balanceCard.module.scss';

export default function BalanceCard(): JSX.Element {
  const userService = useContext(UserServiceContext);

  const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false);
  const [openWithdrawModal, setOpenWithdrawModal] = useState<boolean>(false);
  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(
    false
  );
  const [conversion, setConversion] = useState<ConversionItem>(
    ConversionItem.DOLLAR
  );
  const [merchantBalance, setMerchantBalance] = useState<number>();
  const [refresh, setRefresh] = useState<boolean>(true);
  const [date, setDate] = useState<string>(moment().format('h:mm:ss a'));
  const [disabled, setDisabled] = useState<boolean>(false);

  const iconUrl =
    conversion === ConversionItem.BITCOIN
      ? imagesSvg.bitcoin
      : imagesSvg.dollarIcon;

  const changeConversion = (type: ConversionItem): void => {
    setConversion(type);
    setDisabled(true);
    setTimeout(() => setDisabled(false), 3000);
  };

  const getWalletData = async (): Promise<void> => {
    let availableBalance;
    const price = await userService.getWalletBalance(
      [PbPayCoins.BTC],
      ConvertTo.USD
    );

    if (price?.success) {
      availableBalance = Number(
        conversion === ConversionItem.BITCOIN
          ? price?.data?.BTC.toFixed(4)
          : price?.dollarBalance.toFixed(2)
      );
      setMerchantBalance(availableBalance);
    }

    setDate(moment().format('h:mm:ss a'));
  };

  const handleRefresh = (): void => {
    setRefresh(!refresh);
    setDisabled(true);
    setTimeout(() => setDisabled(false), 3000);
  };

  useEffect(() => {
    getWalletData();
  }, [conversion, refresh]);

  return (
    <>
      <PaymentModal open={openPaymentModal} setOpen={setOpenPaymentModal} />
      <WithdrawModal
        open={openWithdrawModal}
        setOpen={setOpenWithdrawModal}
        setOpenChild={setOpenTransactionModal}
        bunkNumber={374}
      />
      <TransactionFeeModal
        open={openTransactionModal}
        setOpen={setOpenTransactionModal}
        setOpenParent={setOpenWithdrawModal}
      />
      <WhiteBox style={styles.whiteBox}>
        <div className={styles.container}>
          <div className={styles.balanceSection}>
            <div className={styles.balance}>
              <div className={styles.balanceTitle}>Your Balance</div>
              <div className={styles.balanceCount}>
                <div className={styles.balanceContainer}>
                  <Icon
                    width={20}
                    height={34}
                    src={iconUrl}
                    className={
                      conversion === ConversionItem.DOLLAR && styles.dollarIcon
                    }
                  />
                  {merchantBalance}
                </div>
                <Icon width={12} height={18} src={imagesSvg.arrow} />
              </div>
              <div className={styles.lastUpdated}>
                <span className={styles.updateDate}>Last updated {date}</span>
                <button
                  className={styles.refresh}
                  onClick={handleRefresh}
                  disabled={disabled}
                >
                  Refresh
                </button>
              </div>
            </div>
            <div className={styles.conversion}>
              <p>Conversion</p>
              <div>
                <button
                  className={`${styles.conversionType} ${
                    ConversionItem.BITCOIN === conversion &&
                    styles.activeConversion
                  }`}
                  onClick={() => changeConversion(ConversionItem.BITCOIN)}
                  disabled={ConversionItem.BITCOIN !== conversion && disabled}
                >
                  <Icon width={25} height={25} src={imagesSvg.bitcoinCash} />
                </button>
                <button
                  className={`${styles.conversionType} ${
                    ConversionItem.DOLLAR === conversion &&
                    styles.activeConversion
                  }`}
                  onClick={() => changeConversion(ConversionItem.DOLLAR)}
                  disabled={ConversionItem.DOLLAR !== conversion && disabled}
                >
                  <Icon width={11} height={20} src={imagesSvg.dollarIcon} />
                </button>
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <Button
              className={styles.paymentButton}
              text="Receive Payment"
              img={imagesSvg.walletIcon}
              onClick={() => setOpenPaymentModal(true)}
            />
            <Button
              className={styles.balanceButton}
              text="Withdraw Balance"
              onClick={() => setOpenWithdrawModal(true)}
            />
          </div>
        </div>
      </WhiteBox>
    </>
  );
}
