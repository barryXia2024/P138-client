/**
 * 福彩3D生成器
 */

/**
 * 生成指定数量的不重复随机数字（0-9范围）
 * @param count 需要生成的数量
 * @param exclude 排除的数字数组
 * @returns 排序后的数字数组
 */
export function pickDistinct(count: number, exclude: number[] = []): number[] {
  const s = new Set<number>();
  while (s.size < count) {
    const n = Math.floor(Math.random() * 10);
    if (!exclude.includes(n)) {
      s.add(n);
    }
  }
  return Array.from(s).sort((a, b) => a - b);
}

/**
 * 生成指定数量的不重复随机数字（指定范围）
 * @param count 需要生成的数量
 * @param range 数字范围（0到range-1）
 * @param exclude 排除的数字数组
 * @returns 排序后的数字数组
 */
export function pickDistinctInRange(count: number, range: number, exclude: number[] = []): number[] {
  const s = new Set<number>();
  while (s.size < count) {
    const n = Math.floor(Math.random() * range);
    if (!exclude.includes(n)) {
      s.add(n);
    }
  }
  return Array.from(s).sort((a, b) => a - b);
}

/**
 * 生成单个随机数字（0-9范围）
 * @returns 随机数字
 */
export function pickSingle(): number {
  return Math.floor(Math.random() * 10);
}

/**
 * 生成0-9的数字数组
 * @returns 数字数组
 */
export function generateDigitArray(): number[] {
  return Array.from({length: 10}, (_, n) => n);
}
