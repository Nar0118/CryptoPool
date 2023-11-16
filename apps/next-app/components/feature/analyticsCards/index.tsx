import OverviewCard from 'components/shared/overviewCard';
import { OverviewCardProps } from 'components/shared/overviewCard/type';
import { dashboardOverview } from 'utils/constants/fakeData';

import styles from './analyticsCardsSection.module.scss';

export default function AnalyticsCards(): JSX.Element {
  return (
    <div className={styles.container}>
      {dashboardOverview.map((card: OverviewCardProps) => (
        <OverviewCard
          key={card.percent}
          title={card.title}
          total={card.total}
          percent={card.percent}
          type={card.type}
          imgSrc={card.imgSrc}
          chart={card.chart}
        />
      ))}
    </div>
  );
}
