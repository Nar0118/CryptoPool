import { LinkProps } from 'next/link';
import { ReactNode } from 'react';

export default interface CustomLinkProps extends LinkProps {
  text?: string;
  color?: string;
  children?: ReactNode;
}
