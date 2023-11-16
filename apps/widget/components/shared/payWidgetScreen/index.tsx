import { useContext, useEffect, useMemo, useState } from 'react';
import Button from 'components/shared/button';
import Icon from 'components/shared/icon';
import Notification from 'components/shared/notification';
import { ConversionItem } from 'components/shared/balanceCard/type';
import { Currency } from 'components/feature/widgetPaymentModal/types';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { useModalContext } from 'utils/context/modal/context';
import { PaymentServiceContext } from 'utils/services/service/paymentService';
import env from 'utils/constants/env';
import {
  CurrencyNetworks,
  PayWidgetScreenProps,
  PaymentMethod,
  PbPayCoins,
} from './types';

import styles from './payWidgetScreen.module.scss';

const initialCoins = [
  {
    name: PaymentMethod.USDT,
    convertedValue: null,
    token: PbPayCoins.USDT,
    network: CurrencyNetworks.ERC_20,
  },
  {
    name: PaymentMethod.USDC,
    convertedValue: null,
    token: PbPayCoins.USDC,
    network: CurrencyNetworks.ERC_20,
  },
  {
    name: PaymentMethod.XRP,
    convertedValue: null,
    token: PbPayCoins.XRP,
    network: CurrencyNetworks.ERC_20,
  },
];

