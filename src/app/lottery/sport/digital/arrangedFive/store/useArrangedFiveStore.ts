import {create} from 'zustand';

import {DeviceIdGenerator} from 'src/utils/device';
import {
  DigitalLotteryNames,
  PositionRule,
} from '../../lotteryTypes/configs/lotteryConfigs';

import {ArrangedFiveTicket} from '../../core';
import {ArrangedFivePlayEnum, ArrangedFiveSubPlayEnum} from '../constants';
import {resolveArrangedFiveStrategy} from '../../lotteryTypes/arrangedFive/strategy';

export interface ArrangedFiveState {
  positions: number[][];
  lotteryName: DigitalLotteryNames;
  playMode: ArrangedFivePlayEnum;
  subPlayMode: ArrangedFiveSubPlayEnum;
  activeRules?: PositionRule[];

  // 操作
  toggleNumber: (positionIndex: number, number: number) => void;
  clearSelection: () => void;
  quickPick: () => void;

  setRules?: (
    rules: PositionRule[],
    meta?: {play?: ArrangedFivePlayEnum; subPlay?: ArrangedFiveSubPlayEnum},
  ) => void;

  // 票据构建
  buildTicket: () => Promise<ArrangedFiveTicket | undefined>;

  setPlayMode: (playMode: ArrangedFivePlayEnum) => void;
  setSubPlayMode: (subPlayMode: ArrangedFiveSubPlayEnum) => void;

  // 计算
  getBetCount: () => number;
  getBetAmount: () => number;
}

