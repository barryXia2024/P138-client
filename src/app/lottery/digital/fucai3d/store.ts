import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {DeviceIdGenerator} from 'src/utils/device';
import {UIConfig} from '../core/types';
import {Fucai3DTicket} from './core/types';
import {Fucai3DPlayEnum, Fucai3DSubPlayEnum} from './shared/enums';
import {f3dQuickPick} from './services/f3dQuickPick';
import {f3dComputeBetCount} from './calc/f3dCalculator';
import {getFucai3DUIConfig} from './config/uiConfig';
import {POSITION_RULES} from './utils/positionRules';

// 独立的规则获取函数，避免循环依赖
function getF3DRulesByMode(playMode: Fucai3DPlayEnum, subPlayMode: Fucai3DSubPlayEnum) {
  if (playMode === Fucai3DPlayEnum.DirectSelection) {
    if (subPlayMode === Fucai3DSubPlayEnum.PositioningDuplex) {
      return POSITION_RULES.threeRequired();
    }
  }
  if (playMode === Fucai3DPlayEnum.GroupThree) {
    if (subPlayMode === Fucai3DSubPlayEnum.Single) {
      return [
        POSITION_RULES.required(0),
        POSITION_RULES.required(1),
      ];
    }
    if (subPlayMode === Fucai3DSubPlayEnum.Duplex) {
      return [POSITION_RULES.singleColumn(2)];
    }
  }
  if (playMode === Fucai3DPlayEnum.GroupSix) {
    if (subPlayMode === Fucai3DSubPlayEnum.Duplex) {
      return [POSITION_RULES.singleColumn(2)];
    }
  }
  if (playMode === Fucai3DPlayEnum.OneD) {
    if (subPlayMode === Fucai3DSubPlayEnum.OneD) {
      return POSITION_RULES.threeOptional();
    }
    if (subPlayMode === Fucai3DSubPlayEnum.GuessOneD) {
      return [POSITION_RULES.singleColumn(1)];
    }
  }
  if (playMode === Fucai3DPlayEnum.TwoD) {
    if (subPlayMode === Fucai3DSubPlayEnum.TwoD) {
      return POSITION_RULES.threeOptional();
    }
    if (subPlayMode === Fucai3DSubPlayEnum.GuessTwoDDiff) {
      return [POSITION_RULES.singleColumn(3)];
    }
    if (subPlayMode === Fucai3DSubPlayEnum.GuessTwoDSame) {
      return [POSITION_RULES.singleColumn(2)];
    }
  }
  // 默认返回定位复式
  return POSITION_RULES.threeRequired();
}

function normalizeF3DPositions(playMode: Fucai3DPlayEnum, subPlayMode: Fucai3DSubPlayEnum) {
  const rules = getF3DRulesByMode(playMode, subPlayMode);
  return Array.from({length: rules.length}, () => []);
}

interface Fucai3DGameState {
  // 核心状态
  positions: number[][];
  playMode: Fucai3DPlayEnum;
  subPlayMode: Fucai3DSubPlayEnum;
  showMissNumbers: boolean;
  lotteryDrawData?: LotteryDataSource.CharityLotteryDataSource;

  // 玩法操作
  setPlayMode: (mode: Fucai3DPlayEnum) => void;
  setSubPlayMode: (subMode: Fucai3DSubPlayEnum) => void;

  // 选号操作
  toggleNumber: (positionIndex: number, number: number) => void;
  clearSelection: () => void;
  quickPick: () => void;
  applyQuickPickCount: (count: number) => void;

  // 遗漏功能
  onMiss: () => void;

  // 验证和计算
  validate: () => {valid: boolean; message?: string};
  getBetCount: () => number;
  getBetAmount: () => number;

  // 票据构建
  buildTicket: () => Promise<Fucai3DTicket | undefined>;

  // UI 配置
  setLotteryData: (data: LotteryDataSource.CharityLotteryDataSource) => void;
  getUIConfig: () => UIConfig;
  
  // 内部方法
  getF3DRulesByMode: (playMode: Fucai3DPlayEnum, subPlayMode: Fucai3DSubPlayEnum) => any[];
  validateF3DPositions: (playMode: Fucai3DPlayEnum, subPlayMode: Fucai3DSubPlayEnum, positions: number[][]) => string | null;
  normalizeF3DPositions: (playMode: Fucai3DPlayEnum, subPlayMode: Fucai3DSubPlayEnum) => number[][];
}

