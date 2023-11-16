import { useRouter } from 'next/router';
import Icon from 'components/shared/icon';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { MerchantDetail, merchantDetails } from './types';

import styles from './profileDetails.module.scss';

export default function ProfileDetails(): JSX.Element {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <Icon width={28} height={28} src={imagesSvg.merchantIcon} />
        <span>Merchant Details</span>
      </div>
      <div>
        {merchantDetails.map(
          (e: MerchantDetail, index: number): JSX.Element => (
            <div
              onClick={() => router.push(e.href)}
              key={index}
              className={styles.merchantItem}
            >
              <span>{e.title}</span>
              <Icon width={7} height={13} src={e.icon} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
