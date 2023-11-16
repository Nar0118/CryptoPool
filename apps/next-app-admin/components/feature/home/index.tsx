import { useEffect, useState } from 'react';
import Dashboard from 'components/shared/dashboard';
import Loader from 'components/shared/loader';

import styles from './home.module.scss';

export default function HomePage(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);

  const checkLoading = (): void => {
    setLoading(!(typeof window !== 'undefined'));
  };

  useEffect(() => {
    checkLoading();
  }, []);

  return (
    <div className={styles.admin}>{loading ? <Loader /> : <Dashboard />}</div>
  );
}
