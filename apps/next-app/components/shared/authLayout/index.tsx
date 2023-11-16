import { useEffect } from 'react';

import styles from './authLayout.module.scss';

export default function AuthLayout({ children }): JSX.Element {
  useEffect(() => {
    document.getElementById('__next').style.height = '100%';
  }, []);

  return (
    <div className={styles.background}>
      <div className={styles.children}>{children}</div>
    </div>
  );
}
