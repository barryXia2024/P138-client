import {create} from 'zustand';
import {PositionTicket} from '../core';
import {DeviceIdGenerator} from 'src/utils/device';
import {DigitalLotteryNames, LOTTERY_CONFIGS} from './configs/lotteryConfigs';

import {SuperLottoPlayEnum, SuperLottoSubPlayEnum} from '../types';

// （移除未使用的全局组合数函数）

export interface PositionState {
  positions: number[][];
  lotteryName: DigitalLotteryNames;
  playMode?: SuperLottoPlayEnum;
  activeRules?: {
    index: number;
    minCount: number;
    maxCount?: number;
    numberRange: number;
  }[];
  activePlay?: string;
  activeSubPlay?: string;
  showDissmiss: boolean;

  // 操作
  toggleNumber: (positionIndex: number, number: number) => void;
  clearSelection: () => void;
  quickPick: () => void;
  setShowDissmiss: (dismiss?: boolean) => void;
  setPositionsLength: (length: number) => void;
  setPlayMode?: (playMode: SuperLottoPlayEnum) => void;
  setRules?: (
    rules: {
      index: number;
      minCount: number;
      maxCount?: number;
      numberRange: number;
    }[],
    meta?: {play?: SuperLottoPlayEnum; subPlay?: SuperLottoSubPlayEnum},
  ) => void;

  // 票据构建
  buildTicket: () => Promise<PositionTicket | undefined>;

  // 计算
  getBetCount: () => number;
  getBetAmount: () => number;
}

