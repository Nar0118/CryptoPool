import WhiteBoxProps from './types';

import styles from './whiteBox.module.scss';

export default function WhiteBox({ style, children }: WhiteBoxProps): JSX.Element {
  return (
    <div className={`${styles.whiteBoxContainer} ${style}`}>{children}</div>
  );
}
