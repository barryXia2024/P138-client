
import {ILotteryAdapter, ILotteryAdapterFactory} from './LotteryAdapter';
import {DigitalLotteryAdapter} from './DigitalLotteryAdapter';
import {PositionLotteryAdapter} from './PositionLotteryAdapter';

// 适配器工厂实现
export class LotteryAdapterFactory implements ILotteryAdapterFactory {
  private static instance: LotteryAdapterFactory;

  private constructor() {}

  static getInstance(): LotteryAdapterFactory {
    if (!LotteryAdapterFactory.instance) {
      LotteryAdapterFactory.instance = new LotteryAdapterFactory();
    }
    return LotteryAdapterFactory.instance;
  }

  createAdapter(lotteryName: CoreCommonEnum.LotteryName, store: any): ILotteryAdapter {
    // 数字彩票类型
    const digitalLotteries: CoreCommonEnum.LotteryName[] = [
      'SuperLotto', 'DoubleBall', 'Fucai3D'
    ];

    // 位置彩票类型
    const positionLotteries: CoreCommonEnum.LotteryName[] = [
      'SevenStar', 'ArrangedThree', 'ArrangedFive'
    ];

    if (digitalLotteries.includes(lotteryName)) {
      return new DigitalLotteryAdapter(store);
    }

    if (positionLotteries.includes(lotteryName)) {
      return new PositionLotteryAdapter(store);
    }

    // 默认返回数字彩票适配器
    return new DigitalLotteryAdapter(store);
  }
}

// 便捷工厂函数
export function createLotteryAdapter(lotteryName: CoreCommonEnum.LotteryName, store: any): ILotteryAdapter {
  return LotteryAdapterFactory.getInstance().createAdapter(lotteryName, store);
}
