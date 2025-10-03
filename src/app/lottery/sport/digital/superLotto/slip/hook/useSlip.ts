import {router} from 'expo-router';
import {saveLotteryScheme} from 'src/api/interface/orders-bet';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {useUserStore} from 'src/store';
import {calculatorRegistry} from '../../../calculators';
import { SuperLottoTicket } from '../components/SlipItem';
 

const useSlip = () => {
  const {loginInfo, shopInfo} = useUserStore();
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);

  const getBetProgram = (program: {
    lotteryData: LotteryDataSource.CharityLotteryDataSource;
    tickets: SuperLottoTicket[];
    ticketsMultiplier: Record<string, number>;
    totalAmount: number;
  }) => {
    const {lotteryData, tickets, ticketsMultiplier, totalAmount} = program;
    const betContentDigitalLottery: ServerCoreOrder.BetContentDigitalLottery[] =
      tickets.map(raw => {
        const item = raw;
        const gameKey = item.lotteryName;

        const calculator = calculatorRegistry[gameKey];
        const computed = calculator(item);
        const multiplier = ticketsMultiplier[item.betId] || 1;
        const betPlay = raw.playMode + '[' + raw.subPlayMode + ']';
        return {
          betContentDigitalLotteryID: undefined,
          betPlay: betPlay,
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
      playName: lotteryInfo?.lotteryChineseName,
      shopCode: shopInfo?.shopCode || 0,
      userID: loginInfo?.userID || '',
      paymentMethod: null,
      betPlay: lotteryInfo?.lotteryName as string,
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

  const saveLotteryPlan = (program: {
    lotteryData: LotteryDataSource.CharityLotteryDataSource;
    tickets: SuperLottoTicket[];
    ticketsMultiplier: Record<string, number>;
    totalAmount: number;
  }) => {
    const dict = getBetProgram(program);

    // 提交订单
    saveLotteryScheme(dict).then(res => {
      if (res.success) {
        router.push({
          pathname: '/order/bet/detai',
          params: {
            orderId: res.data?.orderId,
          },
        });
      }
    });
  };

  return {
    saveLotteryPlan,
    getBetProgram,
  };
};

export default useSlip;
