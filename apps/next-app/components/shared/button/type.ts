import { ButtonProps as AntdButtonProps } from 'antd/lib/button';

export default interface ButtonProps extends AntdButtonProps {
  onClick?: (() => Promise<void>) | (() => void) | undefined;
  text?: string;
  width?: number;
  height?: number;
  img?: string;
  widgetSrc?: string;
  transparent?: boolean;
  btnType?: ButtonType;
}

export enum ButtonType {
  blue = 'blue',
  black = 'black',
  white = 'white',
  blackBorder = 'blackBorder',
  whiteBorder = 'whiteBorder',
}
