import { useState } from 'react';
import { Button as AntdButton, Spin } from 'antd';
import Icon from 'components/shared/icon';
import Image from 'components/shared/image';
import { returnsPromise } from 'utils/index';
import ButtonProps, { ButtonType } from 'components/shared/button/type';

import styles from './button.module.scss';

export default function Button({
  children,
  onClick,
  className,
  text,
  btnType,
  isIcon = false,
  img,
  widgetSrc,
  width = 21,
  height = 21,
  ...rest
}: ButtonProps) {
  const [spinLoading, setSpinLoading] = useState<boolean>(false);

  const handleButton = async () => {
    if (!onClick) {
      return;
    }

    try {
      setSpinLoading(true);
      if (returnsPromise(!!onClick)) {
        await onClick();
      } else {
        onClick();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSpinLoading(false);
    }
  };

  const getStyle = (buttonType: ButtonType) => {
    switch (buttonType) {
      case ButtonType.black:
        return styles.black;
      case ButtonType.white:
        return styles.white;
      case ButtonType.blackBorder:
        return styles.blackBorder;
      case ButtonType.whiteBorder:
        return styles.whiteBorder;
      case ButtonType.blue:
        return styles.blue;
      default:
        return;
    }
  };

  return !widgetSrc ? (
    <AntdButton
      className={`${styles.btn} ${styles.light} ${className} ${getStyle(
        btnType
      )}`}
      {...rest}
      onClick={handleButton}
    >
      {text}
      {img && <Icon width={width} height={height} src={img} />}
      {spinLoading ? <Spin /> : children}
    </AntdButton>
  ) : isIcon ? (
    <Icon
      width={width}
      height={height}
      src={widgetSrc}
      onClick={handleButton}
    />
  ) : (
    <Image
      width={width}
      height={height}
      src={widgetSrc}
      onClick={handleButton}
    />
  );
}
