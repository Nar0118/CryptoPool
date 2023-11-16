import { useRouter } from 'next/router';
import Button from 'components/shared/button';
import { ButtonType } from 'components/shared/button/type';
import { RedirectButtonItem, redirectButtons } from 'utils/constants/buttons';

import styles from './dashboard.module.scss';

export default function Dashboard(): JSX.Element {
  const router = useRouter();

  const redirectTo = (link: string): void => {
    router.push(link);
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <div className={styles.whiteSection}>
          <h1>Admin Dashboard</h1>
          {redirectButtons.map((item: RedirectButtonItem, index: number) => (
            <div className={styles.itemSection} key={index}>
              <div className={styles.buttons}>
                <Button
                  text={item.text}
                  btnType={ButtonType.white}
                  onClick={() => redirectTo(item.link)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
