import {useCallback} from 'react';
import {calculatorRegistry} from 'src/app/lottery/digital/calc';
import {buildProgramPayload} from 'src/app/lottery/digital/shared/programPayload';
import {AppendFlagEnum} from 'src/app/lottery/digital/shared/types';
import {saveLotteryScheme} from 'src/api/interface/orders-bet';

import {useUserStore} from 'src/store';
import {router} from 'expo-router';
import {Fucai3DTicket} from '../../core/types';
import {Fucai3DPlayEnum, Fucai3DSubPlayEnum} from '../../shared/enums';
import {useFucai3DStore} from '../../store';

export function useSlipActions(params: {
  tickets: Fucai3DTicket[];
  ticketsMultiplier: Record<string, number>;
  append: AppendFlagEnum;
  chaseNumber: number;
  lotteryData: LotteryDataSource.CharityLotteryDataSource;
  lotteryInfo: ServerCoreLottery.ListCustomLotteryResult;
  addTicket: (ticket: Fucai3DTicket) => void;
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
    const dict: ServerCoreOrder.SaveSchemeCommand = submitProgram()
    dict.chaseNumber = 1;
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
    const s = useFucai3DStore.getState();
    s.setPlayMode?.(Fucai3DPlayEnum.DirectSelection);
    s.quickPick();
    const after = useFucai3DStore.getState();
    const t: Fucai3DTicket = {
      lotteryName: 'Fucai3D',
      positions: after.positions,
      playMode: Fucai3DPlayEnum.DirectSelection,
      betCount: 1,
      betAmount: 2,
      betId: String(Date.now()),
      subPlayMode: Fucai3DSubPlayEnum.PositioningDuplex,
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
