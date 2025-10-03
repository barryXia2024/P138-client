import {LotteryType} from '../common/interfaces';
import {createDigitalLotteryStore, createPositionLotteryStore} from '../common/storeFactory';
import {getLotteryConfig} from './lotteryConfigs';

// 彩票注册表
interface LotteryRegistryEntry {
  type: LotteryType;
  config: any;
  storeCreator: any;
  pageRenderer: React.ComponentType<any>;
}

// 注册表存储
const registry = new Map<LotteryType, LotteryRegistryEntry>();

// 注册彩票
export function registerLottery(
  type: LotteryType,
  storeCreator: any,
  pageRenderer: React.ComponentType<any>
) {
  const config = getLotteryConfig(type);
  registry.set(type, {
    type,
    config,
    storeCreator,
    pageRenderer,
  });
}

// 获取彩票注册项
export function getLotteryEntry(type: LotteryType) {
  return registry.get(type);
}

// 获取所有已注册的彩票
export function getRegisteredLotteries() {
  return Array.from(registry.values());
}

// 批量注册默认彩票
export function registerDefaultLotteries() {
  // 大乐透
  registerLottery(
    LotteryType.SUPER_LOTTO,
    () => createDigitalLotteryStore(LotteryType.SUPER_LOTTO, {
      redRange: { min: 1, max: 35 },
      blueRange: { min: 1, max: 12 },
      price: 2,
    }),
    require('./LotteryPageRenderer').default
  );

  // 七星彩
  registerLottery(
    LotteryType.SEVEN_STAR,
    () => createPositionLotteryStore(LotteryType.SEVEN_STAR, {
      positions: 7,
      positionRules: [
        { index: 0, minCount: 1, maxCount: 1, numberRange: 10 },
        { index: 1, minCount: 1, maxCount: 1, numberRange: 10 },
        { index: 2, minCount: 1, maxCount: 1, numberRange: 10 },
        { index: 3, minCount: 1, maxCount: 1, numberRange: 10 },
        { index: 4, minCount: 1, maxCount: 1, numberRange: 10 },
        { index: 5, minCount: 1, maxCount: 1, numberRange: 10 },
        { index: 6, minCount: 1, maxCount: 1, numberRange: 15 },
      ],
      price: 2,
    }),
    require('./LotteryPageRenderer').default
  );

  // 排列三
  registerLottery(
    LotteryType.ARRANGED_THREE,
    () => createPositionLotteryStore(LotteryType.ARRANGED_THREE, {
      positions: 3,
      positionRules: [
        { index: 0, minCount: 1, maxCount: 1, numberRange: 10 },
        { index: 1, minCount: 1, maxCount: 1, numberRange: 10 },
        { index: 2, minCount: 1, maxCount: 1, numberRange: 10 },
      ],
      price: 2,
    }),
    require('./LotteryPageRenderer').default
  );

  // 排列五
  registerLottery(
    LotteryType.ARRANGED_FIVE,
    () => createPositionLotteryStore(LotteryType.ARRANGED_FIVE, {
      positions: 5,
      positionRules: [
        { index: 0, minCount: 1, maxCount: 1, numberRange: 10 },
        { index: 1, minCount: 1, maxCount: 1, numberRange: 10 },
        { index: 2, minCount: 1, maxCount: 1, numberRange: 10 },
        { index: 3, minCount: 1, maxCount: 1, numberRange: 10 },
        { index: 4, minCount: 1, maxCount: 1, numberRange: 10 },
      ],
      price: 2,
    }),
    require('./LotteryPageRenderer').default
  );
}

// 创建彩票Store实例
export function createLotteryStore(type: LotteryType) {
  const entry = getLotteryEntry(type);
  if (!entry) {
    throw new Error(`Lottery type ${type} not registered`);
  }
  return entry.storeCreator();
}

// 获取彩票页面渲染器
export function getLotteryPageRenderer(type: LotteryType) {
  const entry = getLotteryEntry(type);
  if (!entry) {
    throw new Error(`Lottery type ${type} not registered`);
  }
  return entry.pageRenderer;
}

// 初始化注册表
registerDefaultLotteries();
