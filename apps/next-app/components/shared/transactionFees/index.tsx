import { useState } from 'react';
import Button from 'components/shared/button';
import WhiteBox from 'components/shared/whiteBox';
import { FeeButton, UnitsOfMeasurement } from 'types/transactions';
import { defaultData, IntermediateData, TransactionProps } from './type';

import styles from './transactionFees.module.scss';

export default function TransactionFee({
  buttons,
  data = defaultData,
}: TransactionProps): JSX.Element {
  const [active, setActive] = useState<UnitsOfMeasurement>(
    UnitsOfMeasurement.WEEKLY
  );

  return (
    <WhiteBox style={`${styles.whiteBox} ${!buttons && styles.modal}`}>
      <div className={styles.container}>
        <p className={styles.title}>Transaction Fees</p>
        {buttons && (
          <div className={styles.buttons}>
            {buttons.map((button: FeeButton, index: number) => (
              <Button
                key={index}
                text={button.text}
                onClick={() => setActive(button.type)}
                className={
                  active === button.type ? styles.activeButton : styles.button
                }
              />
            ))}
          </div>
        )}
        <ul className={styles.data}>
          {data[active].map((data: IntermediateData) => (
            <li key={data.key} className={styles.item}>
              <span>
                <p className={styles.text}>{data.key}</p>
                <p className={styles.value}>{data.value}</p>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </WhiteBox>
  );
}
