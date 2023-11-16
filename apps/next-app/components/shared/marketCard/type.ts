import { Status } from 'components/shared/cryptoMarket/type';

export interface MarketCardProps {
  title: string;
  status: Status;
  value: string;
  imageSrc: string;
}
