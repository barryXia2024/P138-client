import dayjs from 'dayjs';

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export const formattedWeek = (day: string) => {
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const formattedDate = dayjs(day);
  const weekDay = weekDays[formattedDate.day()]; // 获取星期几的数字，0-6
  return `星期${weekDay}`;
};
export const formattedWeekV2 = (day: string) => {
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const formattedDate = dayjs(day);
  const weekDay = weekDays[formattedDate.day()]; // 获取星期几的数字，0-6
  return `周${weekDay}`;
};

export const formattedDate = (
  day: string | Date,
  format: string = 'YYYY-MM-DD',
) => {
  return dayjs(day).format(format);
};

export const showToast = (message: string) => {
  globalThis.Toast.show(message);
};
export const getImageUrl = (url: string) => {
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

const formatPrice = (price?: number | string) => {
  if (typeof price === 'string') {
    return parseFloat(price ?? '0').toFixed(2);
  }
  return (price ?? 0).toFixed(2);
};

export {formatPrice};
