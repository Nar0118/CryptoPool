import { useState } from 'react';
import { Menu } from 'antd';
import Dropdown from 'components/shared/dropDown';
import Button from 'components/shared/button';
import Icon from 'components/shared/icon';
import { imagesSvg } from 'utils/constants/imagesSrc';
import { TimeFrameDate, timeFrameDates } from 'utils/constants/fakeData';

import styles from './analyticsHeader.module.scss';

export default function AnalyticsHeader(): JSX.Element {
  const [option, setOption] = useState<string>('All-time');

  const menu: JSX.Element = (
    <Menu selectable={true}>
      {timeFrameDates.map((item: TimeFrameDate) => (
        <Menu.Item
          key={item.date}
          className={styles.menuItem}
          onClick={() => setOption(item.date)}
        >
          {item.date}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className={styles.container}>
      <Dropdown className={styles.dropDown} overlay={menu}>
        <div className={styles.dropdownContent}>
          <div className={styles.textContent}>
            <span className={styles.timeFrame}>Timeframe:</span>
            <span className={styles.currentTime}>{option}</span>
          </div>
          <Icon src={imagesSvg.arrowDropDown} width={10} height={10} />
        </div>
      </Dropdown>
      <Button
        img={imagesSvg.download}
        className={styles.downloadButton}
        text="Download Report"
      />
    </div>
  );
}
