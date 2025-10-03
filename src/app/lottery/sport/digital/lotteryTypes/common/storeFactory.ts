import {create} from 'zustand';
import {DeviceIdGenerator} from 'src/utils/device';
import {DigitalLotteryState, PositionLotteryState, LotteryStoreCreator} from './interfaces';
import { DigitalLotteryNames } from '../configs/lotteryConfigs';

// 数字彩票Store工厂
export function createDigitalLotteryStore(
  lotteryName: DigitalLotteryNames,
  config: {
    redRange: { min: number; max: number };
    blueRange: { min: number; max: number };
    price: number;
  }
): LotteryStoreCreator<DigitalLotteryState> {
  return create<DigitalLotteryState>((set, get) => {
    const deviceIdGenerator = new DeviceIdGenerator();

    return {
      // 基础状态
      mode: 'normal',
      lotteryName: lotteryName,
      red: [],
      blue: [],
      redDan: [],
      redTuo: [],
      blueDan: [],
      blueTuo: [],

      // 计算属性
      get betCount() {
        const state = get();
        if (state.mode === 'normal') {
          return state.red.length >= 5 && state.blue.length >= 2 ?
            Math.combination(state.red.length, 5) * Math.combination(state.blue.length, 2) : 0;
        } else {
          // 胆拖计算逻辑
          const redDanCount = state.redDan.length;
          const redTuoCount = state.redTuo.length;
          const blueDanCount = state.blueDan.length;
          const blueTuoCount = state.blueTuo.length;

          if (redDanCount >= 1 && redDanCount <= 4 && redTuoCount >= 2 &&
              blueDanCount >= 0 && blueDanCount <= 1 && blueTuoCount >= 2) {
            return Math.combination(redTuoCount, 5 - redDanCount) *
                   Math.combination(blueTuoCount, 2 - blueDanCount);
          }
          return 0;
        }
      },

      get betAmount() {
        return get().betCount * config.price;
      },

      // 操作方法
      setMode: (mode) => {
        set({
          mode,
          red: [],
          blue: [],
          redDan: [],
          redTuo: [],
          blueDan: [],
          blueTuo: []
        });
      },

      toggleRed: (num) => {
        const {red} = get();
        set({
          red: red.includes(num) ?
            red.filter(n => n !== num) :
            [...red, num].sort((a, b) => a - b)
        });
      },

      toggleBlue: (num) => {
        const {blue} = get();
        set({
          blue: blue.includes(num) ?
            blue.filter(n => n !== num) :
            [...blue, num].sort((a, b) => a - b)
        });
      },

      toggleRedDan: (num) => {
        const {redDan, redTuo} = get();
        if (redDan.includes(num)) {
          set({redDan: redDan.filter(n => n !== num)});
        } else if (redDan.length < 4) {
          set({
            redDan: [...redDan, num].sort((a, b) => a - b),
            redTuo: redTuo.filter(n => n !== num) // 从拖码中移除
          });
        }
      },

      toggleRedTuo: (num) => {
        const {redTuo, redDan} = get();
        if (redTuo.includes(num)) {
          set({redTuo: redTuo.filter(n => n !== num)});
        } else if (!redDan.includes(num)) { // 不在胆码中
          set({
            redTuo: [...redTuo, num].sort((a, b) => a - b)
          });
        }
      },

      toggleBlueDan: (num) => {
        const {blueDan, blueTuo} = get();
        if (blueDan.includes(num)) {
          set({blueDan: []}); // 只能选一个蓝球胆码
        } else {
          set({
            blueDan: [num],
            blueTuo: blueTuo.filter(n => n !== num)
          });
        }
      },

      toggleBlueTuo: (num) => {
        const {blueTuo, blueDan} = get();
        if (blueTuo.includes(num)) {
          set({blueTuo: blueTuo.filter(n => n !== num)});
        } else if (!blueDan.includes(num)) {
          set({
            blueTuo: [...blueTuo, num].sort((a, b) => a - b)
          });
        }
      },

      clearSelection: () => {
        set({
          red: [],
          blue: [],
          redDan: [],
          redTuo: [],
          blueDan: [],
          blueTuo: []
        });
      },

      quickPick: (count = 1) => {
        const state = get();
        if (state.mode === 'normal') {
          const redNumbers = Array.from(
            {length: config.redRange.max - config.redRange.min + 1},
            (_, i) => config.redRange.min + i
          );
          const blueNumbers = Array.from(
            {length: config.blueRange.max - config.blueRange.min + 1},
            (_, i) => config.blueRange.min + i
          );

          const newRed = Array.from({length: 5}, () =>
            redNumbers[Math.floor(Math.random() * redNumbers.length)]
          ).sort((a, b) => a - b);

          const newBlue = Array.from({length: 2}, () =>
            blueNumbers[Math.floor(Math.random() * blueNumbers.length)]
          ).sort((a, b) => a - b);

          set({red: newRed, blue: newBlue});
        } else {
          // 胆拖机选逻辑
          // 简化实现，可以根据需要扩展
          const redNumbers = Array.from(
            {length: config.redRange.max - config.redRange.min + 1},
            (_, i) => config.redRange.min + i
          );
          const blueNumbers = Array.from(
            {length: config.blueRange.max - config.blueRange.min + 1},
            (_, i) => config.blueRange.min + i
          );

          const newRedDan = [redNumbers[Math.floor(Math.random() * redNumbers.length)]];
          const newRedTuo = Array.from({length: 4}, () =>
            redNumbers[Math.floor(Math.random() * redNumbers.length)]
          ).sort((a, b) => a - b);

          const newBlueTuo = Array.from({length: 2}, () =>
            blueNumbers[Math.floor(Math.random() * blueNumbers.length)]
          ).sort((a, b) => a - b);

          set({
            redDan: newRedDan,
            redTuo: newRedTuo,
            blueDan: [],
            blueTuo: newBlueTuo
          });
        }
      },

      buildTicket: async () => {
        const state = get();
        const betId = await deviceIdGenerator.generateSnowflakeId();

        return {
          lotteryName: lotteryName,
          betId,
          betCount: state.betCount,
          betAmount: state.betAmount,
          mode: state.mode,
          red: state.red,
          blue: state.blue,
          redDan: state.redDan,
          redTuo: state.redTuo,
          blueDan: state.blueDan,
          blueTuo: state.blueTuo,
        };
      },

      createTicket: async () => {
        return get().buildTicket();
      },
    };
  });
}

