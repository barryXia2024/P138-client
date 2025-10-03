// 统一彩票类型架构导出

// 适配器相关
export {ILotteryAdapter, ILotteryAdapterFactory} from './LotteryAdapter';
export {DigitalLotteryAdapter} from './DigitalLotteryAdapter';
export {PositionLotteryAdapter} from './PositionLotteryAdapter';
export {LotteryAdapterFactory, createLotteryAdapter} from './LotteryAdapterFactory';

// Store 工厂
export {createDigitalLotteryStore, createPositionLotteryStore} from './storeFactory';

