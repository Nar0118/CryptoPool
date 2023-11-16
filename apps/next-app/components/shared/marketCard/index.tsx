import Icon from 'components/shared/icon';

import { MarketCardProps } from './type';
import { Status } from 'components/shared/cryptoMarket/type';

import styles from './marketCards.module.scss';

export default function MarketCard({
  status,
  imageSrc,
  title,
  value,
}: MarketCardProps): JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.headerBox}>
        <Icon width={27} height={27} src={imageSrc} />
        <p>
          <span
            style={{
              background: `${
                status === Status.LIVE
                  ? 'var( --green_300)'
                  : 'var(  --red_900)'
              }`,
            }}
            className={styles.status}
          />
          {status}
        </p>
      </div>
      <h1>{title}</h1>
      <p className={styles.value}>{value}</p>
    </div>
  );
}
