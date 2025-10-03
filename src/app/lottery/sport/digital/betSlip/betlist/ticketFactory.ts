import {DigitalTicket} from '../../core';
import {useSuperLottoStore, useSevenStarStore,  computeSuperLotto} from '../../lotteryTypes';

// 大乐透票据构建器
export async function buildSuperLottoTicket(): Promise<DigitalTicket | undefined> {
  const store = useSuperLottoStore.getState();
  const ticket = await store.buildTicket();
  
  if (!ticket) return undefined;
  
  // 计算注数和金额
  const {betCount, betAmount} = computeSuperLotto(ticket);
  
  return {
    ...ticket,
    betCount,
    betAmount,
  };
}

// 七星彩票据构建器
export async function buildSevenStarTicket(): Promise<DigitalTicket | undefined> {
  const store = useSevenStarStore.getState();
  return await store.buildTicket();
}

// 排列三票据构建器

// 票据构建器注册表
export const ticketBuilders = {
  superLotto: buildSuperLottoTicket,
  sevenStar: buildSevenStarTicket,
} as const;

// 统一构建接口
export async function buildTicket(gameType: keyof typeof ticketBuilders): Promise<DigitalTicket | undefined> {
  const builder = ticketBuilders[gameType];
  if (!builder) {
    Toast.show('未知游戏类型');
    return undefined;
  }
  
  return await builder();
}
