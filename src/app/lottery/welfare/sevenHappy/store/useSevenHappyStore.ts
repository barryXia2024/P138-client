import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {SevenHappyPlayEnum} from '../constants';
import {PositionRule} from 'src/app/lottery/sport/digital/lotteryTypes/configs/lotteryConfigs';
import {DeviceIdGenerator} from 'src/utils/device';
import {PositionTicket} from 'src/app/lottery/sport/digital/core';
 
import {resolveSevenHappyStrategy} from '../utils';
import { LotteryName } from '@/p138-react-common/constants/LotteryCommon';

export interface SevenHappyState<T, K> {
  positions: number[][];
  playMode?: T;
  subPlayMode?: K;
  lotteryData?: LotteryDataSource.CharityLotteryDataSource;
  omissionList: string[];
  activeRules: PositionRule[];
  setRules: (rules: PositionRule[], meta: {play: T; subPlay: K}) => void;
  setPlayMode: (playMode: T) => void;
  quickPick: (n: number) => void;
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

const createSevenHappyStore = <T, K>() => {
  return create<SevenHappyState<T, K>>()(
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
           
          if(positions[0]?.length>14){
         
              Toast.show('最多可选15个号码');
              return;
          
          }
     
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
        quickPick: (n: number) => {
          const rules = get().activeRules ?? [];
          const strat = resolveSevenHappyStrategy(rules, {
            play: get().playMode as SevenHappyPlayEnum,
            subPlay: get().subPlayMode as SevenHappyPlayEnum,
          });
          const pos = strat.quickPick(n);
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

          const play = get().playMode as SevenHappyPlayEnum;
          const subPlay = get().subPlayMode as SevenHappyPlayEnum;

          const betId = await new DeviceIdGenerator().generateSnowflakeId();
          const betCount = getBetCount();
          const betAmount = getBetAmount();

          return {
            lotteryName: LotteryName.SevenHappy,
            positions,
            betId,
            betCount,
            betAmount,
            playMode: play,
            subPlayMode:subPlay,
          };
        },

        // 计算注数
        getBetCount: () => {
          const {positions} = get();
          const rules = get().activeRules ?? [];
          const strat = resolveSevenHappyStrategy(rules, {
            play: get().playMode as SevenHappyPlayEnum,
            subPlay: get().subPlayMode as SevenHappyPlayEnum,
          });
          return strat?.getBetCount?.(positions) ?? 0;
        },
        clearSelection: () => {
          set({
            positions: [],
            playMode: SevenHappyPlayEnum.normal as T,
            subPlayMode: SevenHappyPlayEnum.normal as K,
          });
        },
        // 计算金额
        getBetAmount: () => {
          return get().getBetCount() * 2;
        },
      }),
      {
        name: 'SevenHappyBetting',
      },
    ),
  );
};

// 单例实例
let sevenHappyStoreInstance: ReturnType<
  typeof createSevenHappyStore<SevenHappyPlayEnum, SevenHappyPlayEnum>
> | null = null;

/**
 * 获取双色球store单例，并初始化
 */
export const useSevenHappyStore = () => {
  // 如果实例不存在，创建新实例
  if (!sevenHappyStoreInstance) {
    sevenHappyStoreInstance = createSevenHappyStore<
      SevenHappyPlayEnum,
      SevenHappyPlayEnum
    >();

    // 初始化默认值
    const {setPlayMode, setSubPlayMode} = sevenHappyStoreInstance.getState();
    setPlayMode(SevenHappyPlayEnum.normal);
    setSubPlayMode(SevenHappyPlayEnum.normal);
  }

  return sevenHappyStoreInstance();
};

/**
 * 重置双色球store单例（用于测试或特殊情况）
 */
export const resetSevenHappyStore = () => {
  sevenHappyStoreInstance = null;
};
