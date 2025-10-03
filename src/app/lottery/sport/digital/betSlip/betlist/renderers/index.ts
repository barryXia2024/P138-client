import {SuperLottoRenderer} from './SuperLottoRenderer';
import {PositionRenderer} from './PositionRenderer';
import {DigitalTicket} from '../../../core';
import { DigitalLotteryNames } from '../../../lotteryTypes/configs/lotteryConfigs';

// 渲染器类型 - 使用泛型来支持不同类型的票据
export type TicketRenderer<T extends DigitalTicket = DigitalTicket> = React.ComponentType<{
  ticket: T;
  onRemove: (betId: string) => void;
}>;

// 渲染器注册表 - 使用类型断言来确保类型安全
export const rendererRegistry = {
  SuperLotto: SuperLottoRenderer as TicketRenderer,
  SevenStar: PositionRenderer as TicketRenderer,
} as const;

// 获取渲染器
export function getRenderer(lotteryName:DigitalLotteryNames): TicketRenderer {
  return rendererRegistry[lotteryName];
}

// 导出所有渲染器
export {SuperLottoRenderer, PositionRenderer};
