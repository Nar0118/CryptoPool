import { useRouter } from 'next/router';
import Icon from 'components/shared/icon';
import Image from 'components/shared/image';
import { PercentType } from 'components/shared/dashboardOverview/type';
import { imagesSvg } from 'utils/constants/imagesSrc';
import navBarPaths from 'utils/constants/navBarPaths';
import { OverviewCardProps } from './type';

import styles from './overviewCard.module.scss';

export default function OverviewCard({
  imgSrc,
  title,
  total,
  percent,
  type,
  chart,
}: OverviewCardProps): JSX.Element {
  const router = useRouter();

  const path: string = title.toLowerCase().split(' ')[1];
  const currentChart: string | Array<string> = chart ? router.query.type : '';

  const handleRoute = (): void => {
    router.push(`${navBarPaths.analytics}?type=${path}`);
  };

  return (
    <div
      className={`${styles.container} ${chart && styles.analyticsContainer} ${
        path == currentChart && styles[currentChart]
      }`}
      onClick={handleRoute}
    >
      <div className={styles.bottomArrow}>
        <Icon src={imagesSvg.bottomArrow} width={20} height={20} />
      </div>
      <div className={styles.titleContainer}>
        <Icon width={38} height={38} src={imgSrc} />
        <p className={styles.title}>{title}</p>
      </div>
      <div className={styles.total}>
        <p className={styles.totalPrice}>{total}</p>
        <div className={styles.pricePercent}>
          <Icon
            width={12}
            height={12}
            src={
              type === PercentType.PROMOTION
                ? imagesSvg.upIcon
                : imagesSvg.downIcon
            }
          />
          <p
            className={
              type === PercentType.PROMOTION
                ? styles.promotionPercent
                : styles.downgradePercent
            }
          >
            {percent}%
          </p>
        </div>
        {chart && <Image src={chart} width={100} height={30} />}
      </div>
    </div>
  );
}
