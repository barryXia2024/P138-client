/**
 * 数值处理工具函数
 * 
 * 提供常用的数值格式化、转换和处理功能
 */

/**
 * 格式化为货币
 * @param value 数值或字符串
 * @param options 格式化选项
 * @returns 格式化后的货币字符串
 */
export const formatCurrency = (
  value: number | string | undefined | null,
  options?: {
    prefix?: string;
    decimal?: number;
    separator?: string;
  }
): string => {
  if (value === undefined || value === null) return '';

  const {
    prefix = '¥',
    decimal = 2,
    separator = ','
  } = options || {};

  const num = typeof value === 'string' ? parseFloat(value) : value as number;

  if (isNaN(num)) {
    // 返回带小数位的 0
    const zeros = decimal > 0 ? `.${'0'.repeat(decimal)}` : '';
    return `${prefix}0${zeros}`;
  }

  const sign = num < 0 ? '-' : '';
  const absVal = Math.abs(num);

  // 用较多小数位的 toFixed 来稳定浮点误差（然后用字符串截断）
  const safeStr = absVal.toFixed(decimal + 12); // 保留额外精度
  const [intPartRaw, fracPartRaw = ''] = safeStr.split('.');

  // 截断小数部分（不四舍五入）
  const truncatedFrac = (fracPartRaw.slice(0, decimal) + '0'.repeat(decimal)).slice(0, decimal);

  // 千分位格式化整数部分
  const formattedInt = intPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  const decimalSegment = decimal > 0 ? `.${truncatedFrac}` : '';

  return `${prefix}${sign}${formattedInt}${decimalSegment}`;
};



/**
 * 格式化为百分比
 * @param value 小数值（如0.12表示12%）
 * @param options 格式化选项
 * @returns 格式化后的百分比字符串
 */
export const formatPercent = (value: number, options?: {
  decimal?: number;
  suffix?: string;
}): string => {
  if (value === undefined || value === null) return '';
  
  const { decimal = 2, suffix = '%' } = options || {};
  return `${(value * 100).toFixed(decimal)}${suffix}`;
};

/**
 * 格式化数字
 * @param num 数值
 * @param options 格式化选项
 * @returns 格式化后的数字字符串
 */
export const formatNumber = (num: number, options?: {
  decimal?: number;
  separator?: string;
}): string => {
  if (num === undefined || num === null) return '';
  
  const { decimal = 0, separator = ',' } = options || {};
  
  if (isNaN(num)) return '0';
  
  const parts = num.toFixed(decimal).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  
  return parts.join('.');
};

/**
 * 缩写大数字
 * @param num 数值
 * @returns 缩写后的数字字符串，如1.2k、3.4w
 */
export const abbreviateNumber = (num: number): string => {
  if (num === undefined || num === null) return '';
  if (isNaN(num)) return '0';
  
  if (Math.abs(num) < 1000) return num.toString();
  
  const units = ['', 'k', 'w', 'm', 'b', 't'];
  const size = num >= 0 ? 1 : -1;
  const absNum = Math.abs(num);
  
  let unit = 0;
  let value = absNum;
  
  if (absNum >= 1000) {
    unit = 1; // 千
    value = absNum / 1000;
  }
  
  if (absNum >= 10000) {
    unit = 2; // 万
    value = absNum / 10000;
  }
  
  if (absNum >= 1000000) {
    unit = 3; // 百万
    value = absNum / 1000000;
  }
  
  if (absNum >= 1000000000) {
    unit = 4; // 十亿
    value = absNum / 1000000000;
  }
  
  if (absNum >= 1000000000000) {
    unit = 5; // 万亿
    value = absNum / 1000000000000;
  }
  
  // 保留一位小数
  return `${(size * value).toFixed(1)}${units[unit]}`;
};

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param options 格式化选项
 * @returns 格式化后的文件大小字符串，如1.2MB、3.4GB
 */
export const formatFileSize = (bytes: number, options?: {
  decimal?: number;
}): string => {
  if (bytes === undefined || bytes === null) return '';
  if (isNaN(bytes)) return '0 Bytes';
  if (bytes === 0) return '0 Bytes';
  
  const { decimal = 2 } = options || {};
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimal))} ${sizes[i]}`;
};

/**
 * 格式化手机号码
 * @param phone 手机号码
 * @param options 格式化选项
 * @returns 格式化后的手机号码，如188 **** 8888
 */
export const formatPhoneNumber = (phone: string, options?: {
  mask?: boolean;
  separator?: string;
}): string => {
  if (!phone) return '';
  
  const { mask = true, separator = ' ' } = options || {};
  
  // 移除非数字字符
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return phone; // 非标准手机号，原样返回
  
  if (mask) {
    // 脱敏处理：前3后4，中间用*替代
    return [
      cleaned.substring(0, 3),
      '****',
      cleaned.substring(7)
    ].join(separator);
  } else {
    // 不脱敏：按照3-4-4格式分隔
    return [
      cleaned.substring(0, 3),
      cleaned.substring(3, 7),
      cleaned.substring(7)
    ].join(separator);
  }
};

/**
 * 将字符串/数字转换为整数
 * @param value 要转换的值
 * @param defaultValue 转换失败时的默认值
 * @returns 转换后的整数或默认值
 */
export const toInteger = (value: unknown, defaultValue = 0): number => {
  if (value === undefined || value === null) return defaultValue;
  
  const num = parseInt(String(value), 10);
  return isNaN(num) ? defaultValue : num;
};

/**
 * 将字符串/数字转换为浮点数
 * @param value 要转换的值
 * @param defaultValue 转换失败时的默认值
 * @returns 转换后的浮点数或默认值
 */
export const toFloat = (value: unknown, defaultValue = 0): number => {
  if (value === undefined || value === null) return defaultValue;
  
  const num = parseFloat(String(value));
  return isNaN(num) ? defaultValue : num;
}; 


export const formatNumberWithZero = (num: number|string, options?: {
  decimal?: number;
  separator?: string;
}): string => {
  const numFormat = Number(num);
  if (numFormat === undefined || numFormat === null) return '';
  if (isNaN(numFormat)) return '0';
   if(numFormat<10){
    return `0${numFormat}`;
   }
   return numFormat.toString();
};