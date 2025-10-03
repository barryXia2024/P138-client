import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {DoubleBallPlayEnum} from '../constants';
import {PositionRule} from 'src/app/lottery/sport/digital/lotteryTypes/configs/lotteryConfigs';
import {DeviceIdGenerator} from 'src/utils/device';
import {PositionTicket} from 'src/app/lottery/sport/digital/core';
 
import {resolveDoubleBallStrategy} from '../utils';

export interface DoubleBallState<T, K> {
  positions: number[][];
  playMode?: T;
  subPlayMode?: K;
  lotteryData?: LotteryDataSource.CharityLotteryDataSource;
  omissionList: string[];
  activeRules: PositionRule[];
  setRules: (rules: PositionRule[], meta: {play: T; subPlay: K}) => void;
  setPlayMode: (playMode: T) => void;
  quickPick: () => void;
  toggleNumber: (positionIndex: number, number: number) => void;
  setSubPlayMode: (subPlayMode: K) => void;
  setLotteryData: (
    lotteryData: LotteryDataSource.CharityLotteryDataSource,
  ) => void;
  buildTicket: () => Promise<PositionTicket | undefined>;
  getBetCount: () => number;
  getBetAmount: () => number;
  clearSelection: () => void;
}

const createDigitalBallsStore = <T, K>() => {
  return create<DoubleBallState<T, K>>()(
    persist(
      (set, get) => ({
        positions: [],
        playMode: undefined,
        subPlayMode: undefined,
        lotteryData: undefined,

        omissionList: [],
        activeRules: [],

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

        setPlayMode: playMode => {
          set({playMode});
        },
        // 机选
        quickPick: () => {
          const rules = get().activeRules ?? [];
          const strat = resolveDoubleBallStrategy(rules, {
            play: get().playMode as DoubleBallPlayEnum,
            subPlay: get().subPlayMode as DoubleBallPlayEnum,
          });
          const pos = strat.quickPick();
          set({positions: pos});
        },
        setSubPlayMode: subPlayMode => {
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
        setLotteryData: lotteryData => {
          set({lotteryData, omissionList: lotteryData.omissionList || []});
        },

        // 构建票据
        buildTicket: async () => {
          const {positions, getBetCount, getBetAmount} = get();

          // 校验
          // const rules = get().activeRules ?? [];
          // for (let i = 0; i < Math.min(positions.length, rules.length); i++) {
          //   const min = rules[i].minCount;
          //   if ((positions[i]?.length ?? 0) < min) {
          //     Toast.show(`第${i + 1}位至少选择${min}个号码`);
          //     return undefined;
          //   }
          // }

          const play = get().playMode as DoubleBallPlayEnum;
          const subPlay = get().subPlayMode as DoubleBallPlayEnum;

          const betId = await new DeviceIdGenerator().generateSnowflakeId();
          const betCount = getBetCount();
          const betAmount = getBetAmount();

          return {
            lotteryName: 'DoubleBall',
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
          const strat = resolveDoubleBallStrategy(rules, {
            play: get().playMode as DoubleBallPlayEnum,
            subPlay: get().subPlayMode as DoubleBallPlayEnum,
          });
          return strat?.getBetCount?.(positions) ?? 0;
        },
        clearSelection: () => {
          set({
            positions: [],
            playMode: DoubleBallPlayEnum.normal,
            subPlayMode: DoubleBallPlayEnum.normal,
          });
        },
        // 计算金额
        getBetAmount: () => {
          return get().getBetCount() * 2;
        },
      }),
      {
        name: 'DoubleBallBetting',
      },
    ),
  );
};

// 单例实例
let doubleBallStoreInstance: ReturnType<
  typeof createDigitalBallsStore<DoubleBallPlayEnum, DoubleBallPlayEnum>
> | null = null;

/**
 * 获取双色球store单例，并初始化
 */
export const useDoubleBallStore = () => {
  // 如果实例不存在，创建新实例
  if (!doubleBallStoreInstance) {
    doubleBallStoreInstance = createDigitalBallsStore<
      DoubleBallPlayEnum,
      DoubleBallPlayEnum
    >();

    // 初始化默认值
    const {setPlayMode, setSubPlayMode} = doubleBallStoreInstance.getState();
    setPlayMode(DoubleBallPlayEnum.normal);
    setSubPlayMode(DoubleBallPlayEnum.normal);
  }

  return doubleBallStoreInstance();
};

/**
 * 重置双色球store单例（用于测试或特殊情况）
 */
export const resetDoubleBallStore = () => {
  doubleBallStoreInstance = null;
};