export function createPositionStore(lotteryName: DigitalLotteryNames) {
  const config = LOTTERY_CONFIGS[lotteryName];

  // 组合数计算 C(n, k)
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

  return create<PositionState>((set, get) => ({
    positions: Array.from(
      {
        length: config.rules.positionRules
          ? config.rules.positionRules.length
          : config.rules.positions || 0,
      },
      () => [],
    ),
    lotteryName,
    playMode: lotteryName === 'SuperLotto' ? SuperLottoPlayEnum.NORMAL : undefined,
    activeRules: undefined,
    activePlay: undefined,
    activeSubPlay: undefined,
    showDissmiss: false,

    // 切换选号
    toggleNumber: (positionIndex: number, number: number) => {
      const {positions, playMode, activeRules} = get();
      const newPositions = [...positions];
      const currentSelection = newPositions[positionIndex] ?? [];
      const rules = activeRules ?? config.rules.positionRules ?? [];
      const rule = rules[positionIndex];

      console.log(Toast);

      // 取消选择
      if (currentSelection.includes(number)) {
        newPositions[positionIndex] = currentSelection.filter(
          n => n !== number,
        );
        set({positions: newPositions});
        return;
      }

      // 最大数量限制（优先按 SuperLotto 的 playMode 规则，其次按通用规则；七星不限制最大数）
      if (lotteryName === 'SevenStar') {
        // 不限制最大选择数
      } else if (lotteryName === 'SuperLotto') {
        const m = playMode || SuperLottoPlayEnum.NORMAL;
        let max = Infinity;
        if (m === SuperLottoPlayEnum.NORMAL) {
          max = positionIndex === 0 ? 35 : positionIndex === 1 ? 12 : Infinity;
        } else if (m === SuperLottoPlayEnum.DANTUO) {
          if (positionIndex === 0)
            max = 4; // 前胆
          else if (positionIndex === 1)
            max = 35; // 前拖
          else if (positionIndex === 2)
            max = 1; // 后胆
          else if (positionIndex === 3) max = 12; // 后拖
        }
        if (currentSelection.length >= max) {
          Toast.show(`本区最多可选${max}个`);
          return;
        }
      } else if (
        rule &&
        typeof rule.maxCount === 'number' &&
        currentSelection.length >= rule.maxCount
      ) {
        Toast.show(`本区最多可选${rule.maxCount}个`);
        return;
      }

      // 大乐透胆拖互斥：前胆<->前拖，后胆<->后拖
      if (lotteryName === 'SuperLotto' && playMode === SuperLottoPlayEnum.DANTUO) {
        let counterpartIndex = -1;
        if (positionIndex === 0) counterpartIndex = 1; // 前胆 vs 前拖
        if (positionIndex === 1) counterpartIndex = 0;
        if (positionIndex === 2) counterpartIndex = 3; // 后胆 vs 后拖
        if (positionIndex === 3) counterpartIndex = 2;
        if (counterpartIndex >= 0) {
          const counterpart = newPositions[counterpartIndex] ?? [];
          if (counterpart.includes(number)) {
            newPositions[counterpartIndex] = counterpart.filter(
              n => n !== number,
            );
          }
        }
      }

      newPositions[positionIndex] = [...currentSelection, number];
      console.log(newPositions);
      set({positions: newPositions});
    },

    // 清空选择
    clearSelection: () => {
      const baseLength = config.rules.positionRules
        ? config.rules.positionRules.length
        : config.rules.positions || 0;
      const activeLength = get().activeRules?.length ?? baseLength;
      set({positions: [[], []], showDissmiss: false});
    },

    setShowDissmiss: (dismiss?: boolean) => {
      const showDissmiss = get().showDissmiss;
      set({showDissmiss: dismiss ?? !showDissmiss});
    },

    // 设置 positions 长度（用于普通/胆拖切换）
    setPositionsLength: (length: number) => {
      set({positions: Array.from({length}, () => [])});
    },
    setPlayMode: (playMode: SuperLottoPlayEnum) => {
      if (lotteryName !== 'SuperLotto') return;
      const length = playMode === SuperLottoPlayEnum.NORMAL ? 2 : 4;
      set({playMode, positions: Array.from({length}, () => [])});
    },

    setRules: (rules, meta) => {
      set({
        activeRules: rules,
        activePlay: meta?.play,
        activeSubPlay: meta?.subPlay,
        positions: Array.from({length: rules.length}, () => []),
      });
    },

    // 机选
    quickPick: () => {
      if (lotteryName === 'SuperLotto') {
        const playMode = get().playMode || SuperLottoPlayEnum.NORMAL;
        const rules = config.rules.positionRules ?? [];
        const pick = (count: number, range: number) => {
          const s = new Set<number>();
          while (s.size < count) s.add(Math.floor(Math.random() * range) + 1);
          return Array.from(s).sort((a, b) => a - b);
        };
        if (playMode === SuperLottoPlayEnum.NORMAL) {
          const frontRule = rules[0];
          const backRule = rules[1];
          const positions = [
            pick(5, frontRule.numberRange),
            pick(2, backRule.numberRange),
          ];
          set({positions});
          return;
        }
        const frontRule = rules[0];
        const backRule = rules[1];
        const backDanRule = rules[2];
        const backTuoRule = rules[3];
        const frontDan = pick(1, frontRule.numberRange);
        let frontTuo: number[] = [];
        while (frontTuo.length < 2) {
          const n = Math.floor(Math.random() * frontRule.numberRange) + 1;
          if (!frontDan.includes(n) && !frontTuo.includes(n)) frontTuo.push(n);
        }
        const backDan = backDanRule ? pick(1, backRule.numberRange) : [];
        let backTuo: number[] = [];
        while (backTuo.length < 2) {
          const n = Math.floor(Math.random() * backRule.numberRange) + 1;
          if (!backDan.includes(n) && !backTuo.includes(n)) backTuo.push(n);
        }
        set({
          positions: [
            frontDan.sort((a, b) => a - b),
            frontTuo.sort((a, b) => a - b),
            backDan.sort((a, b) => a - b),
            backTuo.sort((a, b) => a - b),
          ],
        });
        return;
      }

      const rules = config.rules.positionRules ?? [];
      const newPositions = rules.map(
        (rule: {minCount: number; maxCount: number; numberRange: number}) => {
          const count = Math.max(rule.minCount, 1);
          const numbers = new Set<number>();
          while (numbers.size < count) {
            const zeroBased = lotteryName === 'SevenStar';

            const n = zeroBased
              ? Math.floor(Math.random() * rule.numberRange) // 0..range-1
              : Math.floor(Math.random() * rule.numberRange) + 1; // 1..range
            numbers.add(n);
          }
          return Array.from(numbers).sort((a, b) => a - b);
        },
      );
      set({positions: newPositions});
    },

    // 构建票据
    buildTicket: async () => {
      const {positions, playMode} = get();

      // 校验
      if (lotteryName === 'SuperLotto') {
        const m = playMode || SuperLottoPlayEnum.NORMAL;
        if (m === SuperLottoPlayEnum.NORMAL) {
          if ((positions[0]?.length ?? 0) < 5) {
            Toast.show('前区至少选5个');
            return undefined;
          }
          if ((positions[1]?.length ?? 0) < 2) {
            Toast.show('后区至少选2个');
            return undefined;
          }
        } else {
          const frontDan = positions[0] ?? [];
          const frontTuo = positions[1] ?? [];
          const backDan = positions[2] ?? [];
          const backTuo = positions[3] ?? [];
          if (frontDan.length < 1 || frontDan.length > 4) {
            Toast.show('前区胆码1-4个');
            return undefined;
          }
          if (frontTuo.length < 2) {
            Toast.show('前区拖码至少2个');
            return undefined;
          }
          if (backDan.length > 1) {
            Toast.show('后区胆码最多1个');
            return undefined;
          }
          if (backTuo.length < 2) {
            Toast.show('后区拖码至少2个');
            return undefined;
          }
          // 互斥校验
          if (frontDan.some(n => frontTuo.includes(n))) {
            Toast.show('前区胆码与拖码不能相同');
            return undefined;
          }
          if (backDan.some(n => backTuo.includes(n))) {
            Toast.show('后区胆码与拖码不能相同');
            return undefined;
          }
        }
      } else {
        // 其他 position 类：按通用规则最小数量
        const rules = config.rules.positionRules ?? [];
        for (let i = 0; i < Math.min(positions.length, rules.length); i++) {
          const min = rules[i].minCount;
          if ((positions[i]?.length ?? 0) < min) {
            Toast.show(`第${i + 1}位至少选择${min}个号码`);
            return undefined;
          }
        }
      }

      const betId = await new DeviceIdGenerator().generateSnowflakeId();
      const betCount = get().getBetCount();
      const betAmount = get().getBetAmount();

      // 超级大乐透需要返回 playMode 字段
      if (lotteryName === 'SuperLotto') {
        return {
          lotteryName,
          positions,
          betId,
          betCount,
          betAmount,
          playMode,
        };
      }

      return {
        lotteryName,
        positions,
        betId,
        betCount,
        betAmount,
      };
    },

    // 计算注数
    getBetCount: () => {
      const {positions} = get();

      // 根据不同玩法计算注数
      if (lotteryName === 'SuperLotto') {
        // 大乐透有单式、复式、胆拖三种玩法
        const front = positions[0] ?? [];
        const back = positions[1] ?? [];
        const danBack = positions[2] ?? [];
        const tuoBack = positions[3] ?? [];

        // 普通(单式/复式)：仅使用前两组
        if (
          (positions[2]?.length ?? 0) === 0 &&
          (positions[3]?.length ?? 0) === 0
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

      // 其他彩种使用默认逻辑
      return positions.reduce((acc, pos) => acc * pos.length, 1);
    },

    // 计算金额
    getBetAmount: () => {
      return get().getBetCount() * config.price;
    },
  }));
}
