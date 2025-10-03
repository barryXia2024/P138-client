import {router} from 'expo-router';
import {saveLotteryScheme} from 'src/api/interface/orders-bet';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {useUserStore} from 'src/store';
import {PositionTicket} from '../../types';
import {sevenStarBetItem, sevenStarBetPlay} from '../utils';
import {useState} from 'react';

const playType = (
  lotteryName: CoreCommonEnum.LotteryName,
  raw: PositionTicket,
) => {
  switch (lotteryName) {
    case 'SevenStar':
      return sevenStarBetPlay(raw);
    default:
      return sevenStarBetPlay(raw);
  }
};
const getBetItem = (
  lotteryName: CoreCommonEnum.LotteryName,
  raw: PositionTicket,
) => {
  switch (lotteryName) {
    case 'SevenStar':
      return sevenStarBetItem(raw);
    default:
      return sevenStarBetItem(raw);
  }
};

const useSlip = () => {
  const {loginInfo, shopInfo} = useUserStore();
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const [ticketsMultiplier, setTicketsMultiplier] = useState<
    Record<string, number>
  >({});

  const getBetProgram = (props: {
    lotteryData: LotteryDataSource.CharityLotteryDataSource;
    tickets: PositionTicket[];
    ticketsMultiplier: Record<string, number>;
    totalAmount: number;
    chaseNumber: number;
  }) => {
    const {lotteryData, tickets, ticketsMultiplier, totalAmount, chaseNumber} =
      props;
    const betPlayArray = new Set<string>();
    const betContentDigitalLottery: ServerCoreOrder.BetContentDigitalLottery[] =
      tickets.map(raw => {
        const multiplier = ticketsMultiplier[raw.betId] || 1;
        const betPlay = playType(lotteryData.lotteryName, raw);
        betPlayArray.add(betPlay);
        return {
          betContentDigitalLotteryID: undefined,
          betPlay: betPlay,
          playType: null,
          betItem: getBetItem(
            lotteryInfo?.lotteryName as CoreCommonEnum.LotteryName,
            raw,
          ),
          betAmount: (raw.betCount * multiplier * 2).toFixed(2),
          betMultiple: multiplier,
          orderItemID: undefined,
        };
      });
    const dict: ServerCoreOrder.CreateOrderCommand = {
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
      chaseNumber,
      lotteryCategory:
        lotteryInfo?.lotteryCategory as CoreCommonEnum.LotteryCategory,

      lotteryNumber: null,
      paymentStatus: 2,
      // winStatus: null,
      commission: '0',
      optimization: '',
    };
    return dict;
  };

  const saveLotteryPlan = (props: {
    lotteryData: LotteryDataSource.CharityLotteryDataSource;
    tickets: PositionTicket[];
    ticketsMultiplier: Record<string, number>;
    totalAmount: number;
    chaseNumber: number;
  }) => {
    const dict: ServerCoreOrder.SaveSchemeCommand = getBetProgram(props);

    // 提交订单
    saveLotteryScheme(dict).then(res => {
      if (res.success) {
        router.push('/lottery/slip/betSuccess');
      }
    });
  };
  const onTicketsMultiplierChange = (multiplier: Record<string, number>) => {
    setTicketsMultiplier(multiplier);
  };

  return {
    saveLotteryPlan,
    getBetProgram,
    ticketsMultiplier,
    onTicketsMultiplierChange,
  };
};

export default useSlip;
