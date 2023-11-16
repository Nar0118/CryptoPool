import { TableProps } from 'antd';
import { CoinType, OrderData, OrderStatus } from 'types/orders';

export default interface DashboardTableProps extends TableProps<OrderData> {
  tableTitle?: string;
  countOfPage?: number;
  setCurrentPage?: (e: number) => void;
  rowKey?: string;
  limit?: number;
  setLimit?: (e: number) => void;
}

export interface ModalContent {
  title: string;
  message: string;
  cardType: string;
}
