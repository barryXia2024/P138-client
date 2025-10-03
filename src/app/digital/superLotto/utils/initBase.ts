import {SuperLottoPlayEnum} from '../../types';
function combination(n: number, k: number): number {
  if (k < 0 || n < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let numerator = 1;
  let denominator = 1;
  for (let i = 1; i <= k; i++) {
    numerator *= n - i + 1;
    denominator *= i;
  }
  return Math.round(numerator / denominator);
}

/**
 * 获取投注数量
 * @param positions
 * @returns
 */
export function getBetCount(positions: string[][],playMode: SuperLottoPlayEnum) {
  if (positions.length === 0) return 0;
  // 大乐透有单式、复式、胆拖三种玩法
  const front = positions[0] ?? [];
  const back = positions[1] ?? [];
  const danBack = positions[2] ?? [];
  const tuoBack = positions[3] ?? [];

  // 普通(单式/复式)：仅使用前两组
  if (playMode===SuperLottoPlayEnum.NORMAL
  ) {
    return combination(front.length, 5) * combination(back.length, 2);
  } else {
    // 胆拖：C(前区拖码数, 5-前区胆码数) * C(后区拖码数, 2-后区胆码数)
    const frontDan = front.length; // 前区胆码数
    const frontTuo = back.length; // 前区拖码数（沿用索引约定）
    const backDan = danBack.length; // 后区胆码数
    const backTuo = tuoBack.length; // 后区拖码数

    if (frontDan > 0 && frontTuo > 0 && backTuo > 0) {
      // 计算组合数
      const frontComb = combination(frontTuo, 5 - frontDan);
      const backComb =
        backDan > 0 ? combination(backTuo, 2 - backDan) : backTuo;
      return frontComb * backComb;
    }
    return 0;
  }
}
/**
 * 获取投注金额
 * @param positions
 * @returns
 */
export function getBetAmount(positions: string[][],playMode: SuperLottoPlayEnum) {
  return getBetCount(positions,playMode) * 2;
}
/**
 * 大乐透数字遗漏列表
 */
export function superLottoDigitalMissList(
  dissmissArray: string[],
  playMode: SuperLottoPlayEnum,
): string[][] {
  if (playMode === SuperLottoPlayEnum.NORMAL) {
    // 前区35个号码 + 后区12个号码
    return [dissmissArray.slice(0, 35), dissmissArray.slice(35, 47)];
  } else {
    // 胆拖模式：前区胆码 + 前区拖码 + 后区胆码 + 后区拖码
    return [
      dissmissArray.slice(0, 35),  // 前区胆码
      dissmissArray.slice(0, 35),  // 前区拖码
      dissmissArray.slice(35, 47), // 后区胆码
      dissmissArray.slice(35, 47), // 后区拖码
    ];
  }
}
