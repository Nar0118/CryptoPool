import { useState, useEffect } from 'react';

import styles from './HamburgerMenu.module.scss';

export default function HamburgerMenu({
  active,
}: {
  active: boolean;
}): JSX.Element {
  const [isActive, setIsActive] = useState<boolean>(active);

  useEffect(() => {
    setIsActive(!active);
  }, [active]);

  return (
    <div
      className={styles.hamburgerIcons}
      onClick={() => {
        setIsActive(!isActive);
      }}
    >
      <div
        className={!isActive ? styles.allHamburger : styles.allCloseHamburger}
      >
        <div className={styles.hamburgerTop} />
        <div className={styles.hamburgerCenter} />
        <div className={styles.hamburgerBottom} />
      </div>
    </div>
  );
}
