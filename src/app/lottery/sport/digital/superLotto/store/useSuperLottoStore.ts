import {create} from 'zustand';

import {DeviceIdGenerator} from 'src/utils/device';
import {
  DigitalLotteryNames,
  PositionRule,
} from '../../lotteryTypes/configs/lotteryConfigs';

import {SuperLottoTicket} from '../../core';
import {persist} from 'zustand/middleware';
import {resolveSuperLottoStrategy} from '../utils';
import {SuperLottoPlayEnum, SuperLottoSubPlayEnum} from '../constants/index';

export interface SuperLottoState {
  positions: number[][];
  lotteryName: DigitalLotteryNames;
  playMode: SuperLottoPlayEnum;
  subPlayMode: SuperLottoSubPlayEnum;
  activeRules?: PositionRule[];
  showMiss: boolean;
  lotteryData?: LotteryDataSource.CharityLotteryDataSource;

  // 操作
  toggleNumber: (positionIndex: number, number: number) => void;
  clearSelection: () => void;
  quickPick: () => void;
  quickPick5: () => void;
  applyQuickPickCount: (count: number) => void;

  setRules?: (
    rules: PositionRule[],
    meta?: {play?: SuperLottoPlayEnum; subPlay?: SuperLottoSubPlayEnum},
  ) => void;
  setLotteryData: (
    lotteryData: LotteryDataSource.CharityLotteryDataSource,
  ) => void;

  // 票据构建
  buildTicket: () => Promise<SuperLottoTicket | undefined>;

  setPlayMode: (playMode: SuperLottoPlayEnum) => void;
  setSubPlayMode: (subPlayMode: SuperLottoSubPlayEnum) => void;

  // 计算
  getBetCount: () => number;
  getBetAmount: () => number;

  onMiss: () => void;
}

export const useSuperLottoStore = create<SuperLottoState>()(
  persist(
    (set, get) => ({
      positions: [],
      lotteryName: 'SuperLotto',
      playMode: SuperLottoPlayEnum.NORMAL,
      subPlayMode: SuperLottoSubPlayEnum.DEFAULT,
      activeRules: undefined,
      showMiss: false,
      lotteryData: undefined,
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

      setPlayMode: (playMode: SuperLottoPlayEnum) => {
        set({playMode});
      },
      setSubPlayMode: (subPlayMode: SuperLottoSubPlayEnum) => {

        console.log(subPlayMode,'====sub===')
        // set({subPlayMode});
      },

      setRules: (rules, meta) => {
        set({
          activeRules: rules,

          positions: Array.from({length: rules.length}, () => []),
        });
      },
      setLotteryData: (
        lotteryData: LotteryDataSource.CharityLotteryDataSource,
      ) => {
        set({lotteryData});
      },

      setShowMiss: (showMiss: boolean) => {
        set({showMiss});
      },

      // 机选
      quickPick: () => {
        const rules = get().activeRules ?? [];
        const strat = resolveSuperLottoStrategy(rules, {
          play: get().playMode,
          subPlay: get().subPlayMode,
        });
        const pos = strat.quickPick();
        set({positions: pos});
      },

      // 机选5注
      quickPick5: () => {
        const rules = get().activeRules ?? [];
        const strat = resolveSuperLottoStrategy(rules, {
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
          typeof firstRule.numberRange === 'number'
            ? firstRule.numberRange
            : 10;
        const finalCount = Math.max(0, Math.min(count, maxCount, numberRange));
        const selection = Array.from({length: finalCount}, (_, i) => i);
        const newPositions = Array.from({length: rules.length}, (_, idx) =>
          idx === 0 ? selection : [],
        );
        set({positions: newPositions});
      },
      onMiss: () => {
        set({showMiss: !get().showMiss});
      },
      // 构建票据
      buildTicket: async () => {
        const {positions} = get();

        // 校验
        const rules = get().activeRules ?? [];
        for (let i = 0; i < Math.min(positions.length, rules.length); i++) {
          const min = rules[i].minCount;
          if ((positions[i]?.length ?? 0) < min) {
            Toast.show(`第${i + 1}位至少选择${min}个号码`);
            return undefined;
          }
        }

        const play = get().playMode;
        const subPlay = get().subPlayMode;
        if (
          play === SuperLottoPlayEnum.NORMAL &&
          subPlay === SuperLottoSubPlayEnum.DEFAULT
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
          lotteryName: 'SuperLotto',
          positions,
          betId,
          betCount,
          betAmount,
          mode: play === SuperLottoPlayEnum.NORMAL ? 'normal' : 'dantuo',
          append: '2', // 默认不追加
          playMode: play as any, // 类型转换，因为 SuperLottoTicket 期望 ArrangedThreePlayEnum
          subPlayMode: subPlay as any, // 类型转换，因为 SuperLottoTicket 期望 ArrangedThreeSubPlayEnum
        };
      },

      // 计算注数
      getBetCount: () => {
        const {positions} = get();
        const rules = get().activeRules ?? [];
        const strat = resolveSuperLottoStrategy(rules, {
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
    {
      name: 'SuperLottoBetting',
    },
  ),
);
