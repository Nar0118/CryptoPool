const getUTCTime = () => {
  const now = new Date();
  const hour = String(now.getUTCHours()).padStart(2, '0');
  const minute = String(now.getUTCMinutes()).padStart(2, '0');
  const second = String(now.getUTCSeconds()).padStart(2, '0');

  return `${hour}-${minute}-${second}`;
};
const timeDifferenceSecond = (currentTime, time) => {
  const currentTimeParts = currentTime?.split('-').map(Number);
  const givenTimeParts = time?.split('-').map(Number);

  const currentSeconds =
    currentTimeParts[0] * 3600 + currentTimeParts[1] * 60 + currentTimeParts[2];
  const givenSeconds =
    givenTimeParts[0] * 3600 + givenTimeParts[1] * 60 + givenTimeParts[2];

  return currentSeconds - givenSeconds;
};

export const getTimeZoneDifference = (time: string) => {
  const currentTime = getUTCTime();

  const timeDifferenceSeconds = timeDifferenceSecond(currentTime, time);

  const diffHours = Math.floor(timeDifferenceSeconds / 3600);
  const diffMinutes = Math.floor((timeDifferenceSeconds % 3600) / 60);
  const diffSeconds = timeDifferenceSeconds % 60;

  return { hour: diffHours, minute: diffMinutes, second: diffSeconds };
};

export const checkTime = (activeTempWallet): boolean => {
  const currentDate = new Date();

  const [savedHours, savedMinutes, savedSeconds] = activeTempWallet.timer
    .split('-')
    .map(Number);
  const savedDate = new Date();
  savedDate.setUTCHours(savedHours, savedMinutes, savedSeconds, 0);
  const timeDifference = currentDate.getTime() - savedDate.getTime();
  const fifteenMinutes = 15 * 60 * 1000;

  return timeDifference >= fifteenMinutes;
};