export const useFucai3DStore = create<Fucai3DGameState>()(
  persist(
    (set, get) => ({
      // 初始状态
      positions: normalizeF3DPositions(
        Fucai3DPlayEnum.DirectSelection,
        Fucai3DSubPlayEnum.PositioningDuplex,
      ),
      playMode: Fucai3DPlayEnum.DirectSelection,
      subPlayMode: Fucai3DSubPlayEnum.PositioningDuplex,
      showMissNumbers: false,
      lotteryDrawData: undefined,

      // 玩法切换
      setPlayMode: (mode: Fucai3DPlayEnum) => {
        const newSubMode =
          mode === Fucai3DPlayEnum.DirectSelection
            ? Fucai3DSubPlayEnum.PositioningDuplex
            : Fucai3DSubPlayEnum.Single;
        set({
          playMode: mode,
          subPlayMode: newSubMode,
          positions: normalizeF3DPositions(mode, newSubMode),
          showMissNumbers: false,
        });
      },

      setSubPlayMode: (subMode: Fucai3DSubPlayEnum) => {
        set({
          subPlayMode: subMode,
          positions: normalizeF3DPositions(get().playMode, subMode),
          showMissNumbers: false,
        });
      },

      // 选号操作
      toggleNumber: (positionIndex: number, number: number) => {
        const {positions, playMode, subPlayMode} = get();
        const newPositions = [...positions];
        const currentSelection = newPositions[positionIndex] ?? [];

        // 取消选择
        if (currentSelection.includes(number)) {
          newPositions[positionIndex] = currentSelection.filter(
            n => n !== number,
          );
          set({positions: newPositions});
          return;
        }

        // 检查最大数量限制

        // 组三单式：重号和单号不能相同
        if (
          playMode === Fucai3DPlayEnum.GroupThree &&
          subPlayMode === Fucai3DSubPlayEnum.Single
        ) {
          if (positionIndex === 0) {
            // 重号
            const single = newPositions[1] ?? [];
            if (single.includes(number)) {
              Toast.show('重号和单号不能相同');

              return;
            }
          } else if (positionIndex === 1) {
            // 单号
            const heavy = newPositions[0] ?? [];
            if (heavy.includes(number)) {
              Toast.show('重号和单号不能相同');
              return;
            }
          }
       
           
          newPositions[positionIndex] = [ number];
          set({positions: newPositions});
          return;
        }

        // 1D-1D：只能在一个区选择号码
        if (
          playMode === Fucai3DPlayEnum.OneD &&
          subPlayMode === Fucai3DSubPlayEnum.OneD
        ) {
          const otherPositions = newPositions.filter(
            (_, idx) => idx !== positionIndex,
          );
          const hasOtherSelection = otherPositions.some(pos => pos.length > 0);
          if (hasOtherSelection) {
            const np = newPositions.map((_,index) => index !== positionIndex ? [] : [number]);
            
            // newPositions[positionIndex] = [ number];
            set({positions: np});
            return;
          }
        }

        // 2D-2D：最多只能选择2个区
        if (
          playMode === Fucai3DPlayEnum.TwoD &&
          subPlayMode === Fucai3DSubPlayEnum.TwoD
        ) {
          const selectedPositions = newPositions.filter(pos => pos.length > 0);
          if (selectedPositions.length >= 2 && currentSelection.length === 0) {
            Toast.show('只能选择百位或十位或个位中的两位');
            return;
          }
        }
        // if (currentSelection.length >= rule.maxCount) {
        //   Toast.show(`本区最多可选${rule.maxCount}个`);
        //   return;
        //         }
        newPositions[positionIndex] = [...currentSelection, number];
        set({positions: newPositions});
      },

      clearSelection: () => {
        set({
          positions: normalizeF3DPositions(get().playMode, get().subPlayMode),
        });
      },

      // 机选
      quickPick: () => {
        const {playMode, subPlayMode} = get();
        const quickPickResult = f3dQuickPick(playMode, subPlayMode);
        const currentPositions = get().positions;
        
        // 确保机选结果的长度与当前positions长度一致
        const adjustedResult = Array.from({length: currentPositions.length}, (_, index) => {
          return quickPickResult[index] || [];
        });
        
        set({positions: adjustedResult});
      },

      // 应用快速选号数量（用于单列玩法：如 组三/组六 复式）
      applyQuickPickCount: (count: number) => {
        const {playMode, subPlayMode} = get();
        const rules = getF3DRulesByMode(playMode, subPlayMode);
        if (rules.length === 0) return;
        const firstRule = rules[0];
        const maxCount =
          typeof firstRule.maxCount === 'number' ? firstRule.maxCount : count;
        const numberRange =
          typeof firstRule.numberRange === 'number'
            ? firstRule.numberRange
            : 10;
        const finalCount = Math.max(0, Math.min(count, maxCount, numberRange));
    
 
       
     
      
     
      
        // 随机取不重复的 finalCount 个数
        const pool = Array.from({ length: numberRange }, (_, i) => i);
        const selection: number[] = [];
        while (selection.length < finalCount && pool.length > 0) {
          const idx = Math.floor(Math.random() * pool.length);
          selection.push(pool[idx]);
          pool.splice(idx, 1); // 删除已选，避免重复
        }
      
        const newPositions = Array.from({ length: rules.length }, (_, idx) =>
          idx === 0 ? selection : [],
        );
      
        set({ positions: newPositions });
      },

      // 遗漏功能
      onMiss: () => {
        set({showMissNumbers: !get().showMissNumbers});
      },

      // 验证
      validate: () => {
        const {positions, playMode, subPlayMode} = get();
        const msg = get().validateF3DPositions(playMode, subPlayMode, positions);
        if (msg) return {valid: false, message: msg};
        return {valid: true};
      },

      // 计算注数
      getBetCount: () => {
        const {positions, playMode, subPlayMode} = get();
        const ticket: Fucai3DTicket = {
          lotteryName: 'Fucai3D',
          betId: 'temp',
          betAmount: 0,
          betCount: 0,
          positions,
          playMode,
          subPlayMode,
        };
        return f3dComputeBetCount(ticket);
      },

      getBetAmount: () => {
        return get().getBetCount() * 2;
      },

      // 票据构建
      buildTicket: async () => {
        const validation = get().validate();
        if (!validation.valid) {
          Toast.show(validation.message || '请完成选号');
          return undefined;
        }

        const betId = await new DeviceIdGenerator().generateSnowflakeId();
        const {positions, playMode, subPlayMode} = get();

        return {
          lotteryName: 'Fucai3D',
          betId,
          betAmount: get().getBetAmount(),
          betCount: get().getBetCount(),
          positions,
          playMode,
          subPlayMode,
        };
      },

      setLotteryData: (
        lotteryData: LotteryDataSource.CharityLotteryDataSource,
      ) => {
        set({lotteryDrawData: lotteryData});
      },

      getUIConfig: () => getFucai3DUIConfig(get().playMode, get().subPlayMode),
      
      // 内部方法实现
      getF3DRulesByMode: (playMode: Fucai3DPlayEnum, subPlayMode: Fucai3DSubPlayEnum) => {
        return getF3DRulesByMode(playMode, subPlayMode);
      },
      
      validateF3DPositions: (playMode: Fucai3DPlayEnum, subPlayMode: Fucai3DSubPlayEnum, positions: number[][]) => {
        const rules = getF3DRulesByMode(playMode, subPlayMode);
        
        // 长度校验
        if (positions.length !== rules.length) return '选号位数不正确';
        
        // 最小/最大限制
        for (let i = 0; i < rules.length; i++) {
          const r = rules[i];
          const len = positions[i]?.length ?? 0;
          if (len < r.minCount) return `第${i + 1}位至少选择${r.minCount}个号码`;
          if (len > r.maxCount) return `第${i + 1}位最多选择${r.maxCount}个号码`;
        }
        
        return null;
      },
      
      normalizeF3DPositions: (playMode: Fucai3DPlayEnum, subPlayMode: Fucai3DSubPlayEnum) => {
        return normalizeF3DPositions(playMode, subPlayMode);
      },
    }),
    {
      name: 'Fucai3D-Game-Store',
    },
  ),
);
