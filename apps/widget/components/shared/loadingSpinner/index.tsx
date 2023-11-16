import { SpinnerProps } from './types';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export default function Spinner({ fontSize = 30 }: SpinnerProps): JSX.Element {
  const loadingIcon = <LoadingOutlined style={{ fontSize }} />;
  return <Spin indicator={loadingIcon}></Spin>;
}
