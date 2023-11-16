import { ReactNode } from 'react';

export interface PageHeaderProps {
  title?: string;
  children?: ReactNode;
  isClock?: boolean;
}
