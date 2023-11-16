import { Context, useEffect, useState } from 'react';
import { Contextualizer } from 'utils/services/contextualizer';
import { ProvidedServices } from 'utils/services/providedServices';

export interface ITimerService {
  minutes: number;
  seconds: number;
  checkTime: boolean;
  setMinutes: (minutes: number) => void;
  setSeconds: (seconds: number) => void;
}

export const TimerServiceContext: Context<
  ITimerService | undefined
> = Contextualizer.createContext(ProvidedServices.TimerService);

export const useTimerServices = () =>
  Contextualizer.use<ITimerService>(ProvidedServices.TimerService);

export const TimerService = ({ children }: any) => {
  const [minutes, setMinutes] = useState<number>();
  const [seconds, setSeconds] = useState<number>(0);
  const [checkTime, setCheckTime] = useState<boolean>(false);

  const timerContextValue: ITimerService = {
    minutes,
    seconds,
    checkTime,
    setMinutes,
    setSeconds,
  };

  useEffect(() => {
    if (minutes !== undefined && minutes >= 0) {
      let intervalId = setInterval(() => {
        if (checkTime) {
          clearInterval(intervalId);
          return;
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(intervalId);
            setCheckTime(true);
            return;
          }
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [minutes, seconds]);

  return (
    <TimerServiceContext.Provider value={timerContextValue}>
      {children}
    </TimerServiceContext.Provider>
  );
};
