import { useRouter } from 'next/router';
import Icon from 'components/shared/icon';
import { imagesSvg } from 'utils/constants/imagesSrc';

import styles from './backButton.module.scss';

export default function BackToHomePage(): JSX.Element {
  const router = useRouter();

  const goToHome = (): void => {
    router.push('/');
  };

  return (
    <div onClick={goToHome} className={styles.button}>
      <Icon src={imagesSvg.back} alt="layout" width={15} height={12} />
      <span>Back</span>
    </div>
  );
}