export const useArrangedFiveStore = create<ArrangedFiveState>()((set, get) => ({
  positions: [],
  lotteryName: 'ArrangedFive',
  playMode: ArrangedFivePlayEnum.DirectPositioningDuplex,
  subPlayMode: ArrangedFiveSubPlayEnum.PositioningDuplex,
  activeRules: undefined,

  removeFromArray: (value: number) => {
    set(state => ({
      positions: state.positions.map(pos => {
        const index = pos.indexOf(value);
        return index > -1 ? [...pos.slice(0, index), ...pos.slice(index + 1)] : pos;
      }),
    }));
  },
  // 切换选号
  toggleNumber: (positionIndex: number, number: number) => {
    console.log('toggleNumber', positionIndex, number);
    const {positions, activeRules, playMode, subPlayMode} = get();
    const newPositions = [...positions];
    const currentSelection = newPositions[positionIndex] ?? [];
    const rules = activeRules ?? [];
    const rule = rules[positionIndex];

    if (
      subPlayMode === ArrangedFiveSubPlayEnum.PositioningDuplex ||
      subPlayMode === ArrangedFiveSubPlayEnum.CombinationFiveDifferent
    ) {
      // 取消选择
      if (currentSelection.includes(number)) {
        newPositions[positionIndex] = currentSelection.filter(
          n => n !== number,
        );
        set({positions: newPositions});
        return;
      }
    }
    if (subPlayMode === ArrangedFiveSubPlayEnum.TwoSame) {
      const countMap = positions[positionIndex].reduce(
        (acc, cur) => {
          acc[cur] = (acc[cur] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>,
      );

      const hasMoreThan2 = Object.values(countMap).some(count => count > 1);

      if (hasMoreThan2 && countMap[number] > 0) {
        return;
      }
    }
    if (subPlayMode === ArrangedFiveSubPlayEnum.ThreeSame) {
      const countMap = positions[positionIndex].reduce(
        (acc, cur) => {
          acc[cur] = (acc[cur] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>,
      );
      const hasMoreThan2 = Object.values(countMap).some(count => count > 2);

      if (hasMoreThan2 && countMap[number] > 0) {
        return;
      }
    }

    if (subPlayMode === ArrangedFiveSubPlayEnum.TwoGroupTwoSame) {
      const countMap = positions[positionIndex].reduce(
        (acc, cur) => {
          acc[cur] = (acc[cur] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>,
      );

      // 找出所有出现2次的数字
      const twoSameNumbers = Object.entries(countMap)
        .filter(([_, count]) => count === 2)
        .map(([num]) => Number(num));

      // 如果已经有两组二同了，阻止再选择新的二同
      if (twoSameNumbers.length >= 2 && countMap[number] > 0) {
        return;
      }

      // 如果已经有一组二同了，阻止选择同样的数字形成超过2个
      if (twoSameNumbers.length === 1 && countMap[number] === 2) {
        return;
      }
    }
    if (subPlayMode === ArrangedFiveSubPlayEnum.FourSame) {
      const countMap = positions[positionIndex].reduce(
        (acc, cur) => {
          acc[cur] = (acc[cur] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>,
      );
      const hasMoreThan2 = Object.values(countMap).some(count => count > 3);
      if (hasMoreThan2 && countMap[number] > 0) {
        return;
      }
      const hasMoreThan1 = Object.values(countMap).some(count => count > 1);
      if (hasMoreThan1 && countMap[number] === 4) {
        return;
      }
    }
    if (subPlayMode === ArrangedFiveSubPlayEnum.ThreeTwoSame) {
      const countMap = positions[positionIndex].reduce(
        (acc, cur) => {
          acc[cur] = (acc[cur] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>,
      );

      const activeNumbers = Object.keys(countMap)
        .map(Number)
        .filter(num => countMap[num] > 0);

      // 如果已经有两种不同数字，点击非这两个数字直接返回
      if (activeNumbers.length >= 2 && !activeNumbers.includes(number)) {
        return;
      }

      const currentCount = countMap[number] || 0;

      // 分别取当前数字可能达到的最大次数
      let maxCount = 3; // 默认三次
      if (activeNumbers.length === 2) {
        // 如果已有两个数字，判断这个数字当前是三同还是二同
        const otherNumber = activeNumbers.find(n => n !== number)!;
        if (countMap[otherNumber] === 3) {
          maxCount = 2; // 当前数字只能选两次
        }
      } else if (activeNumbers.length === 1) {
        // 只有一个数字已经选，当前数字可以选三次或两次，按规则限制
        if (currentCount === 0) {
          maxCount = 2; // 新的第二个数字最多选2次
        } else if (currentCount === 1 && countMap[activeNumbers[0]] === 3) {
          maxCount = 2;
        }
      }

      // 超过允许次数直接返回
      if (currentCount >= maxCount) {
        return;
      }
    }

    newPositions[positionIndex] = [...currentSelection, number];
    console.log('newPositions:', newPositions);
    set({positions: newPositions});
  },

  // 清空选择
  clearSelection: () => {
    set({
      positions: [],
    });
  },

  reset: () => {
    set({
      positions: [],
      lotteryName: 'ArrangedFive',
      playMode: ArrangedFivePlayEnum.DirectPositioningDuplex,
      subPlayMode: ArrangedFiveSubPlayEnum.PositioningDuplex,
      activeRules: undefined,
    });
  },

  setPlayMode: (playMode: ArrangedFivePlayEnum) => {
    console.log(playMode, '===============');
    set({playMode});
  },
  setSubPlayMode: (subPlayMode: ArrangedFiveSubPlayEnum) => {
    set({subPlayMode});
  },

  setRules: (rules, meta) => {
    set({
      activeRules: rules,
      playMode: meta?.play,
      subPlayMode: meta?.subPlay,
      positions: Array.from({length: rules.length}, () => []),
    });
  },

  // 机选
  quickPick: () => {
    const rules = get().activeRules ?? [];
    const strat = resolveArrangedFiveStrategy({
      play: get().playMode,
      subPlay: get().subPlayMode,
    });
    const pos = strat.quickPick();
    console.log('pos', pos);
    set({positions: pos});
  },

  // 构建票据
  buildTicket: async () => {
    const {positions} = get();
    console.log('buildTicket-positions', positions);

    // 校验
    const rules = get().activeRules ?? [];
    // for (let i = 0; i < Math.min(positions.length, rules.length); i++) {
    //   const min = rules[i].minCount;
    //   if ((positions[i]?.length ?? 0) < min) {
    //     Toast.show(`第${i + 1}位至少选择${min}个号码`);
    //     return undefined;
    //   }
    // }

    // const play = get().playMode;
    // const subPlay = get().subPlayMode;

    const betId = await new DeviceIdGenerator().generateSnowflakeId();
    const betCount = get().getBetCount();
    const betAmount = get().getBetAmount();
    console.log('betCount', betCount);

    return {
      lotteryName: 'ArrangedFive',
      positions,
      betId,
      betCount,
      betAmount,
      playMode: get().playMode,
      subPlayMode: get().subPlayMode,
    };
  },

  // 计算注数
  getBetCount: () => {
    const {positions} = get();
    const rules = get().activeRules ?? [];
    const strat = resolveArrangedFiveStrategy({
      play: get().playMode,
      subPlay: get().subPlayMode,
    });
    return strat.getBetCount(positions);
  },

  // 计算金额
  getBetAmount: () => {
    return get().getBetCount() * 2;
  },
}));
