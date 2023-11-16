import { LayoutProps } from './types';

import styles from './layout.module.scss';

export default function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <div className={styles.generalModeBg}>
      <div className={styles.rightSection}>
        <div className={styles.context}>{children}</div>
      </div>
    </div>
  );
}
