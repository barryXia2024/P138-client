import {
  ArrangedFivePlayEnum,
  ArrangedFiveSubPlayEnum,
} from '../../arrangedFive/constants';
import {combination} from '../utils/combination';

// 计算排列五二同三不同注数
function calcErTongSanBuTong(pool: number[]) {
  // 统计每个数字出现次数
  const countMap: Record<number, number> = {};
  pool.forEach(n => {
    countMap[n] = (countMap[n] || 0) + 1;
  });

  const uniqueNums = Object.keys(countMap).map(Number);
  let total = 0;

  // 遍历所有能当对子数字的候选
  uniqueNums.forEach(pairNum => {
    if (countMap[pairNum] >= 2) {
      // 其余数字
      const others = uniqueNums.filter(n => n !== pairNum);
      if (others.length >= 3) {
        const chooseThree = combination(others.length, 3);
        const arrange = combination(5, 2) * 6; // 10*6 = 60
        total += chooseThree * arrange;
      }
    }
  });

  return total;
}

function calcSanTongErBuTong(pool: number[]) {
  // 统计每个数字出现次数
  const countMap: Record<number, number> = {};
  pool.forEach(n => {
    countMap[n] = (countMap[n] || 0) + 1;
  });

  const uniqueNums = Object.keys(countMap).map(Number);
  let total = 0;

  uniqueNums.forEach(tripleNum => {
    if (countMap[tripleNum] >= 3) {
      // 剩下的数字
      const others = uniqueNums.filter(n => n !== tripleNum);
      if (others.length >= 2) {
        const chooseTwo = combination(others.length, 2);
        const arrange = combination(5, 3) * 2; // C(5,3)*2! = 10*2 = 20
        total += chooseTwo * arrange;
      }
    }
  });

  return total;
}

