import {
  PositionRule,
  SuperLottoPlayEnum,
  SuperLottoSubPlayEnum,
} from '../../types';

function combination(n: number, k: number): number {
  if (k < 0 || n < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - i + 1)) / i;
  return Math.round(r);
}

function pickDistinct(
  count: number,
  range: number,
  exclude: number[] = [],
): number[] {
  const s = new Set<number>();
  while (s.size < count) {
    const n = Math.floor(Math.random() * range) + 1;
    if (!exclude.includes(n)) s.add(n);
  }
  return Array.from(s).sort((a, b) => a - b);
}

export function resolveSuperLottoStrategy(
  rules: PositionRule[],
  opts?: {play?: SuperLottoPlayEnum; subPlay?: SuperLottoSubPlayEnum},
) {
  // 直选 · 组合胆拖
  if (opts?.play === SuperLottoPlayEnum.NORMAL) {
    return {
      quickPick(): number[][] {
        // 机选时选择6个红球，1个蓝球
        const redBalls = pickDistinct(5, 35);
        const blueBalls = pickDistinct(2, 12);
        return [redBalls, blueBalls];
      },
      getBetCount(positions: number[][]): number {
        const redBalls = positions[0] ?? [];
        const blueBalls = positions[1] ?? [];

        // 大乐透注数计算：C(红球选择数, 5) × C(蓝球选择数, 2)
        const redCombinations = combination(redBalls.length, 5);
        const blueCombinations = combination(blueBalls.length, 2);

        return redCombinations * blueCombinations;
      },
    } as const;
  }

  if (opts?.play === SuperLottoPlayEnum.DANTUO) {
    return {
      quickPick(): number[][] {
        // 胆拖模式：前区胆码1-5个，拖码2-28个，后区直接选蓝球
        const frontDan = pickDistinct(5, 35); // 前区胆码2个
        const frontTuo = pickDistinct(2, 35, frontDan); // 前区拖码4个（排除胆码）
        const blueDan = pickDistinct(1, 12); // 蓝球1个
        const blueTuo = pickDistinct(2, 12); // 蓝球1个
        return [frontDan, frontTuo, blueDan, blueTuo];
      },
      getBetCount(positions: number[][]): number {
        const frontDan = positions[0] ?? []; // 前区胆码
        const frontTuo = positions[1] ?? []; // 前区拖码
        const blueDan = positions[2] ?? []; // 蓝球
        const blueTuo = positions[3] ?? []; // 蓝球

        // 胆拖注数计算：
        // 前区：C(拖码数, 6-胆码数)
        const frontCombinations = combination(
          frontTuo.length,
          5 - frontDan.length,
        );

        // 后区：蓝球数量（因为蓝球没有胆拖，直接选）
        const blueCombinations = blueDan.length * blueTuo.length;

        return frontCombinations * blueCombinations;
      },
    } as const;
  }

  // 默认
  return {
    quickPick(): number[][] {
      return rules.map(rule =>
        pickDistinct(Math.max(rule.minCount, 1), rule.numberRange),
      );
    },
    getBetCount(positions: number[][]): number {
      // 对于双色球，默认也使用组合数计算
      if (positions.length >= 2) {
        const redBalls = positions[0] ?? [];
        const blueBalls = positions[1] ?? [];

        // 双色球注数计算：C(红球选择数, 6) × C(蓝球选择数, 1)
        const redCombinations = combination(redBalls.length, 6);
        const blueCombinations = combination(blueBalls.length, 1);

        return redCombinations * blueCombinations;
      }

      // 其他情况使用原逻辑
      return positions.reduce((acc, pos) => acc * (pos?.length ?? 0), 1);
    },
  } as const;
}
