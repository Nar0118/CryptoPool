import { Input as AntdInput } from 'antd';
import InputProps from './types';

import styles from './input.module.scss';

export default function Input({ label, ...rest }: InputProps): JSX.Element {
  return (
    <div>
      {label && (
        <label htmlFor={rest.id} className={styles.label}>
          {label}
        </label>
      )}
      <AntdInput className={`${styles.input} ${rest.className}`} {...rest} />
    </div>
  );
}