function calcErZuErTong(pool: number[]) {
  const countMap: Record<number, number> = {};
  pool.forEach(n => {
    countMap[n] = (countMap[n] || 0) + 1;
  });

  // 候选对子数字（至少出现2次）
  const pairCandidates = Object.keys(countMap).filter(k => countMap[k] >= 2).map(Number);
  let total = 0;

  if (pairCandidates.length < 2) return 0;

  // 选择两个不同的对子数字
  const pairComb = combination(pairCandidates.length, 2);

  // 对每一组对子数字，计算排列位置
  const arrange = combination(5,2) * combination(3,2) * 1; // 10*3*1=30

  total = pairComb * arrange;
  return total;
}
function calcSiTong(pool:number[]) {
  const countMap: Record<number, number> = {};
  pool.forEach(n => {
    countMap[n] = (countMap[n] || 0) + 1;
  });

  // 候选四同数字
  const quadCandidates = Object.keys(countMap).filter(k => countMap[k] >= 4).map(Number);
  let total = 0;

  quadCandidates.forEach(quadNum => {
    // 选择单独不同数字
    const others = Object.keys(countMap).filter(n => Number(n) !== quadNum);
    total += others.length * combination(5, 4); // 5
  });

  return total;
}
function factorial(n:number): number {
  return n <= 1 ? 1 : n * factorial(n - 1);
}
function calcSanTongErTong(pool:number[]) {
  const countMap: Record<number, number> = {};
  pool.forEach(n => {
    countMap[n] = (countMap[n] || 0) + 1;
  });

  const tripleCandidates = Object.keys(countMap).filter(k => countMap[k] >= 3);
  let total = 0;

  tripleCandidates.forEach(tripleNum => {
    // 选出可以作为二同数字的候选（排除三同数字）
    const pairCount = Object.keys(countMap).filter(k => k !== tripleNum && countMap[k] >= 2).length;
    total += pairCount * (factorial(5) / (factorial(3) * factorial(2))); // 10
  });

  return total;
}
export function resolveArrangedFiveStrategy(opts?: {
  play?: ArrangedFivePlayEnum;
  subPlay?: ArrangedFiveSubPlayEnum;
}) {
  // 直选定位复式 · 定位复式
  if (
    opts?.play === ArrangedFivePlayEnum.DirectPositioningDuplex &&
    opts?.subPlay === ArrangedFiveSubPlayEnum.PositioningDuplex
  ) {
    return {
      quickPick(): number[][] {
        // 机选：每个位置随机选1个数字，形成一注
        return Array.from({length: 5}, () => [Math.floor(Math.random() * 10)]);
      },
      getBetCount(positions: number[][]): number {
        // 直选定位复式：每个位置选几个数字，注数 = 万位 × 千位 × 百位 × 十位 × 个位
        return positions.reduce((acc, pos) => acc * (pos?.length ?? 0), 1);
      },
    } as const;
  }

  // 直选组合复式 · 五不同 (ABCDE)
  if (
    opts?.play === ArrangedFivePlayEnum.DirectCombinationDuplex &&
    opts?.subPlay === ArrangedFiveSubPlayEnum.CombinationFiveDifferent
  ) {
    return {
      quickPick(): number[][] {
        // 机选：选5个不同数字，形成1注
        return [
          Array.from({length: 10}, (_, i) => i)
            .sort(() => Math.random() - 0.5)
            .slice(0, 5),
        ];
      },
      getBetCount(positions: number[][]): number {
        const m = positions[0]?.length ?? 0;
        if (m < 5 || m > 8) return 0;
        // 五不同：选m个数字，注数 = C(m,5) × 5!
        // 根据玩法介绍：240元/注，奖金100000元
        return combination(m, 5) * 120; // 5! = 120
      },
    } as const;
  }

  // 直选组合复式 · 二同 (AABCD)
  if (
    opts?.play === ArrangedFivePlayEnum.DirectCombinationDuplex &&
    opts?.subPlay === ArrangedFiveSubPlayEnum.TwoSame
  ) {
    return {
      quickPick(): number[][] {
        // 机选：选4个号码，其中1个重复2次，其他3个各1次
        // 2同格式：AABCD，即1个数字重复2次，其他3个数字各1次
        const baseNumbers = Array.from({length: 10}, (_, i) => i)
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
        const repeatNumber = baseNumbers[0]; // 第一个数字重复2次
        const otherNumbers = baseNumbers.slice(1); // 其他3个数字各1次
        return [[repeatNumber, repeatNumber, ...otherNumbers]];
      },
      getBetCount(positions: number[][]): number {
        console.log('positions2222111', positions);
        const m = positions[0]?.length ?? 0;
        if (m < 4) return 0;
        // 二同：选m个数字，注数 = C(m,4) × 4! × C(4,2)
        // 根据玩法介绍：120元/注，奖金100000元
        // 机选4个号码 = 60注
        console.log('positions1111', positions);
        return calcErTongSanBuTong(positions[0] ?? []);
      },
    } as const;
  }

  // 直选组合复式 · 三同 (AAABC)
  if (
    opts?.play === ArrangedFivePlayEnum.DirectCombinationDuplex &&
    opts?.subPlay === ArrangedFiveSubPlayEnum.ThreeSame
  ) {
    return {
      quickPick(): number[][] {
        // 机选：选3个数字，其中1个重复3次，其他2个各1次
        // 3同格式：AAABC，即1个数字重复3次，其他2个数字各1次
        const baseNumbers = Array.from({length: 10}, (_, i) => i)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        const repeatNumber = baseNumbers[0]; // 第一个数字重复3次
        const otherNumbers = baseNumbers.slice(1); // 其他2个数字各1次
        return [[repeatNumber, repeatNumber, repeatNumber, ...otherNumbers]];
      },
      getBetCount(positions: number[][]): number {
        const m = positions[0]?.length ?? 0;
        if (m < 3 ) return 0;
        // 三同：选m个数字，注数 = C(m,3) × 3! × C(3,1)
        // 根据玩法介绍：40元/注，奖金100000元
        return calcSanTongErBuTong(positions[0] ?? []);
      },
    } as const;
  }

  // 直选组合复式 · 两组二同
  if (
    opts?.play === ArrangedFivePlayEnum.DirectCombinationDuplex &&
    opts?.subPlay === ArrangedFiveSubPlayEnum.TwoGroupTwoSame
  ) {
    return {
      quickPick(): number[][] {
        // 机选：选3个数字，其中2组相同的2个数字，形成1注
        // 两组二同格式：AABBC，即2个数字各重复2次，1个数字1次
        const baseNumbers = Array.from({length: 10}, (_, i) => i)
          .sort(() => Math.random() - 0.5)
          .slice(0, 2);
        const repeat1 = baseNumbers[0];
        const repeat2 = baseNumbers[1];
        const otherNumber = Array.from({length: 10}, (_, i) => i)
          .filter(n => n !== repeat1 && n !== repeat2)
          .sort(() => Math.random() - 0.5)[0];
        return [[repeat1, repeat1, repeat2, repeat2, otherNumber]];
      },
      getBetCount(positions: number[][]): number {
        const m = positions[0]?.length ?? 0;
        if (m < 4  ) return 0;
        // 两组二同：选m个数字，注数 = C(m,4) × 4! × C(4,2) × C(2,2)
        return calcErZuErTong(positions[0] ?? []);
      },
    } as const;
  }

  // 直选组合复式 · 四同 (AAAAB)
  if (
    opts?.play === ArrangedFivePlayEnum.DirectCombinationDuplex &&
    opts?.subPlay === ArrangedFiveSubPlayEnum.FourSame
  ) {
    return {
      quickPick(): number[][] {
        // 机选：选2个数字，其中4个相同，形成1注
        // 4同格式：AAAAB，即1个数字重复4次，1个数字1次
        const baseNumber = Math.floor(Math.random() * 10);
        let otherNumber = Math.floor(Math.random() * 10);
        while (otherNumber === baseNumber) {
          otherNumber = Math.floor(Math.random() * 10);
        }
        return [[baseNumber, baseNumber, baseNumber, baseNumber, otherNumber]];
      },
      getBetCount(positions: number[][]): number {
        const m = positions[0]?.length ?? 0;
        if (m < 2 ) return 0;

        console.log('positions1111', positions);
        // 四同：选m个数字，注数 = (position长度 - 4) × 5
        // 根据玩法介绍：10元/注，奖金100000元
        // 选2个号码：5注，选3个号码：10注，选4个号码：15注
        // 其中position长度 = 5，所以注数 = (5-4) × 5 = 5注
        return calcSiTong(positions[0] ?? []);
      },
    } as const;
  }

  // 直选组合复式 · 三同二同 (AAABB)
  if (
    opts?.play === ArrangedFivePlayEnum.DirectCombinationDuplex &&
    opts?.subPlay === ArrangedFiveSubPlayEnum.ThreeTwoSame
  ) {
    return {
      quickPick(): number[][] {
        console.log('positions2222');
        // 机选：选2个数字，其中3个相同和2个相同，形成1注
        // 三同二同格式：AAABB，即1个数字重复3次，1个数字重复2次
        const baseNumbers = Array.from({length: 10}, (_, i) => i)
          .sort(() => Math.random() - 0.5)
          .slice(0, 2);
        const repeat1 = baseNumbers[0];
        const repeat2 = baseNumbers[1];
        return [[repeat1, repeat1, repeat1, repeat2, repeat2]];
      },
      getBetCount(positions: number[][]): number {
        return calcSanTongErTong(positions[0] ?? []);
      },
    } as const;
  }

  // 默认
  return {
    quickPick(): number[][] {
      return [[Math.floor(Math.random() * 10)]];
    },
    getBetCount(positions: number[][]): number {
      return positions.reduce((acc, pos) => acc * (pos?.length ?? 0), 1);
    },
  } as const;
}
