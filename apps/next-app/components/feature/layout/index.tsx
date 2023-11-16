import { useRouter } from 'next/router';
import Footer from 'components/feature/footer';
import Header from 'components/feature/header';
import SideBar from 'components/feature/sidebar';
import { currentPath } from 'utils/constants/steps';
import { LayoutProps } from './types';

import styles from './layout.module.scss';

export default function Layout({ children }: LayoutProps): JSX.Element {
  const router = useRouter();
  const isAuthPath: boolean = currentPath(router.pathname);

  return (
    <div className={styles.generalModeBg}>
      {isAuthPath && <SideBar />}
      <div className={styles.rightSection}>
        <Header isAuthPath={isAuthPath} />
        <div className={styles.context}>{children}</div>
        <Footer />
      </div>
    </div>
  );
}
