import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import styles from './loader.module.scss';

export default function Loader(): JSX.Element {
  const antIcon = <LoadingOutlined className={styles.spinner} spin />;

  return (
    <div className={styles.loader}>
      <Spin indicator={antIcon} />
    </div>
  );
}
