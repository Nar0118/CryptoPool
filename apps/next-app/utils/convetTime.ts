export const getTime = (time: string) => {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  const gettingTime = time.split('-');
  const h = parseInt(hour) - parseInt(gettingTime[0]);
  const m = parseInt(minute) - parseInt(gettingTime[1]);
  const s = parseInt(second) - parseInt(gettingTime[2]);

  // Calculate the total difference in seconds
  const totalSeconds = h * 3600 + m * 60 + s;

  // Calculate the difference in minutes and seconds
  const diffMinutes = Math.floor(totalSeconds / 60);
  const diffSeconds = totalSeconds % 60;

  return { minute: diffMinutes, second: diffSeconds };
};
