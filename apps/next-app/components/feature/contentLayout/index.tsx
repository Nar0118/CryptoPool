import PageTitle from 'components/shared/pageTitle';
import { ContentLayoutProps } from './types';

import styles from './contentLayout.module.scss';

export default function ContentLayout({
  children,
  title,
  headerChildren,
  isClock,
}: ContentLayoutProps): JSX.Element {
  return (
    <div className={styles.container}>
      <PageTitle title={title} children={headerChildren} isClock={isClock} />
      <div className={styles.context}>{children}</div>
    </div>
  );
}
