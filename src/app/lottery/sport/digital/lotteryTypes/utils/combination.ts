import { SuperLottoPlayEnum } from "../../types";

 

/**
 * 计算组合数 C(n, k)
 * @param n 总数
 * @param k 选择数
 * @returns 组合数
 */
export function combination(n: number, k: number): number {
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

export function superLottoPlayAllDissmiss(
  activePlay: SuperLottoPlayEnum,
  dissmissArray: string[],
): string[][] {
  if (activePlay === SuperLottoPlayEnum.NORMAL) {
    return [dissmissArray.slice(0, 34), dissmissArray.slice(34, 46)];
  } else if (activePlay === SuperLottoPlayEnum.DANTUO) {
    return [
      dissmissArray.slice(0, 34),
      dissmissArray.slice(0, 34),
      dissmissArray.slice(34, 46),
      dissmissArray.slice(34, 46),
    ];
  }
  return [];
}

export function sevenStarPlayAllDissmiss(dissmissArray: string[]): string[][] {
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
