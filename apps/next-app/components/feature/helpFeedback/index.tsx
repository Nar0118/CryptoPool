import { useRouter } from 'next/router';
import Icon from 'components/shared/icon';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { helpProfile, HelpProfile } from './types';

import styles from './help.module.scss';

export default function HelpFeedback(): JSX.Element {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <Icon width={26} height={26} src={imagesSvg.questionIcon} />
        <span>Help & feedback</span>
      </div>
      <div className={styles.helpContainer}>
        {helpProfile.map(
          (e: HelpProfile, index: number): JSX.Element => (
            <div key={index} className={styles.helpSection}>
              <span onClick={() => router.push(e.href)}>{e.helpCenter}</span>
              <div>
                <p>{e.firstText}</p>
                <p>{e.secondText}</p>
                <p>{e.thirdText}</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
