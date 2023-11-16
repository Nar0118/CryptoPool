export const getUTCTime = () => {
  const now = new Date();
  const hour = String(now.getUTCHours()).padStart(2, '0');
  const minute = String(now.getUTCMinutes()).padStart(2, '0');
  const second = String(now.getUTCSeconds()).padStart(2, '0');

  return `${hour}-${minute}-${second}`;
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
