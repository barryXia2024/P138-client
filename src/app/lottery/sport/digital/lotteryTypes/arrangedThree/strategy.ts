import type {PositionRule} from '../configs/lotteryConfigs';
import {ArrangedThreePlayEnum, ArrangedThreeSubPlayEnum} from './uiConfig';

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
    const n = Math.floor(Math.random() * range);
    if (!exclude.includes(n)) s.add(n);
  }
  return Array.from(s).sort((a, b) => a - b);
}

function C(n: number, k: number) {
  if (n < 0 || k < 0 || n < k) return 0;
  if (k === 0 || k === n) return 1;
  if (k === 1) return n;
  return (n * (n - 1)) / 2; // 这里只用到 k=2 的情形
}
/**
 * 组三计算和值注数
 */
function sumCount(s: number): number {
  // f(s) = Σ_{i=0..3} (-1)^i * C(3,i) * C(s - 10*i + 2, 2)
  let res = 0;
  for (let i = 0; i <= 3; i++) {
    const sign = i % 2 === 0 ? 1 : -1;
    res += sign * C(3, i) * C(s - 10 * i + 2, 2);
  }
  return res;
}

/**
 * 计算跨度注数
 * @param type 类型：直选、组三、组六
 * @returns 跨度注数映射表
 */
function calcSpanCounts(
  type:
    | ArrangedThreePlayEnum.DirectSelection
    | ArrangedThreePlayEnum.GroupThree
    | ArrangedThreePlayEnum.GroupSix,
) {
  const map: Record<number, number> = {};
  for (let k = 0; k <= 9; k++) map[k] = 0;

  for (let a = 0; a <= 9; a++) {
    for (let b = 0; b <= 9; b++) {
      for (let c = 0; c <= 9; c++) {
        const span = Math.max(a, b, c) - Math.min(a, b, c);

        if (type === ArrangedThreePlayEnum.DirectSelection) {
          map[span]++;
        } else if (type === ArrangedThreePlayEnum.GroupThree) {
          // 组三：两位相同，一位不同
          if (
            (a === b && b !== c) ||
            (a === c && b !== a) ||
            (b === c && a !== b)
          ) {
            map[span]++;
          }
        } else if (type === ArrangedThreePlayEnum.GroupSix) {
          // 组六：三位全不相同
          if (a !== b && a !== c && b !== c) {
            map[span]++;
          }
        }
      }
    }
  }
  return map;
}

