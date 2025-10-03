/**
 * 日期时间处理工具函数
 * 
 * 提供常用的日期时间格式化、计算和处理功能
 */

/**
 * 格式化日期为指定格式
 * @param date 日期对象或时间戳
 * @param formatStr 格式字符串，默认"yyyy-MM-dd"
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | number | string, formatStr = 'yyyy-MM-dd'): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : 
            typeof date === 'number' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return '';
  
  const pad = (n: number) => n < 10 ? `0${n}` : `${n}`;
  
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  
  return formatStr
    .replace('yyyy', year.toString())
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 格式化为日期时间
 * @param date 日期对象或时间戳
 * @returns 格式化后的日期时间字符串，格式为"yyyy-MM-dd HH:mm:ss"
 */
export const formatDateTime = (date: Date | number | string): string => {
  return formatDate(date, 'yyyy-MM-dd HH:mm:ss');
};

/**
 * 格式化为时间
 * @param date 日期对象或时间戳
 * @returns 格式化后的时间字符串，格式为"HH:mm:ss"
 */
export const formatTime = (date: Date | number | string): string => {
  return formatDate(date, 'HH:mm:ss');
};

/**
 * 格式化为相对时间
 * @param date 日期对象或时间戳
 * @returns 相对当前时间的描述，如"刚刚"、"5分钟前"等
 */
export const formatRelativeTime = (date: Date | number | string): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : 
            typeof date === 'number' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return '刚刚';
  } else if (diffMin < 60) {
    return `${diffMin}分钟前`;
  } else if (diffHour < 24) {
    return `${diffHour}小时前`;
  } else if (diffDay < 7) {
    return `${diffDay}天前`;
  } else if (diffDay < 30) {
    return `${Math.floor(diffDay / 7)}周前`;
  } else if (diffDay < 365) {
    return `${Math.floor(diffDay / 30)}个月前`;
  } else {
    return `${Math.floor(diffDay / 365)}年前`;
  }
};

/**
 * 计算两个日期相差的天数
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @returns 相差的天数
 */
export const diffDays = (date1: Date | number | string, date2: Date | number | string): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : 
             typeof date1 === 'number' ? new Date(date1) : date1;
             
  const d2 = typeof date2 === 'string' ? new Date(date2) : 
             typeof date2 === 'number' ? new Date(date2) : date2;
             
  // 转换为UTC时间，消除时区影响
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((utc2 - utc1) / MS_PER_DAY);
};

/**
 * 获取给定日期的开始时间
 * @param date 日期对象或时间戳
 * @returns 当天00:00:00的日期对象
 */
export const startOfDay = (date: Date | number | string): Date => {
  const d = typeof date === 'string' ? new Date(date) : 
            typeof date === 'number' ? new Date(date) : date;
  
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * 获取给定日期的结束时间
 * @param date 日期对象或时间戳
 * @returns 当天23:59:59的日期对象
 */
export const endOfDay = (date: Date | number | string): Date => {
  const d = typeof date === 'string' ? new Date(date) : 
            typeof date === 'number' ? new Date(date) : date;
  
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * 判断日期是否是今天
 * @param date 日期对象或时间戳
 * @returns 是否是今天
 */
export const isToday = (date: Date | number | string): boolean => {
  const today = new Date();
  const d = typeof date === 'string' ? new Date(date) : 
            typeof date === 'number' ? new Date(date) : date;
  
  return d.getDate() === today.getDate() && 
         d.getMonth() === today.getMonth() && 
         d.getFullYear() === today.getFullYear();
};

/**
 * 计算给定日期加上指定天数后的日期
 * @param date 日期对象或时间戳
 * @param days 要添加的天数
 * @returns 新的日期对象
 */
export const addDays = (date: Date | number | string, days: number): Date => {
  const d = typeof date === 'string' ? new Date(date) : 
            typeof date === 'number' ? new Date(date) : new Date(date.getTime());
  
  d.setDate(d.getDate() + days);
  return d;
}; 