import Icon from 'components/shared/icon';
import WhiteBox from 'components/shared/whiteBox';
import SettingCard from 'components/shared/settingsCard';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { PaymentCard, paymentsSettings, PaymentsSettingsProps } from './type';

import styles from './paymentSettings.module.scss';

export default function PaymentSettings({
  title,
  settingsArray = paymentsSettings,
}: PaymentsSettingsProps): JSX.Element {
  return (
    <WhiteBox>
      <div className={styles.container}>
        <div className={styles.header}>
          <Icon width={30} height={30} src={imagesSvg.creditCard} />
          <p className={styles.title}>{title ?? 'Payment Settings'}</p>
        </div>
        <div className={styles.cardContainer}>
          {settingsArray.map((card: PaymentCard, index: number) => (
            <SettingCard
              key={index}
              title={card.title}
              width={card.width}
              height={card.height}
              href={card.href}
              imageSrc={card.icon}
            />
          ))}
        </div>
      </div>
    </WhiteBox>
  );
}
