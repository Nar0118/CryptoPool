import { ReactNode } from 'react';

export interface ContentLayoutProps {
  children: ReactNode;
  title: string;
  headerChildren?: ReactNode;
  isClock?: boolean;
}
