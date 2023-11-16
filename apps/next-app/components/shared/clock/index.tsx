import { useState, useEffect } from 'react';

import styles from './clock.module.scss';

export default function Clock(): JSX.Element {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const [date, setDate] = useState<Date>(new Date());

  const convertTZ = (date: Date, tzString: string): Date => {
    return new Date(
      (typeof date === 'string' ? new Date(date) : date).toLocaleString(
        'en-US',
        {
          timeZone: tzString,
        }
      )
    );
  };

  const refreshClock = (): void => {
    setDate(convertTZ(new Date(), 'Asia/Kolkata'));
  };

  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <span className={styles.container}>
      <span>
        {date.getDate()} {monthNames[date.getMonth()]} {date.getFullYear()}
        &nbsp; &nbsp;| &nbsp;
      </span>
      <span> {date.toLocaleTimeString()} IST</span>
    </span>
  );
}
