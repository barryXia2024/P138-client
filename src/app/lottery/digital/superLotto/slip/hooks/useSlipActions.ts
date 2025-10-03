import {useCallback} from 'react';
import {calculatorRegistry} from 'src/app/lottery/digital/calc';
import {buildProgramPayload} from 'src/app/lottery/digital/shared/programPayload';
import {
  AppendFlagEnum,
} from 'src/app/lottery/digital/shared/types';
import {useSuperLottoStore} from 'src/app/lottery/digital/superLotto/store';
import {saveLotteryScheme} from 'src/api/interface/orders-bet';
import {SuperLottoPlayEnum} from 'src/app/lottery/digital/shared/enums';

import {SuperLottoTicket} from '../../../core/types';
import {useUserStore} from 'src/store';
import { router } from 'expo-router';

export function useSlipActions(params: {
  tickets: SuperLottoTicket[];
  ticketsMultiplier: Record<string, number>;
  append: AppendFlagEnum;
  chaseNumber: number;
  lotteryData: LotteryDataSource.CharityLotteryDataSource;
  lotteryInfo: ServerCoreLottery.ListCustomLotteryResult;
  addTicket: (ticket: SuperLottoTicket) => void;
 
}) {
  const {
    tickets,
    ticketsMultiplier,
    append,
    chaseNumber,
    lotteryData,
    lotteryInfo,

    addTicket,

  } = params;
  const {loginInfo} = useUserStore();

  const betTotalAmount = useCallback(() => {
    return tickets.reduce((acc, curr) => {
      const {betCount} = calculatorRegistry[curr.lotteryName](curr);
      const multiplier = ticketsMultiplier[curr.betId] || 1;
      const perBetAmount = append === AppendFlagEnum.Append ? 3 : 2;
      const totalBetAmount = perBetAmount * (betCount || 1) * multiplier;
      return acc + totalBetAmount;
    }, 0);
  }, [tickets, ticketsMultiplier, append]);

  const submitProgram = useCallback(() => {
    return buildProgramPayload({
      tickets,
      ticketsMultiplier,
      append,
      chaseNumber,
      lotteryData,
      lotteryInfo,
      loginInfo,
      calculatorRegistry,
    });
  }, [
    tickets,
    ticketsMultiplier,
    append,
    chaseNumber,
    lotteryData,
    lotteryInfo,
    loginInfo,
  ]);

  const saveLotteryPlan = useCallback(() => {
    const dict: ServerCoreOrder.SaveSchemeCommand = submitProgram() as any;
    saveLotteryScheme(dict).then(res => {
      if (res.success) {
        router.dismissAll();
        router.dismissTo({
          pathname: '/order/bet/detail',
          params: {orderId: res.data?.orderId},
        });
      }
    });
  }, [submitProgram]);

  const quickPickSuperLotto = useCallback(() => {
    const s = useSuperLottoStore.getState();
    s.setPlayMode?.(SuperLottoPlayEnum.NORMAL);
    s.quickPick();
    const after = useSuperLottoStore.getState();
    const t: SuperLottoTicket = {
      lotteryName: 'SuperLotto',
      positions: after.positions,
      playMode: SuperLottoPlayEnum.NORMAL,
      betCount: 1,
      betAmount: 2,
      betId: String(Date.now()),
    };
    addTicket(t);
    globalThis.Toast.show('已添加机选1注');
  }, [addTicket]);

  return {
    betTotalAmount,
    submitProgram,
    saveLotteryPlan,
    quickPickSuperLotto,
  };
}
