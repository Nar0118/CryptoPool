import { useEffect, useMemo, useContext, useState } from 'react';
import { TimerServiceContext } from 'utils/services/service/timerService';

enum Colors {
  Green = 'green',
  Yellow = '#d5d517',
  Red = 'red',
}

const Timer = ({ minute = 14, second = 59, timer }): JSX.Element => {
  const { minutes, seconds, setMinutes, setCheckTime, setSeconds } = useContext(
    TimerServiceContext
  );

  useEffect(() => {
    setMinutes(14 - minute);
    setSeconds(59 - second);
  }, [timer]);

  const colorStyle = useMemo(
    () => ({
      color:
        minutes >= 10
          ? Colors.Green
          : 5 <= minutes && minutes < 10
          ? Colors.Yellow
          : Colors.Red,
    }),
    [minutes]
  );
  useEffect(() => {
    if (minutes > 14) {
      setMinutes(14);
    }
  }, []);

  return (
    <span style={colorStyle}>
      {minutes > 14 ? 14 : minutes}:{('0' + seconds).slice(-2)}
    </span>
  );
};

export default Timer;
