import {router} from 'expo-router';
import {saveLotteryScheme} from 'src/api/interface/orders-bet';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {useUserStore} from 'src/store';

import {PositionTicket} from 'src/app/lottery/sport/digital/core';
import {calculatorRegistry} from 'src/app/lottery/sport/digital/calculators';
 
 

const useSlip = () => {
  const {loginInfo, shopInfo} = useUserStore();
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const getBetProgram = (
    lotteryData: LotteryDataSource.CharityLotteryDataSource,
    tickets: PositionTicket[],
    ticketsMultiplier: Record<string, number>,
    totalAmount: number,
    chaseNumber: number,
  ) => {
    const betPlayArray = new Set<string>();

    const betContentDigitalLottery: ServerCoreOrder.BetContentDigitalLottery[] =
      tickets.map(raw => {
        const item = raw;
        const gameKey = item.lotteryName;

        const calculator = calculatorRegistry[gameKey];
        const computed = calculator(item);
        const multiplier = ticketsMultiplier[item.betId] || 1;
        betPlayArray.add(computed.betPlay ?? '');
        console.log(computed.betPlay, 'computed.betPlay');
        return {
          betContentDigitalLotteryID: undefined,
          betPlay: computed.betPlay ?? '',
          playType: null,
          betItem: computed.betItem ?? '',
          betAmount: (item.betAmount * multiplier).toFixed(2),
          betMultiple: multiplier,
          orderItemID: undefined,
        };
      });
    const dict: ServerCoreOrder.SaveSchemeCommand = {
      bettingString: null,
      shopLotteryID: lotteryInfo?.id as string,
      lotteryName: lotteryInfo?.lotteryName as CoreCommonEnum.LotteryName,
      lotteryType: lotteryInfo?.lotteryType as CoreCommonEnum.LotteryType,
      buyEndTime: lotteryData?.buyEndTime as string,
      betCount: 1,
      append: '2',
      optimizationType: undefined,
      bonusDetailList: null,
      single: false,
      betContentDigitalLottery,
      betContentSportsLotteryList: null,
      betContentTraditionalLotteryList: null,
      playName: betPlayArray.size === 1
      ? (betPlayArray.values().next().value as string)
      : '混合投注',
      shopCode: shopInfo?.shopCode || 0,
      userID: loginInfo?.userID || '',
      paymentMethod: null,
      betPlay:
        betPlayArray.size === 1
          ? (betPlayArray.values().next().value as string)
          : '混合投注',
      betMultiple: 1,
      frontEndOnly: JSON.stringify({
        buyEndTime: lotteryData?.buyEndTime,
        currentTermNo: lotteryData?.currentTermNo,
        vos: lotteryData?.vos,
      }),
      winMixAmount: '0',
      winAmount: '0',
      betAmount: (Number(totalAmount) * 1).toFixed(2),
      username: loginInfo?.username,
      needUploadTicket: true,
      lotteryIcon: lotteryInfo?.lotteryIcon as string,
      termNo: lotteryData?.currentTermNo,

      lotteryCategory:
        lotteryInfo?.lotteryCategory as CoreCommonEnum.LotteryCategory,
      chaseNumber: chaseNumber,
      lotteryNumber: null,
      paymentStatus: 2,
      // winStatus: null,
      orderType: null,
      currentOrderNo: '',
      declaration: null,
      programContent: null,
      commission: '0',
      commissionRate: null,
    };
    return dict;
  };

  const saveLotteryPlan = (
    lotteryData: LotteryDataSource.CharityLotteryDataSource,
    tickets: PositionTicket[],
    ticketsMultiplier: Record<string, number>,
    totalAmount: number,
    chaseNumber: number,
  ) => {
    const betPlayArray = new Set<string>();

    const betContentDigitalLottery: ServerCoreOrder.BetContentDigitalLottery[] =
      tickets.map(raw => {
        const item = raw;
        const gameKey = item.lotteryName;

        const calculator = calculatorRegistry[gameKey];
        const computed = calculator(item);
        const multiplier = ticketsMultiplier[item.betId] || 1;
        betPlayArray.add(computed.betPlay ?? '');
        console.log(computed.betPlay, 'computed.betPlay');
        return {
          betContentDigitalLotteryID: undefined,
          betPlay: computed.betPlay,
          playType: null,
          betItem: computed.betItem ?? '',
          betAmount: (computed.betAmount * multiplier).toFixed(2),
          betMultiple: multiplier,
          orderItemID: undefined,
        };
      });
    const dict: ServerCoreOrder.SaveSchemeCommand = {
      bettingString: null,
      shopLotteryID: lotteryInfo?.id as string,
      lotteryName: lotteryInfo?.lotteryName as CoreCommonEnum.LotteryName,
      lotteryType: lotteryInfo?.lotteryType as CoreCommonEnum.LotteryType,
      buyEndTime: lotteryData?.buyEndTime as string,
      betCount: 1,
      append: '2',
      optimizationType: undefined,
      bonusDetailList: null,
      single: false,
      betContentDigitalLottery,
      betContentSportsLotteryList: null,
      betContentTraditionalLotteryList: null,
      playName: betPlayArray.size === 1
      ? (betPlayArray.values().next().value as string)
      : '混合投注',
      shopCode: shopInfo?.shopCode || 0,
      userID: loginInfo?.userID || '',
      paymentMethod: null,
      betPlay: betPlayArray.size === 1
      ? (betPlayArray.values().next().value as string)
      : '混合投注',
      betMultiple: 1,
      frontEndOnly: JSON.stringify({
        buyEndTime: lotteryData?.buyEndTime,
        currentTermNo: lotteryData?.currentTermNo,
        vos: lotteryData?.vos,
      }),
      winMixAmount: '0',
      winAmount: '0',
      betAmount: (Number(totalAmount) * chaseNumber).toFixed(2),
      username: loginInfo?.username,
      needUploadTicket: true,
      lotteryIcon: lotteryInfo?.lotteryIcon as string,
      termNo: lotteryData?.currentTermNo,

      lotteryCategory:
        lotteryInfo?.lotteryCategory as CoreCommonEnum.LotteryCategory,
      chaseNumber: chaseNumber,
      lotteryNumber: null,
      paymentStatus: 2,
      // winStatus: null,
      orderType: null,
      currentOrderNo: '',
      declaration: null,
      programContent: null,
      commission: '0',
      commissionRate: null,
    };

    // 提交订单
    saveLotteryScheme(dict).then(res => {
      if (res.success) {
        router.push('/lottery/slip/betSuccess');
      }
    });
  };

  return {
    saveLotteryPlan,
    getBetProgram,
  };
};

export default useSlip;
