import {router} from 'expo-router';
import {saveLotteryScheme} from 'src/api/interface/orders-bet';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {useUserStore} from 'src/store';
import {calculatorRegistry} from '../../../calculators';
import {PositionTicket} from '../../../core';
import {ArrangedThreePlayEnum, ArrangedThreeSubPlayEnum} from '../../constants';

const playType = (item: PositionTicket) => {
  if (item.playMode === ArrangedThreePlayEnum.DirectSelection) {
    if (item.subPlayMode === ArrangedThreeSubPlayEnum.PositioningDuplex) {
      return `${ArrangedThreePlayEnum.DirectSelection}[${Number(item.betCount) === 1 ? '单式' : '复式'}]`;
    }
  }
  if (item.playMode === ArrangedThreePlayEnum.Group) {
    if (item.subPlayMode === ArrangedThreeSubPlayEnum.GroupSumValue) {
      return `${ArrangedThreePlayEnum.Group}[和值]`;
    }
    if (item.subPlayMode === ArrangedThreeSubPlayEnum.GroupTwoCode) {
      return `${ArrangedThreePlayEnum.Group}[2码全包]`;
    }
  }
  return `${item.playMode}[${item.subPlayMode}]`;
};

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
        const betPlay = playType(item);
        betPlayArray.add(betPlay);
        return {
          betContentDigitalLotteryID: undefined,
          betPlay: betPlay,
          playType: null,
          betItem: computed.betItem ?? '',
          betAmount: (item.betCount * multiplier * 2).toFixed(2),
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
      playName:betPlayArray.size === 1
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
      betAmount: (Number(totalAmount) * chaseNumber).toFixed(2),
      username: loginInfo?.username,
      needUploadTicket: true,
      lotteryIcon: lotteryInfo?.lotteryIcon as string,
      termNo: lotteryData?.currentTermNo,

      lotteryCategory:
        lotteryInfo?.lotteryCategory as CoreCommonEnum.LotteryCategory,
 
      commissionRate: '',
      lotteryNumber: null,
      paymentStatus: 2,
      // winStatus: null,
      orderType: null,
      currentOrderNo: '',
      declaration: null,
      programContent: null,
      commission: '0',
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
    const dict = getBetProgram(
      lotteryData,
      tickets,
      ticketsMultiplier,
      totalAmount,
      chaseNumber,
    );

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
