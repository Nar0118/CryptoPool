import { useRouter } from 'next/router';
import Button from 'components/shared/button';
import Image from 'components/shared/image';
import WhiteBox from 'components/shared/whiteBox';
import Icon from 'components/shared/icon';
import {
  overviewChartDates,
  OverviewChartDate,
} from 'utils/constants/fakeData';
import { imagesSvg } from 'utils/constants/imagesSrc';

import styles from './overviewChart.module.scss';

export default function OverviewChart(): JSX.Element {
  const router = useRouter();

  const currentRoute: string = String(router.query.type);
  const chartTitle =
    currentRoute !== 'undefined'
      ? router.query.type.toString().charAt(0).toUpperCase() +
        router.query.type.toString().slice(1)
      : 'Income';

  const icon: JSX.Element = (
    <Icon src={imagesSvg.pdfIcon} width={20} height={20} />
  );

  return (
    <WhiteBox style={styles.whiteBox}>
      <div className={styles.container}>
        <div className={styles.chartHeader}>
          <span className={styles.title}>{chartTitle} Overview</span>
          <div className={styles.buttonsWrapper}>
            {overviewChartDates.map(
              (item: OverviewChartDate, index: number) => (
                <Button
                  key={index}
                  text={item.date}
                  className={styles.button}
                />
              )
            )}
            <Button
              children={icon}
              text="Export PDF"
              className={styles.pdfButton}
            />
          </div>
        </div>
        <div className={styles.imageContainer}>
          <Image src={imagesSvg.chart} width={1400} height={100} />
        </div>
      </div>
    </WhiteBox>
  );
}
