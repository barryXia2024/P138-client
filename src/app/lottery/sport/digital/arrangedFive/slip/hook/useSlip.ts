import {router} from 'expo-router';
import {saveLotteryScheme} from 'src/api/interface/orders-bet';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {useUserStore} from 'src/store';
import {SuperLottoMockData} from '../../../mockdata';
import {calculatorRegistry} from '../../../calculators';
import {ArrangedFiveTicket, PositionTicket} from '../../../core';
import {ArrangedFivePlayEnum, ArrangedFiveSubPlayEnum} from '../../constants';
const getBetPlay = (
  playMode: ArrangedFivePlayEnum,
  subPlayMode: ArrangedFiveSubPlayEnum,
  betCount: number,
) => {
  if (playMode === ArrangedFivePlayEnum.DirectPositioningDuplex) {
    return betCount === 1 ? '单式[标准]' : '复式[标准]';
  }
  return '复式[' + subPlayMode + ']';
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
        const item = raw as unknown as ArrangedFiveTicket;
        const gameKey = item.lotteryName;

        const calculator = calculatorRegistry[gameKey];
        const computed = calculator(item);
        const multiplier = ticketsMultiplier[item.betId] || 1;
        const betPlay = getBetPlay(
          item.playMode,
          item.subPlayMode,
          item.betCount,
        );
        betPlayArray.add(betPlay);
        return {
          betContentDigitalLotteryID: undefined,
          betPlay: betPlay,
          playType:
            item.playMode === ArrangedFivePlayEnum.DirectPositioningDuplex
              ? null
              : item.subPlayMode,
          betItem: computed.betItem ?? '',
          betAmount: (item.betCount * multiplier*2).toFixed(2),
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
      betPlay: betPlayArray.size === 1 ? betPlayArray.values().next().value as string :'混合投注',
      betMultiple: 1,
      frontEndOnly: JSON.stringify({
        buyEndTime: lotteryData?.buyEndTime,
        currentTermNo: lotteryData?.currentTermNo,
        vos: lotteryData?.vos,
      }),
      winMixAmount: '0',
      winAmount: '0',
      chaseNumber: chaseNumber,
      betAmount: (Number(totalAmount) * chaseNumber).toFixed(2),
      username: loginInfo?.username,
      needUploadTicket: true,
      lotteryIcon: lotteryInfo?.lotteryIcon as string,
      termNo: lotteryData?.currentTermNo,

      lotteryCategory:
        lotteryInfo?.lotteryCategory as CoreCommonEnum.LotteryCategory,

      commissionRate: '0',
      lotteryNumber: null,
      paymentStatus: 2,
      // winStatus: null,
      orderType: null,
      currentOrderNo: '',
      declaration: null,
      programContent: null,
      commission: '0',
    };
    console.log(dict);
    return dict;
  };

  const saveLotteryPlan = (
   dictProgram:{
    lotteryData: LotteryDataSource.CharityLotteryDataSource,
    tickets: PositionTicket[],
    ticketsMultiplier: Record<string, number>,
    totalAmount: number,
    chaseNumber: number
   }
  ) => {
    const {lotteryData, tickets, ticketsMultiplier, totalAmount, chaseNumber} = dictProgram;
    const dict = getBetProgram(
      lotteryData,
      tickets,
      ticketsMultiplier,
      totalAmount,
      chaseNumber
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
