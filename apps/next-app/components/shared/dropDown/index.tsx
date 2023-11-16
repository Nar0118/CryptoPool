import { Dropdown as AntdDropdown } from 'antd/lib';
import { DropdownProps } from './types';

export default function Dropdown({
  overlay,
  placement = 'bottom',
  trigger = ['click'],
  children,
  ...rest
}: DropdownProps): JSX.Element {
  return (
    <AntdDropdown
      overlay={overlay}
      trigger={trigger}
      placement={placement}
      {...rest}
    >
      {children}
    </AntdDropdown>
  );
}