// 位置式彩票Store工厂
export function createPositionLotteryStore(
  lotteryName: DigitalLotteryNames,
  config: {
    positions: number;
    positionRules: Array<{
      index: number;
      minCount: number;
      maxCount: number;
      numberRange: number;
    }>;
    price: number;
  }
): LotteryStoreCreator<PositionLotteryState> {
  return create<PositionLotteryState>((set, get) => {
    const deviceIdGenerator = new DeviceIdGenerator();

    return {
      // 基础状态
      lotteryName: lotteryName,
      positions: Array.from({length: config.positions}, () => []),

      // 计算属性
      get betCount() {
        const state = get();
        return state.positions.reduce((total, position, index) => {
          const rule = config.positionRules[index];
          if (!rule || position.length < rule.minCount || position.length > rule.maxCount) {
            return 0;
          }
          return total === 0 ? 1 : total * position.length;
        }, 0);
      },

      get betAmount() {
        return get().betCount * config.price;
      },

      // 操作方法
      toggleNumber: (positionIndex, num) => {
        const {positions} = get();
        const newPositions = [...positions];
        const position = newPositions[positionIndex];

        if (position.includes(num)) {
          newPositions[positionIndex] = position.filter(n => n !== num);
        } else {
          const rule = config.positionRules[positionIndex];
          if (rule && position.length < rule.maxCount) {
            newPositions[positionIndex] = [...position, num].sort((a, b) => a - b);
          }
        }

        set({positions: newPositions});
      },

      getPosition: (index) => {
        return get().positions[index] || [];
      },

      setPosition: (index, numbers) => {
        const {positions} = get();
        const newPositions = [...positions];
        newPositions[index] = numbers.sort((a, b) => a - b);
        set({positions: newPositions});
      },

      clearSelection: () => {
        set({
          positions: Array.from({length: config.positions}, () => [])
        });
      },

      quickPick: (count = 1) => {
        const newPositions = Array.from({length: config.positions}, (_, index) => {
          const rule = config.positionRules[index];
          if (!rule) return [];

          const numbers = Array.from({length: rule.numberRange}, (_, i) => i);
          const count = Math.floor(Math.random() * (rule.maxCount - rule.minCount + 1)) + rule.minCount;

          return Array.from({length: count}, () =>
            numbers[Math.floor(Math.random() * numbers.length)]
          ).sort((a, b) => a - b);
        });

        set({positions: newPositions});
      },

      buildTicket: async () => {
        const state = get();
        const betId = await deviceIdGenerator.generateSnowflakeId();

        return {
          lotteryName: lotteryName,
          betId,
          betCount: state.betCount,
          betAmount: state.betAmount,
          positions: state.positions,
        };
      },

      createTicket: async () => {
        return get().buildTicket();
      },
    };
  });
}

// 数学组合计算辅助函数
declare global {
  interface Math {
    combination(n: number, k: number): number;
  }
}

Math.combination = function(n: number, k: number): number {
  if (k > n || k < 0) return 0;
  if (k === 0 || k === n) return 1;

  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = result * (n - k + i) / i;
  }
  return Math.floor(result);
};
