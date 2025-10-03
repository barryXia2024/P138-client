import {PositionRule} from 'src/app/lottery/sport/digital/lotteryTypes/configs/lotteryConfigs';
import {Happy8PlayEnum} from '../constants';

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

export function resolveHappy8Strategy(
  rules: PositionRule[],
  opts?: {play?: Happy8PlayEnum; subPlay?: Happy8PlayEnum; pickN?: number},
) {
  const pickN = Math.max(1, Math.min(10, opts?.pickN ?? 1));

  // 普通任选：从所选m个号码里取N个组合
  if (opts?.play === Happy8PlayEnum.normal) {
    return {
      quickPick(n: number): number[][] {
        const balls = pickDistinct(n, 80);
        return [balls];
      },
      getBetCount(positions: number[][]): number {
        const selected = positions[0] ?? [];
        return combination(selected.length, pickN);
      },
    } as const;
  }

  // 胆拖：注数 = C(拖码数, N-胆码数)
  if (opts?.play === Happy8PlayEnum.dantuo) {
    return {
      quickPick(n: number): number[][] {
        const danCount = Math.max(1, Math.min(n - 1, 6));
        const dan = pickDistinct(danCount, 80);
        const needFromTuo = Math.max(0, n - danCount);
        const tuo = pickDistinct(Math.max(needFromTuo, 2), 80, dan);
        return [dan, tuo];
      },
      getBetCount(positions: number[][]): number {
        const dan = positions[0] ?? [];
        const tuo = positions[1] ?? [];
        const need = pickN - dan.length;
        if (need <= 0) return 0; // 胆码不得达到或超过N
        return combination(tuo.length, need);
      },
    } as const;
  }

  // 默认：按任选处理
  return {
    quickPick(n: number): number[][] {
      return [pickDistinct(Math.max(1, n), rules?.[0]?.numberRange ?? 80)];
    },
    getBetCount(positions: number[][]): number {
      const selected = positions[0] ?? [];
      return combination(selected.length, pickN);
    },
  } as const;
}

/*
快乐8任选/胆拖核心规则（计算相关）：
- 任选N（N∈[1,10]）：注数 = C(所选数量m, N)，m>=N 否则为0
- 胆拖：设胆码d、拖码t，且1<=d<=N-1，注数 = C(t, N-d)
*/
