import { Context, useEffect, useRef, useState } from 'react';
import { Contextualizer } from 'utils/services/contextualizer';
import { ProvidedServices } from 'utils/services/providedServices';

export interface ITimerService {
  minutes: number;
  seconds: number;
  checkTime: boolean;
  setMinutes: (minutes: number) => void;
  setSeconds: (seconds: number) => void;
  setCheckTime: (checkTime: boolean) => void;
  setIsCleared: (isCleared: boolean) => void;
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
  const [isCleared, setIsCleared] = useState<boolean>(false);
  const elapsedMinutesRef = useRef<number>(0);
  const elapsedSecondsRef = useRef<number>(0);

  const timerContextValue: ITimerService = {
    minutes,
    seconds,
    checkTime,
    setMinutes,
    setSeconds,
    setCheckTime,
    setIsCleared,
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const tick = () => {
      if (isCleared) {
        return;
      }

      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        setCheckTime(true);
        clearInterval(intervalId);
        return;
      }
    };

    const startTimer = () => {
      intervalId = setInterval(tick, 1000);
    };

    const handleVisibilityChange = () => {
      let elapsedTimerId: NodeJS.Timeout;
      if (document.hidden) {
        elapsedTimerId = setInterval(() => {
          if (!document.hidden) {
            clearInterval(elapsedTimerId);
          }
          elapsedSecondsRef.current += 1;

          if (elapsedSecondsRef.current === 60) {
            elapsedMinutesRef.current += 1;
            elapsedSecondsRef.current = 0;
          }
        }, 2000);
      } else {
        setMinutes((prevMinutes) => {
          if (elapsedMinutesRef.current < prevMinutes) {
            return prevMinutes - elapsedMinutesRef.current;
          } else {
            return elapsedMinutesRef.current - prevMinutes;
          }
        });
        setSeconds((prevSeconds) => {
          if (elapsedSecondsRef.current < prevSeconds) {
            return prevSeconds - elapsedSecondsRef.current;
          } else {
            return elapsedSecondsRef.current - prevSeconds;
          }
        });
        elapsedMinutesRef.current = 0;
        elapsedSecondsRef.current = 0;
        clearInterval(elapsedTimerId);
      }
    };

    if (minutes !== undefined && minutes >= 0 && !isCleared) {
      startTimer();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [minutes, seconds, isCleared]);

  return (
    <TimerServiceContext.Provider value={timerContextValue}>
      {children}
    </TimerServiceContext.Provider>
  );
};
