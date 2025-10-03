import {create} from 'zustand';
import {PositionRule} from 'src/app/lottery/sport/digital/lotteryTypes/configs/lotteryConfigs';
import {DeviceIdGenerator} from 'src/utils/device';
import {PositionTicket} from 'src/app/lottery/sport/digital/core';
import {resolveHappy8Strategy} from '../utils';
import {LotteryName} from '@/p138-react-common/constants/LotteryCommon';
import {Happy8PlayEnum, QuickPickButtonEnum} from '../constants';

export interface Happy8State<T, K> {
  positions: number[][];
  playMode?: T;
  subPlayMode?: K;
  selectedPickN: number;
  lotteryData?: LotteryDataSource.CharityLotteryDataSource;
  omissionList: string[];
  activeRules: PositionRule[];
  showDissMiss: boolean;
  setShowDissMiss: (showDissMiss: boolean) => void;
  setRules: (rules: PositionRule[], meta: {play: T; subPlay: K}) => void;
  setPlayMode: (playMode: T) => void;
  setPickN: (n: number) => void;
  quickPick: (n?: number) => void;
  toggleNumber: (positionIndex: number, number: number) => void;
  setSubPlayMode: (subPlayMode: K) => void;
  setLotteryData: (
    lotteryData: LotteryDataSource.CharityLotteryDataSource,
  ) => void;
  buildTicket: () => Promise<PositionTicket | undefined>;
  getBetCount: () => number;
  getBetAmount: () => number;
  clearSelection: () => void;
  fullTuo: () => void;
}

const createHappy8Store = <T, K>() => {
  return create<Happy8State<T, K>>()((set, get) => ({
    positions: [],
    playMode: Happy8PlayEnum.normal as T,
    subPlayMode: QuickPickButtonEnum.pick1 as K,
    selectedPickN: 1,
    lotteryData: undefined,
    showDissMiss: false,
    omissionList: [],
    activeRules: [],

    toggleNumber: (positionIndex: number, number: number) => {
      const {positions, activeRules} = get();
      const newPositions = [...positions];
      const currentSelection = newPositions[positionIndex] ?? [];
      const rules = activeRules ?? [];
      const rule = rules[positionIndex];

      // 已选则取消（优先于后续所有校验，保证再次点击可取消）
      if (currentSelection.includes(number)) {
        newPositions[positionIndex] = currentSelection.filter(
          n => n !== number,
        );
        set({positions: newPositions});
        return;
      }

      // 胆拖互斥：同一号码不能同时在胆码与拖码中
      if (positions.length >0) {
        const otherIndex = positionIndex === 0 ? 1 : 0;
        const other = newPositions[otherIndex] ?? [];
        if (other.includes(number)) {
          // newPositions[otherIndex] = other.filter(n => n !== number);
          if (otherIndex === 0) {
            Toast.show('此球是胆码，不能选择为拖码');
          } else {
            Toast.show('此球是拖码，不能选择为胆码');
          }
          return;
        }
      }

      // dantuo模式下，胆码数量不能达到或超过N
      if (
        get().playMode === (Happy8PlayEnum.dantuo as unknown as T) &&
        positionIndex === 0
      ) {
        const pickN = get().selectedPickN;
        if (currentSelection.length >= Math.max(1, pickN - 1)) {
          Toast.show(`胆码最多选择${Math.max(1, pickN - 1)}个`);
          return;
        }
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

    setShowDissMiss: (showDissMiss: boolean) => {
      set({showDissMiss});
    },

    setPlayMode: playMode => {
      set({playMode, positions: []}); // 切换玩法时清空选号
    },
    setPickN: n => set({selectedPickN: n}),
    // 机选
    quickPick: (n?: number) => {
      const rules = get().activeRules ?? [];
      const targetN = n ?? get().selectedPickN;
      const strat = resolveHappy8Strategy(rules, {
        play: get().playMode as Happy8PlayEnum,
        subPlay: get().subPlayMode as Happy8PlayEnum,
        pickN: targetN,
      });
      const pos = strat.quickPick(targetN);
      set({positions: pos});
    },
    setSubPlayMode: subPlayMode => {
      set({subPlayMode, positions: []}); // 切换子玩法时清空选号
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

      const play = get().playMode as Happy8PlayEnum;
      const subPlay = get().subPlayMode as Happy8PlayEnum;

      const betId = await new DeviceIdGenerator().generateSnowflakeId();
      const betCount = getBetCount();
      const betAmount = getBetAmount();

      return {
        lotteryName: LotteryName.Happy8,
        positions,
        betId,
        betCount,
        betAmount,
        playMode: play,
        subPlayMode: subPlay,
      };
    },

    // 计算注数
    getBetCount: () => {
      const {positions} = get();
      const rules = get().activeRules ?? [];
      const strat = resolveHappy8Strategy(rules, {
        play: get().playMode as Happy8PlayEnum,
        subPlay: get().subPlayMode as Happy8PlayEnum,
        pickN: get().selectedPickN,
      });
      return strat?.getBetCount?.(positions) ?? 0;
    },
    clearSelection: () => {
      set({
        positions: [],
      });
    },
    // 计算金额
    getBetAmount: () => {
      return get().getBetCount() * 2;
    },
    // 一键全托：将未选中的号码全部设为拖码
    fullTuo: () => {
      const {positions, playMode} = get();
      if (playMode !== (Happy8PlayEnum.dantuo as unknown as T)) {
        Toast.show('仅胆拖模式支持一键全托');
        return;
      }

      const dan = positions[0] ?? [];
      if (dan.length === 0) {
        Toast.show('请先选择胆码');
        return;
      }

      // 生成1-80的所有号码，排除已选的胆码
      const allNumbers = Array.from({length: 80}, (_, i) => i + 1);
      const tuo = allNumbers.filter(n => !dan.includes(n));

      const newPositions = [...positions];
      newPositions[1] = tuo;
      set({positions: newPositions});
    },
  }));
};

// 单例实例
let happy8StoreInstance: ReturnType<
  typeof createHappy8Store<Happy8PlayEnum, QuickPickButtonEnum>
> | null = null;

/**
 * 获取双色球store单例，并初始化
 */
export const useHappy8Store = () => {
  // 如果实例不存在，创建新实例
  if (!happy8StoreInstance) {
    happy8StoreInstance = createHappy8Store<
      Happy8PlayEnum,
      QuickPickButtonEnum
    >();

    // 初始化默认值
  }

  return happy8StoreInstance();
};

/**
 * 重置双色球store单例（用于测试或特殊情况）
 */
export const resetHappy8Store = () => {
  happy8StoreInstance = null;
};
