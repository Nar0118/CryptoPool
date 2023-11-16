import { useContext, useEffect, useState } from 'react';
import Icon from 'components/shared/icon';
import MarketCard from 'components/shared/marketCard';
import Button from 'components/shared/button';
import WhiteBox from 'components/shared/whiteBox';
import { ConvertTo } from 'components/shared/balanceCard/type';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { UserServiceContext } from 'utils/services/service/userService';
import { PbPayCoins } from 'utils/context/auth/constants';
import { CoinsData, Conversion, CryptoMarketProps, Status } from './type';

import styles from './cryptoMarket.module.scss';

export default function CryptoMarket({
  vertical,
}: CryptoMarketProps): JSX.Element {
  const userService = useContext(UserServiceContext);
  const [conversion, setConversion] = useState<Conversion>(Conversion.DOLLAR);

  const [statistics, setStatistics] = useState<CoinsData>();
  const [disabled, setDisabled] = useState<boolean>(false);

  const iconUrl =
    conversion === Conversion.BITCOIN
      ? imagesSvg.bitcoin
      : imagesSvg.dollarIcon;

  const changeConversion = (type: Conversion): void => {
    setConversion(type);
    setDisabled(true);
    setTimeout(() => setDisabled(false), 3000);
  };

  const getWalletData = async (): Promise<void> => {
    const price = await userService.getWalletBalance(
      [PbPayCoins.BTC, PbPayCoins.ETH],
      ConvertTo.USD
    );

    if (price?.success) {
      setStatistics({
        bitcoin: price?.data?.bitcoin,
        ethereum: price?.data?.ethereum,
      });
    }
  };

  useEffect(() => {
    getWalletData();
  }, [conversion]);

  const addConversion = (): void => {};

  return (
    <WhiteBox style={!vertical ? styles.whiteBox : styles.verticalWhiteBox}>
      <div
        className={`${!vertical ? styles.container : styles.verticalContainer}`}
      >
        <span className={styles.topSection}>
          <h1 className={styles.title}>Crypto Market</h1>
          <div className={styles.conversion}>
            <p>Conversion</p>
            <div>
              <button
                className={`${styles.conversionType} ${
                  Conversion.BITCOIN === conversion && styles.activeConversion
                }`}
                onClick={() => changeConversion(Conversion.BITCOIN)}
                disabled={Conversion.BITCOIN !== conversion && disabled}
              >
                <Icon width={25} height={25} src={imagesSvg.bitcoinCash} />
              </button>
              <button
                className={`${styles.conversionType} ${
                  Conversion.DOLLAR === conversion && styles.activeConversion
                }`}
                onClick={() => changeConversion(Conversion.DOLLAR)}
                disabled={Conversion.DOLLAR !== conversion && disabled}
              >
                <Icon width={11} height={20} src={imagesSvg.dollarIcon} />
              </button>
            </div>
          </div>
        </span>
        <span className={styles.buttomSection}>
          <div className={styles.cards}>
            <MarketCard
              imageSrc={imagesSvg.bitcoin}
              status={Status.LIVE}
              title="1 Bitcoin Value:"
              value={`$ ${statistics?.bitcoin}`}
            />
            <MarketCard
              imageSrc={imagesSvg.ethereum}
              status={Status.UPCOMING}
              title="1 Ether Value:"
              value={`$ ${statistics?.ethereum}`}
            />
          </div>
          <div className={styles.footer}>
            <Button
              onClick={addConversion}
              className={styles.button}
              text="Add More +"
            />
          </div>
        </span>
      </div>
    </WhiteBox>
  );
}
