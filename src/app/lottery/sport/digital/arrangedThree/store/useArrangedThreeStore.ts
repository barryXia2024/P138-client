import {create} from 'zustand';

import {DeviceIdGenerator} from 'src/utils/device';
import {
  DigitalLotteryNames,
  PositionRule,
} from '../../lotteryTypes/configs/lotteryConfigs';

import {PositionTicket} from '../../core';
import {persist} from 'zustand/middleware';
import {ArrangedThreePlayEnum, ArrangedThreeSubPlayEnum} from '../constants';
import {resolveArrangedThreeStrategy} from '../../lotteryTypes/arrangedThree/strategy';

export interface ArrangedThreeState {
  positions: number[][];
  lotteryName: DigitalLotteryNames;
  playMode: ArrangedThreePlayEnum;
  subPlayMode: ArrangedThreeSubPlayEnum;
  activeRules?: PositionRule[];
  showMissNumbers: boolean;
  setShowMissNumbers: (showMissNumbers: boolean) => void;
  // 操作
  toggleNumber: (positionIndex: number, number: number) => void;
  clearSelection: () => void;
  quickPick: () => void;
  applyQuickPickCount: (count: number) => void;
  reset: () => void;
  setRules?: (
    rules: PositionRule[],
    meta?: {play?: ArrangedThreePlayEnum; subPlay?: ArrangedThreeSubPlayEnum},
  ) => void;

  // 票据构建
  buildTicket: () => Promise<PositionTicket | undefined>;

  setPlayMode: (playMode: ArrangedThreePlayEnum) => void;
  setSubPlayMode: (subPlayMode: ArrangedThreeSubPlayEnum) => void;

  // 计算
  getBetCount: () => number;
  getBetAmount: () => number;
}

export const useArrangedThreeStore = create<ArrangedThreeState>()(
  (set, get) => ({
    positions: [],
    lotteryName: 'ArrangedThree',
    playMode: ArrangedThreePlayEnum.DirectSelection,
    subPlayMode: ArrangedThreeSubPlayEnum.PositioningDuplex,
    activeRules: undefined,
    showMissNumbers: false,
    setShowMissNumbers: (showMissNumbers: boolean) => {
      set({showMissNumbers});
    },
    // 切换选号
    toggleNumber: (positionIndex: number, number: number) => {
      const {positions, activeRules} = get();
      const newPositions = [...positions];
      const currentSelection = newPositions[positionIndex] ?? [];
      const rules = activeRules ?? [];
      const rule = rules[positionIndex];

      // 取消选择
      if (currentSelection.includes(number)) {
        newPositions[positionIndex] = currentSelection.filter(
          n => n !== number,
        );
        set({positions: newPositions});
        return;
      }

     

      if (
        get().playMode === ArrangedThreePlayEnum.GroupThree &&
        get().subPlayMode === ArrangedThreeSubPlayEnum.Single
      ) {
        newPositions[positionIndex] =
          positionIndex === 0 ? [number, number] : [number];
        set({positions: newPositions});
        return;
      }
      if (
        rule &&
        typeof rule.maxCount === 'number' &&
        currentSelection.length >= rule.maxCount
      ) {
        Toast.show(`本区最多可选${rule.maxCount}个`);
        return;
      }
      newPositions[positionIndex] = [...currentSelection, number];
      set({positions: newPositions});
    },

    // 清空选择
    clearSelection: () => {
      set({positions: []});
    },
    reset: () => {
      set({
        positions: [],
        lotteryName: 'ArrangedThree',
        playMode: ArrangedThreePlayEnum.DirectSelection,
        subPlayMode: ArrangedThreeSubPlayEnum.PositioningDuplex,
        activeRules: undefined,
      });
    },
    setPlayMode: (playMode: ArrangedThreePlayEnum) => {
      set({playMode});
    },
    setSubPlayMode: (subPlayMode: ArrangedThreeSubPlayEnum) => {
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
      const strat = resolveArrangedThreeStrategy(rules, {
        play: get().playMode,
        subPlay: get().subPlayMode,
      });
      const pos = strat.quickPick();
      set({positions: pos});
    },

    // 应用快速选号数量（用于单列玩法：如 组三/组六 复式）
    applyQuickPickCount: (count: number) => {
      const rules = get().activeRules ?? [];
      if (rules.length === 0) return;

      const firstRule = rules[0];
      const maxCount =
        typeof firstRule.maxCount === 'number' ? firstRule.maxCount : count;
      const numberRange =
        typeof firstRule.numberRange === 'number' ? firstRule.numberRange : 10;

      const finalCount = Math.max(0, Math.min(count, maxCount, numberRange));

      // 随机取不重复的 finalCount 个数
      const pool = Array.from({length: numberRange}, (_, i) => i);
      const selection: number[] = [];
      while (selection.length < finalCount && pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        selection.push(pool[idx]);
        pool.splice(idx, 1); // 删除已选，避免重复
      }

      const newPositions = Array.from({length: rules.length}, (_, idx) =>
        idx === 0 ? selection : [],
      );

      set({positions: newPositions});
    },

    // 构建票据
    buildTicket: async () => {
      const {positions} = get();

      // 校验
      // const rules = get().activeRules ?? [];
      // for (let i = 0; i < Math.min(positions.length, rules.length); i++) {
      //   const min = rules[i].minCount;
      //   if ((positions[i]?.length ?? 0) < min) {
      //      Toast.show(`第${i + 1}位至少选择${min}个号码`);
      //     return undefined;
      //   }
      // }

      const play = get().playMode;
      const subPlay = get().subPlayMode;
      if (
        play === ArrangedThreePlayEnum.DirectSelection &&
        subPlay === ArrangedThreeSubPlayEnum.CourageDragged
      ) {
        const totalSelected =
          (positions[0]?.length ?? 0) + (positions[1]?.length ?? 0);
        if (totalSelected < 4) {
          Toast.show('胆码+拖码总数需≥4');
          return undefined;
        }
      }
      const betId = await new DeviceIdGenerator().generateSnowflakeId();
      const betCount = get().getBetCount();
      const betAmount = get().getBetAmount();

      return {
        lotteryName: 'ArrangedThree',
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
      const strat = resolveArrangedThreeStrategy(rules, {
        play: get().playMode,
        subPlay: get().subPlayMode,
      });
      return strat.getBetCount(positions);
    },

    // 计算金额
    getBetAmount: () => {
      return get().getBetCount() * 2;
    },
  }),
);
