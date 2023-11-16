import { useState } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Icon from 'components/shared/icon';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { InfoCardProps, ProfileInfoData } from './types';

import styles from './infoCard.module.scss';

export default function InfoCard({ iconSrc, title, data }: InfoCardProps) {
  const [showCardNumber, setShowCardNumber] = useState<boolean>(false);

  const handleShowCardNumber = (): void => {
    setShowCardNumber(!showCardNumber);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardTitleSection}>
        <Icon width={28} height={28} src={iconSrc} />
        <span>{title}</span>
      </div>
      {data.map(
        (d: ProfileInfoData): JSX.Element => (
          <div className={styles.cardLine}>
            <span>{d.dataTitle}</span>
            <div className={styles.inputSection}>
              {!d.isHidden ? (
                <span>{d.dataInfo}</span>
              ) : (
                <span>
                  {showCardNumber
                    ? d.dataInfo
                    : d.dataInfo?.replace(/[\s\S]/g, '*')}
                </span>
              )}
              {d.isStrong || d.isHidden ? (
                <>
                  {d.isStrong ? (
                    <span className={styles.passwordSection}>Strong</span>
                  ) : showCardNumber ? (
                    <EyeTwoTone onClick={handleShowCardNumber} />
                  ) : (
                    <EyeInvisibleOutlined onClick={handleShowCardNumber} />
                  )}
                </>
              ) : (
                <Icon
                  width={19}
                  height={19}
                  src={
                    d.dataInfo ? imagesSvg.successIcon : imagesSvg.rejectIcon
                  }
                />
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
