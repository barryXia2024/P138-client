/**
 * 格式化金额显示
 * @param amount 金额
 * @returns 格式化后的金额
 */
export const formatAmount = (amount: string | undefined): string => {
  return `¥${Number(amount || 0).toFixed(2)}`;
};

/**
 * 格式化数字
 * @param number 数字
 * @returns 格式化后的数字
 */
export const formatNumber = (number: number | undefined): number => {
  return Number(number || 0);
};
/**
 * 格式化空字符串
 * @param value 需要格式化的字符串
 * @param includeEmptyString 需要包含的空字符串，默认包含空字符串
 * @returns 格式化后的字符串
 */
export const formatNaNString = (
  value: string | undefined | null,
  includeEmptyString: string[] = [''],
): string => {
  if (value === 'NaN') {
    return '';
  }
  if (value === 'null') {
    return '';
  }
  if (value === 'undefined') {
    return '';
  }
  if (value === 'null') {
    return '';
  }
  if (value === null) {
    return '';
  }
  if (value === undefined) {
    return '';
  }
  if (includeEmptyString.includes(value)) {
    return '';
  }

  return value;
};
