/**
 * 获取投注数量
 * @param positions
 * @returns
 */
export function getBetCount(positions: string[][]) {
  if (positions.length === 0) return 0;
  return positions.reduce((acc, pos) => acc * pos.length, 1);
}
/**
 * 获取投注金额
 * @param positions
 * @returns
 */
export function getBetAmount(positions: string[][]) {
  return getBetCount(positions) * 2;
}
/**
 * 七星彩数字遗漏列表
 */
export function sevenStarDigitalMissList(dissmissArray: string[]): string[][] {
  return [
    dissmissArray.slice(0, 10),
    dissmissArray.slice(10, 20),
    dissmissArray.slice(20, 30),
    dissmissArray.slice(30, 40),
    dissmissArray.slice(40, 50),
    dissmissArray.slice(50, 60),
    dissmissArray.slice(60, 75),
  ];
}
