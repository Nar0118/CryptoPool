import { ReactNode } from 'react';
import { DropDownProps as AntdDropDownProps } from 'antd/lib/dropdown';

export interface DropdownProps extends AntdDropDownProps {
  children: ReactNode;
}
