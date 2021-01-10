const OneSecond = 1000;
const OneMinute = OneSecond * 60;
const OneHour = OneMinute * 60;
const OneDay = OneHour * 24;

export function getHumanReadableTimeLength(timeInMs: number): string {
  if (timeInMs < OneSecond) {
    return `${timeInMs} millisecond${timeInMs === 1 ? '' : 's'}`;
  } else if (timeInMs < OneMinute) {
    const seconds = Math.floor(timeInMs / OneSecond);
    return `${seconds} second${seconds === 1 ? '' : 's'}`;
  } else if (timeInMs < OneHour) {
    const minutes = Math.floor(timeInMs / OneMinute);
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  } else if (timeInMs < OneDay) {
    const hours = Math.floor(timeInMs / OneHour);
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  } else {
    const days = Math.floor(timeInMs / OneDay);
    return `${days} day${days === 1 ? '' : 's'}`;
  }
}