export function resolveArrangedThreeStrategy(
  rules: PositionRule[],
  opts?: {play?: ArrangedThreePlayEnum; subPlay?: ArrangedThreeSubPlayEnum},
) {
  // 直选 · 组合胆拖
  if (
    opts?.play === ArrangedThreePlayEnum.DirectSelection &&
    opts?.subPlay === ArrangedThreeSubPlayEnum.CombinationDrag
  ) {
    return {
      quickPick(): number[][] {
        // 机选时胆码2个红球，拖码2个蓝球
        const dan = pickDistinct(2, 10);
        const tuo = pickDistinct(2, 10);
        return [dan, tuo];
      },
      getBetCount(positions: number[][]): number {
        const dan = positions[0]?.length ?? 0;
        const tuo = positions[1]?.length ?? 0;
        if (dan < 1 || dan > 2 || dan + tuo < 4) return 0;

        // 组合胆拖注数计算：
        // 胆码固定不变，拖码自由组合，位置可切换
        if (dan === 1 && tuo >= 2) {
          // 1个胆码 + 2个拖码：C(拖码数, 2) * 6（6种位置排列）
          return combination(tuo, 2) * 6;
        } else if (dan === 2 && tuo >= 1) {
          // 2个胆码 + 1个拖码：C(拖码数, 1) * 6（6种位置排列）
          return combination(tuo, 1) * 6;
        }
        return 0;
      },
    } as const;
  }

  // 直选 · 组合三不同
  if (
    opts?.play === ArrangedThreePlayEnum.DirectSelection &&
    opts?.subPlay === ArrangedThreeSubPlayEnum.CombinationDifferent
  ) {
    return {
      quickPick(): number[][] {
        return [pickDistinct(3, 10)];
      },
      getBetCount(positions: number[][]): number {
        const n = positions[0]?.length ?? 0;
        if (n < 3) return 0;
        // 组合三不同：选n个数字，注数 = C(n,3) * 6
        // 3个球=6注，4个球=24注，5个球=60注
        return combination(n, 3) * 6;
      },
    } as const;
  }

  // 直选 · 和值
  if (
    opts?.play === ArrangedThreePlayEnum.DirectSelection &&
    opts?.subPlay === ArrangedThreeSubPlayEnum.SumValue
  ) {
    return {
      quickPick(): number[][] {
        return [pickDistinct(1, 28)];
      },
      getBetCount(positions: number[][]): number {
        const selectedSums = positions[0] ?? [];
        if (selectedSums.length === 0) return 0;
        // 和值注数：每个和值对应固定注数
        // 和值10=63注，和值11=69注，和值10+11=132注

        return selectedSums.reduce((total, sum) => total + sumCount(sum), 0);
      },
    } as const;
  }

  // 直选 · 定位复式
  if (
    opts?.play === ArrangedThreePlayEnum.DirectSelection &&
    opts?.subPlay === ArrangedThreeSubPlayEnum.PositioningDuplex
  ) {
    return {
      quickPick(): number[][] {
        return [pickDistinct(1, 10), pickDistinct(1, 10), pickDistinct(1, 10)];
      },
      getBetCount(positions: number[][]): number {
        return positions.reduce((acc, pos) => acc * (pos?.length ?? 0), 1);
      },
    } as const;
  }

  // 直选 · 跨度复式
  if (
    opts?.play === ArrangedThreePlayEnum.DirectSelection &&
    opts?.subPlay === ArrangedThreeSubPlayEnum.SpanDuplex
  ) {
    return {
      quickPick(): number[][] {
        return [pickDistinct(1, 10)];
      },
      getBetCount(positions: number[][]): number {
        const selectedSpans = positions[0] ?? [];
        if (selectedSpans.length === 0) return 0;

        // 跨度注数：每个跨度对应固定注数
        // 跨度0=10注，跨度1=54注，等等
        const spanBetCountMap = calcSpanCounts(
          opts?.play as
            | ArrangedThreePlayEnum.DirectSelection
            | ArrangedThreePlayEnum.GroupThree
            | ArrangedThreePlayEnum.GroupSix,
        );

        return selectedSpans.reduce(
          (total, span) => total + (spanBetCountMap[span] || 0),
          0,
        );
      },
    } as const;
  }

  // 组三 · 复式/单式（按选择 m 个数字，注数 = C(m,2) * 2）
  if (
    opts?.play === ArrangedThreePlayEnum.GroupThree &&
    opts?.subPlay === ArrangedThreeSubPlayEnum.Duplex
  ) {
    return {
      quickPick(): number[][] {
        return [pickDistinct(2, 10)];
      },
      getBetCount(positions: number[][]): number {
        const m = positions[0]?.length ?? 0;
        if (m < 2) return 0;
        return combination(m, 2) * 2;
      },
    } as const;
  }

  // 组三 · 单式（重号1个 + 单号1个） => 始终为1注
  if (
    opts?.play === ArrangedThreePlayEnum.GroupThree &&
    opts?.subPlay === ArrangedThreeSubPlayEnum.Single
  ) {
    return {
      quickPick(): number[][] {
        // 重号与单号不同，各选1个
        const heavy = pickDistinct(1, 10);
        const single = pickDistinct(1, 10, heavy);
        return [[...heavy,...heavy], single];
      },
      getBetCount(positions: number[][]): number {
        const heavy = positions[0]?.length ?? 0;
        const single = positions[1]?.length ?? 0;
        if (heavy ==0 || single ==0) return 0;
        // 形如 AAB（或 BAA)，但票面按组三单式算1注
        return 1;
      },
    } as const;
  }

  // 组三 · 胆拖（胆1个；拖 t 个；注数 = 2 * C(t,1) = 2t）
  if (
    opts?.play === ArrangedThreePlayEnum.GroupThree &&
    opts?.subPlay === ArrangedThreeSubPlayEnum.CourageDragged
  ) {
    return {
      quickPick(): number[][] {
        const dan = pickDistinct(1, 10);
        const tuo = pickDistinct(2, 10, dan);
        return [dan, tuo];
      },
      getBetCount(positions: number[][]): number {
        const dan = positions[0]?.length ?? 0;
        const t = positions[1]?.length ?? 0;
        if (dan !== 1 || t < 1) return 0;
        // 组三胆拖：胆1个，拖t个，注数 = 2 * t
        return 2 * t;
      },
    } as const;
  }

  // 组三 · 跨度复式（针对排列3组选3号码的跨度进行投注）
  if (
    opts?.play === ArrangedThreePlayEnum.GroupThree &&
    opts?.subPlay === ArrangedThreeSubPlayEnum.SpanDuplex
  ) {
    return {
      quickPick(): number[][] {
        // 组选3跨度有效投注范围为1~9，机选选择1个跨度值
        return [pickDistinct(1, 9)];
      },
      getBetCount(positions: number[][]): number {
        const selectedSpans = positions[0] ?? [];
        if (selectedSpans.length === 0) return 0;

        // 组选3跨度注数：每个跨度对应固定注数
        // 跨度1~9，每个跨度包含对应数量的组选3单式号码
        const group3SpanBetCountMap: Record<number, number> = {
         
          1: 18,
          2: 16,
          3: 14,
          4: 12,
          5: 10,
          6: 8,
          7: 6,
          8: 4,
          9: 2,
        };
    

        return selectedSpans.reduce((total, span) => {
          // 注意：UI中显示的是1-9，对应实际跨度值1-9
          const actualSpan = span ;
          return total + (group3SpanBetCountMap[actualSpan] || 0);
        }, 0);
      },
    } as const;
  }

  // 组六 · 复式（选 m 个不同数字，注数 = C(m,3)）
  if (
    opts?.play === ArrangedThreePlayEnum.GroupSix &&
    opts?.subPlay === ArrangedThreeSubPlayEnum.Duplex
  ) {
    return {
      quickPick(): number[][] {
        // 机选选择3个号码
        return [pickDistinct(3, 10)];
      },
      getBetCount(positions: number[][]): number {
        const m = positions[0]?.length ?? 0;
        if (m < 3) return 0;
        // 组六复式：选m个数字，注数 = C(m,3)
        return combination(m, 3);
      },
    } as const;
  }

  // 组六 · 胆拖（胆1-2；拖 t；若胆=1 => C(t,2)；胆=2 => C(t,1) = t）
  if (
    opts?.play === ArrangedThreePlayEnum.GroupSix &&
    opts?.subPlay === ArrangedThreeSubPlayEnum.CourageDragged
  ) {
    return {
      quickPick(): number[][] {
        // 机选：2红(胆码) + 2蓝(拖码)，且互不相同
        const dan = pickDistinct(2, 10);
        const tuo = pickDistinct(2, 10, dan);
        return [dan, tuo];
      },
      getBetCount(positions: number[][]): number {
        const d = positions[0]?.length ?? 0;
        const t = positions[1]?.length ?? 0;
        // 约束：胆1-2个，拖≥1个，总球数≥4
        if (d < 1 || d > 2 || t < 1) return 0;
        if (d + t < 4) return 0;
        // 组六胆拖：胆1-2个，拖t个
        // 若胆=1 => C(t,2)；胆=2 => C(t,1) = t
        if (d === 1) return combination(t, 2);
        return t; // d === 2
      },
    } as const;
  }

  // 组六 · 跨度复式（针对排列3组选6号码的跨度进行投注）
  if (
    opts?.play === ArrangedThreePlayEnum.GroupSix &&
    opts?.subPlay === ArrangedThreeSubPlayEnum.SpanDuplex
  ) {
    return {
      quickPick(): number[][] {
        // 组选6跨度有效投注范围为2~9，机选选择1个跨度值
        return [pickDistinct(1, 8)];
      },
      getBetCount(positions: number[][]): number {
        const selectedSpans = positions[0] ?? [];
        if (selectedSpans.length === 0) return 0;

        // 组选6跨度注数：每个跨度对应固定注数
        // 跨度2~9，每个跨度包含对应数量的组选6单式号码
        const group6SpanBetCountMap: Record<number, number> = {
          2: 8,
          3: 14,
          4: 18,
          5: 20,
          6: 20,
          7: 18,
          8: 14,
          9: 8,
        };

        return selectedSpans.reduce((total, span) => {
          // UI中显示的是2-9，直接使用span值查找映射表
          return total + (group6SpanBetCountMap[span] || 0);
        }, 0);
      },
    } as const;
  }

  // 组选 · 组选和值（计算每个和值对应的注数）
  if (
    opts?.play === ArrangedThreePlayEnum.Group &&
    opts?.subPlay === ArrangedThreeSubPlayEnum.GroupSumValue
  ) {
    return {
      quickPick(): number[][] {
        return [pickDistinct(1, 26)];
      },
      getBetCount(positions: number[][]): number {
        const selectedSums = positions[0] ?? [];
        if (selectedSums.length === 0) return 0;

        // 计算每个和值对应的注数（组合计数：a ≤ b ≤ c，排除三同号）
        const calculateSumBetCount = (targetSum: number): number => {
          let count = 0;
          for (let a = 0; a <= 9; a++) {
            for (let b = a; b <= 9; b++) {
              const c = targetSum - a - b;
              if (c < b || c > 9) continue;
              if (a === b && b === c) continue; // 排除三同号
              count++;
            }
          }
          return count;
        };
      
        return selectedSums.reduce((total, sum) => {
          return total + calculateSumBetCount(sum);
        }, 0);
      },
    } as const;
  }

  // 组选 · 2码全包（选 m 个不同数字，注数 = C(m,2)）
  if (
    opts?.play === ArrangedThreePlayEnum.Group &&
    opts?.subPlay === ArrangedThreeSubPlayEnum.GroupTwoCode
  ) {
    return {
      quickPick(): number[][] {
        return [pickDistinct(2, 10)];
      },
      getBetCount(positions: number[][]): number {
        const m = positions[0]?.length ?? 0;
        // 组选2码全包：选m个数字，注数 = C(m,2)
        if (m < 2) return 0;
        return combination(m, 2)*10;
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
      return positions.reduce((acc, pos) => acc * (pos?.length ?? 0), 1);
    },
  } as const;
}
