import { ProfileInfoProps } from './types';

import styles from './profileInfo.module.scss';

export default function ProfileInfo({
  fullName,
  email,
}: ProfileInfoProps): JSX.Element {
  return (
    <div className={styles.container}>
      <p className={styles.userLogo}>{fullName?.trimStart()[0]}</p>
      <div>
        <h1 className={styles.userName}>{fullName?.trimStart()}</h1>
        <p>{email}</p>
      </div>
    </div>
  );
}