export default function PayWidgetScreen({
  payAmount,
  convertedAmount,
  setCurrency,
  currency,
  paymentKey,
  goBack,
}: PayWidgetScreenProps): JSX.Element {
  const paymentService = useContext(PaymentServiceContext);
  const { setModal } = useModalContext();

  const [conversion, setConversion] = useState<ConversionItem>(
    ConversionItem.DOLLAR
  );
  const [productsPrice, setProductsPrice] = useState();
  const [coinsPrices, setCoinPrices] = useState<Array<Currency>>(initialCoins);
  const [bitcoinValue, setBitcoinValue] = useState<number>();
  const [paymentCurrency, setPaymentCurrency] = useState<string>();

  const iconUrl = useMemo(() => {
    return conversion === ConversionItem.BITCOIN
      ? imagesSvg.bitcoin
      : imagesSvg.dollarIcon;
  }, [conversion]);

  const getWalletData = async (): Promise<void> => {
    let availableBalance;
    const percent = (payAmount * 0.5) / 100;

    const price = await paymentService.convertUsdToCoinWidget(paymentKey);

    if (price?.success) {
      availableBalance = Number(
        conversion === ConversionItem.BITCOIN
          ? price?.data?.BTC > 0.0009
            ? price?.data?.BTC?.toFixed(4)
            : price?.data?.BTC
          : payAmount
      );

      setBitcoinValue(price?.data?.bitcoin);
      changeCurrencyPrice(PbPayCoins.XRP, Number(price?.data?.XRP?.toFixed(4)));
      changeCurrencyPrice(
        PbPayCoins.USDT,
        Number(price?.data?.USDT_ERC20?.toFixed(4))
      );
      changeCurrencyPrice(
        PbPayCoins.USDC,
        Number(price?.data?.USDC?.toFixed(4))
      );
      setCurrency({
        ...currency,
        convertedValue: convertedAmount,
      });
      setProductsPrice(availableBalance);
    } else {
      Notification(price?.error);
    }
  };

  const changeCurrencyPrice = (
    key: PbPayCoins | string,
    value: number
  ): void => {
    let tmp = coinsPrices;
    let changed = false;
    tmp.map((el: Currency) => {
      if (el.token === key) {
        el.convertedValue = value;
        changed = true;
      }
    });
    if (tmp.length === coinsPrices.length && !changed) {
      tmp.push({ ...currency, convertedValue: value });
    }
    setCoinPrices(tmp);
  };

  const changePayment = (
    name: PaymentMethod | string,
    convertedValue: number,
    token: PbPayCoins
  ): void => {
    setPaymentCurrency(name);
    setCurrency({ token, name, convertedValue });
  };

  useEffect(() => {
    if (paymentKey) {
      getWalletData();
    }
  }, [conversion, paymentKey]);

  const changeConversion = (type: ConversionItem): void => {
    setConversion(type);
  };

  const handleChangeModal = (): void => {
    setModal({ hide: false, index: 2 });
  };

  const getIcon = (name: PbPayCoins | string): string => {
    switch (name) {
      case PbPayCoins.XRP:
        return imagesSvg.xrpIcon;
      case PbPayCoins.USDT:
        return imagesSvg.usdtIcon;
      case PbPayCoins.USDC:
        return imagesSvg.usdcIcon;
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.headerText}>Payment Gateway</p>
      <div className={styles.goBack}>
        <Icon src={imagesSvg.goBack} width={30} height={20} onClick={goBack} />
      </div>
      <div className={styles.balanceSection}>
        <div className={styles.balanceContainer}>
          <span className={styles.amountHeader}>Amount to pay</span>
          <div className={styles.amount}>
            <Icon
              width={20}
              height={34}
              src={iconUrl}
              className={
                conversion === ConversionItem.DOLLAR && styles.dollarIcon
              }
            />
            <span className={styles.amountNumber}>{productsPrice}</span>
          </div>
        </div>
        <div className={styles.conversion}>
          <p>Conversion</p>
          <div>
            <button
              className={`${styles.conversionType} ${
                ConversionItem.BITCOIN === conversion && styles.activeConversion
              }`}
              onClick={() => changeConversion(ConversionItem.BITCOIN)}
            >
              <Icon width={25} height={25} src={imagesSvg.bitcoinCash} />
            </button>
            <button
              className={`${styles.conversionType} ${
                ConversionItem.DOLLAR === conversion && styles.activeConversion
              }`}
              onClick={() => changeConversion(ConversionItem.DOLLAR)}
            >
              <Icon width={11} height={20} src={imagesSvg.dollarIcon} />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.bitcoinValue}>
        <Icon width={40} height={40} src={imagesSvg.bitcoin} />
        <div className={styles.priceSection}>
          <div className={styles.state}>
            <span className={styles.dot} />
            <span>Live</span>
          </div>
          <div className={styles.bitcoin}>
            1 Bitcoin Value : <span>${bitcoinValue}</span>
          </div>
        </div>
      </div>
      <div className={styles.selectPayment}>
        <div className={styles.selectPaymentTitle}>Select Payment Currency</div>
        <div className={styles.allCurrencies}>
          {coinsPrices.map((coin: Currency, i) => {
            return (
              <div
                key={i}
                className={`${styles.currencyItem} ${
                  paymentCurrency === coin.name && styles.currencyItemActive
                }`}
                onClick={() =>
                  changePayment(coin.name, coin.convertedValue, coin.token)
                }
              >
                <div className={styles.currency}>
                  <Icon width={30} height={30} src={getIcon(coin.token)} />
                  <div className={styles.currencySection}>
                    <div className={styles.coin}>{coin.name}</div>
                    <div className={styles.price}>{coin.convertedValue}</div>
                  </div>
                </div>
                <p className={styles.network}>
                  Network : Ethereum ( {coin.network} )
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className={`${styles.moreCurrencies} ${styles.hide}`}>
        <span>More Currencies</span>
        <span>
          <Icon src={imagesSvg.arrow} width={15} height={15} />
        </span>
      </div>
      <div className={styles.buttonWrapper}>
        <Button
          text={`Pay${paymentCurrency ? ' with ' + paymentCurrency : ''}`}
          className={styles.payButton}
          onClick={handleChangeModal}
          disabled={!paymentCurrency}
        />
      </div>
      <div className={styles.creatorInfo}>
        <span>Powered by CryptoPool</span>
        <a href={`mailto:${env.supportEmailAddress}`}>Help & Support</a>
      </div>
    </div>
  );
}
