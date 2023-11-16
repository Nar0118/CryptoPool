import { PercentType } from '../dashboardOverview/type';

export interface OverviewCardProps {
  imgSrc: string;
  title: string;
  total: string;
  percent: string;
  type: PercentType;
  chart?: string;
}
