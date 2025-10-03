import {PositionRule} from 'src/app/lottery/sport/digital/lotteryTypes/configs/lotteryConfigs';
import {DoubleBallPlayEnum} from '../constants';

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

export function resolveDoubleBallStrategy(
  rules: PositionRule[],
  opts?: {play?: DoubleBallPlayEnum; subPlay?: DoubleBallPlayEnum},
) {
  // 直选 · 组合胆拖
  if (opts?.play === DoubleBallPlayEnum.normal) {
    return {
      quickPick(): number[][] {
        // 机选时选择6个红球，1个蓝球
        const redBalls = pickDistinct(6, 33);
        const blueBalls = pickDistinct(1, 16);
        return [redBalls, blueBalls];
      },
      getBetCount(positions: number[][]): number {
        const redBalls = positions[0] ?? [];
        const blueBalls = positions[1] ?? [];

        // 双色球注数计算：C(红球选择数, 6) × C(蓝球选择数, 1)
        const redCombinations = combination(redBalls.length, 6);
        const blueCombinations = combination(blueBalls.length, 1);

        return redCombinations * blueCombinations;
      },
    } as const;
  }

  if (opts?.play === DoubleBallPlayEnum.dantuo) {
    return {
      quickPick(): number[][] {
        // 胆拖模式：前区胆码1-5个，拖码2-28个，后区直接选蓝球
        const frontDan = pickDistinct(5, 33); // 前区胆码2个
        const frontTuo = pickDistinct(2, 33, frontDan); // 前区拖码4个（排除胆码）
        const blueBalls = pickDistinct(1, 16); // 蓝球1个
        return [frontDan, frontTuo, blueBalls];
      },
      getBetCount(positions: number[][]): number {
        const frontDan = positions[0] ?? []; // 前区胆码
        const frontTuo = positions[1] ?? []; // 前区拖码
        const blueBalls = positions[2] ?? []; // 蓝球

        // 胆拖注数计算：
        // 前区：C(拖码数, 6-胆码数)
        const frontCombinations = combination(frontTuo.length, 6 - frontDan.length);
        
        // 后区：蓝球数量（因为蓝球没有胆拖，直接选）
        const blueCombinations = blueBalls.length;

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

/*
双色球胆拖注数计算示例：

1. 前区胆码2个 + 拖码4个，蓝球1个
   - 前区：C(4, 6-2) = C(4, 4) = 1
   - 蓝球：1
   - 总注数：1 × 1 = 1注

2. 前区胆码1个 + 拖码8个，蓝球2个
   - 前区：C(8, 6-1) = C(8, 5) = 56
   - 蓝球：2
   - 总注数：56 × 2 = 112注

3. 前区胆码3个 + 拖码6个，蓝球3个
   - 前区：C(6, 6-3) = C(6, 3) = 20
   - 蓝球：3
   - 总注数：20 × 3 = 60注

规则：
- 前区胆码：1-5个
- 前区拖码：2-28个（且胆码+拖码总数≤33）
- 蓝球：1-16个（直接选择，无胆拖）
- 注数 = C(拖码数, 6-胆码数) × 蓝球数量
*/
