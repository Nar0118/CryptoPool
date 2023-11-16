import Clock from 'components/shared/clock';
import { PageHeaderProps } from './type';

import styles from './pageTitle.module.scss';

export default function PageTitle({
  title,
  isClock = true,
  children,
}: PageHeaderProps): JSX.Element {
  return (
    <div className={styles.container}>
      <p className={styles.title}>{title ?? 'Good Evening'}</p>
      {children}
      {isClock && <Clock />}
    </div>
  );
}
