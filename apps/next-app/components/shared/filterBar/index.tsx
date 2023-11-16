import { Menu } from 'antd';
import Dropdown from 'components/shared/dropDown';
import Icon from 'components/shared/icon';
import SearchInput from 'components/shared/searchInput';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { ShareBarProps } from './type';

import styles from './filterBar.module.scss';

export default function FilterBar({
  isHeader = false,
}: ShareBarProps): JSX.Element {
  const menu: JSX.Element = (
    <Menu>
      <Menu.Item>Amount</Menu.Item>
      <Menu.Item>Date</Menu.Item>
      <Menu.Item>Status</Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.container}>
      <div className={styles.auxiliaryTools}>
        <Dropdown overlay={menu}>
          <span className={styles.filter}>
            <>
              <span>Filter</span>
              <Icon src={imagesSvg.filter} width={11} height={11} />
            </>
          </span>
        </Dropdown>
        <span className={styles.arrows}>
          <Icon src="arrows.svg" width={35} height={35} />
        </span>
      </div>
      <div className={`${styles.search} ${isHeader && styles.largeSearch}`}>
        <SearchInput searchIcon={imagesSvg.search} />
      </div>
    </div>
  );
}
