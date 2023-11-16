import Icon from 'components/shared/icon';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { SettingCardProps } from './type';

import styles from './settingCard.module.scss';

export default function SettingCard({
  title,
  imageSrc,
  width,
  height,
  href,
}: SettingCardProps): JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {imageSrc && <Icon width={width} height={height} src={imageSrc} />}
        <p className={styles.title}>{title}</p>
      </div>
      <Icon width={10} height={18} src={imagesSvg.arrow} />
    </div>
  );
}
