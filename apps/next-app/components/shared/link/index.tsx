import NextLink from 'next/link';
import LinkProps from './types';
import { isMobile } from 'react-device-detect';

import styles from './link.module.scss';

export default function Link({ text, children, color, ...rest }: LinkProps) {
  return (
    <div
      className={isMobile ? styles.disable : styles.linkBox}
      style={{ color }}
    >
      <NextLink {...rest}>{text ?? children}</NextLink>
    </div>
  );
}
