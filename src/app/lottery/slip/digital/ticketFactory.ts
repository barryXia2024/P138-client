import {
  DigitalTicket,
  SevenStarTicket,
  ArrangedThreeTicket,
  ArrangedFiveTicket,
  SuperLottoTicket,
} from '../../sport/digital/core';
import {useSuperLotto} from '../../sport/digital/lotteryTypes';
import {useSevenStar} from '../../sport/digital/lotteryTypes';
import {useArrangedThree} from '../../sport/digital/lotteryTypes/arrangedThree';
import {useArrangedFive} from '../../sport/digital/lotteryTypes/arrangedFive';

// 大乐透票据构建器 - 需要传入 hook 实例
export async function buildSuperLottoTicket(
  superLottoHook: ReturnType<typeof useSuperLotto>,
  quickPickResult?: any,
): Promise<SuperLottoTicket | undefined> {
  const ticket = await superLottoHook.buildTicket(quickPickResult);

  if (!ticket) return undefined;

  return ticket;
}

// 七星彩票据构建器 - 需要传入 hook 实例
export async function buildSevenStarTicket(
  sevenStarHook: ReturnType<typeof useSevenStar>,
): Promise<SevenStarTicket | undefined> {
  const ticket = await sevenStarHook.buildTicket();
  if (!ticket) return undefined;

  return {
    lotteryName: 'SevenStar',
    positions: ticket.positions,
    betId: ticket.betId,
    betCount: ticket.betCount,
    betAmount: ticket.betAmount,
  } as SevenStarTicket;
}

// 排列三票据构建器 - 需要传入 hook 实例
export async function buildArrangedThreeTicket(
  arrangedThreeHook: ReturnType<typeof useArrangedThree>,
): Promise<ArrangedThreeTicket | undefined> {
  const ticket = await arrangedThreeHook.buildTicket();
  if (!ticket) return undefined;

  return {
    lotteryName: 'ArrangedThree',
    positions: ticket.positions,
    betId: ticket.betId,
    betCount: ticket.betCount,
    betAmount: ticket.betAmount,
  } as ArrangedThreeTicket;
}

// 排列五票据构建器 - 需要传入 hook 实例
export async function buildArrangedFiveTicket(
  arrangedFiveHook: ReturnType<typeof useArrangedFive>,
): Promise<ArrangedFiveTicket | undefined> {
  const ticket = await arrangedFiveHook.buildTicket();
  if (!ticket) return undefined;

  return {
    lotteryName: 'ArrangedFive',
    positions: ticket.positions,
    betId: ticket.betId,
    betCount: ticket.betCount,
    betAmount: ticket.betAmount,
  } as ArrangedFiveTicket;
}

// 票据构建器注册表 - 需要传入对应的 hook 实例
export const createTicketBuilders = (
  sevenStarHook: ReturnType<typeof useSevenStar>,
  arrangedThreeHook: ReturnType<typeof useArrangedThree>,
  arrangedFiveHook: ReturnType<typeof useArrangedFive>,
) =>
  ({
    superLotto: buildSuperLottoTicket,
    sevenStar: () => buildSevenStarTicket(sevenStarHook),
    arrangedThree: () => buildArrangedThreeTicket(arrangedThreeHook),
    arrangedFive: () => buildArrangedFiveTicket(arrangedFiveHook),
  }) as const;

// 统一构建接口 - 需要传入对应的 hook 实例
export async function buildTicket(
  gameType: 'superLotto' | 'sevenStar' | 'arrangedThree' | 'arrangedFive',
  superLottoHook?: ReturnType<typeof useSuperLotto>,
  sevenStarHook?: ReturnType<typeof useSevenStar>,
  arrangedThreeHook?: ReturnType<typeof useArrangedThree>,
  arrangedFiveHook?: ReturnType<typeof useArrangedFive>,
): Promise<DigitalTicket | undefined> {
  if (gameType === 'superLotto' && superLottoHook) {
    return await buildSuperLottoTicket(superLottoHook);
  }

  if (gameType === 'sevenStar' && sevenStarHook) {
    return await buildSevenStarTicket(sevenStarHook);
  }

  if (gameType === 'arrangedThree' && arrangedThreeHook) {
    return await buildArrangedThreeTicket(arrangedThreeHook);
  }

  if (gameType === 'arrangedFive' && arrangedFiveHook) {
    return await buildArrangedFiveTicket(arrangedFiveHook);
  }

  Toast.show('未知游戏类型或缺少必要的 hook 实例');
  return undefined;
}
