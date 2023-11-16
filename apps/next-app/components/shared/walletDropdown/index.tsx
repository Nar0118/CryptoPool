import Icon from 'components/shared/icon';
import { WalletMenuItemType } from './type';
import { WalletDropdownProps } from './types';

import styles from './walletDropdown.module.scss';

export default function WalletDropdown({
  walletMenu,
}: WalletDropdownProps): JSX.Element {
  return (
    <div className={styles.dropdown}>
      {walletMenu?.map((item: WalletMenuItemType, index: number) => (
        <div className={styles.dropdownItem} key={index}>
          <Icon src={item.icon} width={15} height={15} />
          <span>{item.title}</span>
          <Icon src={item.walletIcon} width={15} height={15} />
        </div>
      ))}
    </div>
  );
}
