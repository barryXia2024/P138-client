/**
 * 福彩3D组合计算工具
 */

/**
 * 计算组合数 C(n,k)
 * @param n 总数
 * @param k 选择数
 * @returns 组合数
 */
export function combination(n: number, k: number): number {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = (result * (n - i + 1)) / i;
  }
  return Math.round(result);
}
