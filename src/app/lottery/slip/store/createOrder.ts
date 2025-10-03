import {LotteryName} from '@/p138-react-common/constants/LotteryCommon';
import {getBetContentSportsLotteryList} from '@/p138-react-common/utils/fuc/lottery/bet';
import dayjs from 'dayjs';
import {useMemo} from 'react';
import {
  createLotteryOrder,
  postLotteryOrder,
  saveLotteryScheme,
} from 'src/api/interface/orders-bet';

import {
  SportLotteryType,
  SportLotteryTypeEnum,
  SportPlayNameMap,
} from 'src/modules/lottery/constants';
import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';
import {useUserStore} from 'src/store';
import {formatNaNString} from 'src/utils/formatter';

export const useCreateOrder = () => {
  const {
    selectedMatches,
    multiplier,
    isRequirePhoto,
    betPlayActiveTab,
    matchData,
    selectedPassTypes,
  } = useBetInfoStore();
  const {lotteryInfo} = useLotteryInfoStore();
  const {shopInfo, loginInfo, userInfo} = useUserStore();

  const minBuyEndTime = useMemo(() => {
    return Object.keys(selectedMatches)
      .map(matchId => dayjs(matchData[matchId].buyEndTime).valueOf())
      .reduce(
        (minTime, currentTime) =>
          currentTime - minTime < 0 ? currentTime : minTime,
        Infinity,
      );
  }, [selectedMatches, matchData]);

  const betContentSportsLotteryList = useMemo(() => {
    return getBetContentSportsLotteryList(
      selectedMatches,
      matchData,
      SportPlayNameMap[betPlayActiveTab],
      lotteryInfo,
    );
  }, [selectedMatches, matchData, betPlayActiveTab, lotteryInfo]);

  const betProgramPayload = (
    betAmount: CompetionBet.BetAmount,
    play: string,
    frontEndOnly: string,
    lotteryInfo: ServerCoreLottery.ListCustomLotteryResult,
  ): ServerCoreOrder.CreateOrderCommand  => {
    const dict: ServerCoreOrder.CreateOrderCommand = {
      bettingString: selectedPassTypes.join('#'),
      shopLotteryID: lotteryInfo?.id as string,
      lotteryName: lotteryInfo?.lotteryName as CoreCommonEnum.LotteryName,
      lotteryType: lotteryInfo?.lotteryType as CoreCommonEnum.LotteryType,
      buyEndTime: dayjs(minBuyEndTime).format('YYYY-MM-DD HH:mm:ss'),
      betCount: betAmount.betsCount,
      append: '2',
      optimizationType: 1,
      bonusDetailList: null,
      single: Object.keys(selectedMatches).length === 1 ? true : false,
      betContentDigitalLottery: null,
      betContentSportsLotteryList:
        SportLotteryType[lotteryInfo?.lotteryName] ===
        SportLotteryTypeEnum.Sport
          ? betContentSportsLotteryList
          : null,
      betContentTraditionalLotteryList:
        SportLotteryType[lotteryInfo?.lotteryName] ===
        SportLotteryTypeEnum.Traditional
          ? betContentSportsLotteryList
          : null,
      playName: play,
      shopCode: shopInfo?.shopCode || 0,
      userID: loginInfo?.userID || '',
      paymentMethod: null,
      betPlay: play,
      betMultiple: multiplier,
      frontEndOnly,
      winMixAmount: (betAmount.minPayout * multiplier).toFixed(2),
      winAmount: (betAmount.maxPayout * multiplier).toFixed(2),
      betAmount: (betAmount.betsAmount * multiplier).toFixed(2),
      username: userInfo?.username,
      needUploadTicket: isRequirePhoto,
      lotteryIcon: lotteryInfo?.lotteryIcon as string,
      termNo:
        SportLotteryType[
          lotteryInfo?.lotteryName as CoreCommonEnum.LotteryName
        ] === SportLotteryTypeEnum.Traditional
          ? matchData[Object.keys(selectedMatches)[0]].termNo?.toString()
          : null,

      lotteryCategory: lotteryInfo?.lotteryCategory,

      lotteryNumber: null,
      paymentStatus: 2,

      commission: '0',
      optimization: '',
    };
    return dict;
  };

  const creatOrder = ({
    betAmount,
    play,

    frontEndOnly = '{}',
  }: {
    amount: number;
    betAmount: CompetionBet.BetAmount;
    play?: string;
    orderType?: CoreCommonEnum.OrderType;
    orderStatus?: CoreCommonEnum.OrderStatus;
    declaration?: string;
    programContent?: CoreCommonEnum.PostsOrderType;
    frontEndOnly?: string;
    commissionRate?: string;
  }) => {
    if (!lotteryInfo) {
      Toast.show('请选择彩种');
      return Promise.reject('请选择彩种');
    }
    const playName = (): string => {
      if (lotteryInfo.lotteryType === SportLotteryTypeEnum.Sport) {
        return play ?? '';
      } else if (lotteryInfo.lotteryType === SportLotteryTypeEnum.Traditional) {
        if (lotteryInfo.lotteryName === LotteryName.ChooseNine||lotteryInfo.lotteryName === LotteryName.WinLossLottery) {
          return '胜平负';
        } else if (lotteryInfo.lotteryName === LotteryName.HalfTimeFullTimeBet6||lotteryInfo.lotteryName === LotteryName.GameTotalGoalsBet4) {
          return lotteryInfo.lotteryChineseName;
        } 
        return '';
      }else{
        return '';
      }
    };
    const dict: ServerCoreOrder.CreateOrderCommand = betProgramPayload(
      betAmount,
      playName(),
      frontEndOnly,
      lotteryInfo,
    );
    console.log(dict);
    return createLotteryOrder(dict);
  };

  const creatOptimizationOrder = ({
    dict,
  }: {
    dict: ServerCoreOrder.CreateOrderCommand;
  }) => {
    if (!lotteryInfo) {
      Toast.show('请选择彩种');
      return Promise.reject('请选择彩种');
    }

    console.log('dict', dict);

    return createLotteryOrder(dict);
  };

  const creatFollowOrder = ({
    betAmount,
    play,
    orderType = 1,
    declaration,
    programContent,
    frontEndOnly = '{}',
    commissionRate = '0',
  }: {
    amount: number;
    betAmount: CompetionBet.BetAmount;
    play?: string;
    orderType?: CoreCommonEnum.OrderType;
    orderStatus?: CoreCommonEnum.OrderStatus;
    declaration?: string;
    programContent?: CoreCommonEnum.PostsOrderType;
    frontEndOnly?: string;
    commissionRate?: string;
  }) => {
    if (!lotteryInfo) {
      Toast.show('请选择彩种');
      return Promise.reject('请选择彩种');
    }
    const dict: ServerCoreOrder.PostOrderCommand = {
      bettingString: selectedPassTypes.join('#'),
      shopLotteryID: lotteryInfo?.id as string,
      lotteryName: lotteryInfo?.lotteryName as CoreCommonEnum.LotteryName,
      lotteryType: lotteryInfo?.lotteryType as CoreCommonEnum.LotteryType,
      buyEndTime: dayjs(minBuyEndTime).format('YYYY-MM-DD HH:mm:ss'),
      betCount: betAmount.betsCount,
      append: '2',
      optimizationType: 1,
      bonusDetailList: null,
      single: Object.keys(selectedMatches).length === 1 ? true : false,
      betContentDigitalLottery: null,
      betContentSportsLotteryList:
        SportLotteryType[lotteryInfo?.lotteryName] ===
        SportLotteryTypeEnum.Sport
          ? betContentSportsLotteryList
          : null,
      betContentTraditionalLotteryList:
        SportLotteryType[lotteryInfo?.lotteryName] ===
        SportLotteryTypeEnum.Traditional
          ? betContentSportsLotteryList
          : null,
      playName: formatNaNString(play) == '' ? lotteryInfo.lotteryName : play!,
      shopCode: shopInfo?.shopCode || 0,
      userID: loginInfo?.userID || '',
      paymentMethod: null,
      betPlay: formatNaNString(play) == '' ? lotteryInfo.lotteryName : play!,
      betMultiple: multiplier,
      frontEndOnly,
      winMixAmount: (betAmount.minPayout * multiplier).toFixed(2),
      winAmount: (betAmount.maxPayout * multiplier).toFixed(2),
      betAmount: (betAmount.betsAmount * multiplier).toFixed(2),
      username: userInfo?.username,
      needUploadTicket: isRequirePhoto,
      lotteryIcon: lotteryInfo?.lotteryIcon as string,
      termNo:
        SportLotteryType[
          lotteryInfo?.lotteryName as CoreCommonEnum.LotteryName
        ] === SportLotteryTypeEnum.Traditional
          ? matchData[Object.keys(selectedMatches)[0]].termNo?.toString()
          : null,

      lotteryCategory: lotteryInfo?.lotteryCategory,

      lotteryNumber: null,
      paymentStatus: 2,
      programContent,
      declaration,
      commission: commissionRate,
      commissionRate: commissionRate,
    };

    console.log(dict);
    return postLotteryOrder(dict);
  };

  const saveOrder = ({
    amount,
    betAmount,
    play,
    orderType = 1,

    declaration,
    programContent,
    frontEndOnly = '{}',
    commissionRate = '0',
  }: {
    amount: number;
    betAmount: CompetionBet.BetAmount;
    play?: string;
    orderType?: CoreCommonEnum.OrderType;
    orderStatus?: CoreCommonEnum.OrderStatus;
    declaration?: string;
    programContent?: CoreCommonEnum.PostsOrderType;
    frontEndOnly?: string;
    commissionRate?: string;
  }) => {
    const betContentSportsLotteryList: ServerCoreOrder.BetContentSportsLottery[] =
      getBetContentSportsLotteryList(
        selectedMatches,
        matchData,
        SportPlayNameMap[betPlayActiveTab],
        lotteryInfo,
      );

    const minBuyEndTime = Object.keys(selectedMatches)
      .map(matchId => dayjs(matchData[matchId].buyEndTime).valueOf())
      .reduce(
        (minTime, currentTime) =>
          currentTime - minTime < 0 ? currentTime : minTime,
        Infinity,
      );

    if (!lotteryInfo) {
      Toast.show('请选择彩种');
      return null;
    }

    const dict: ServerCoreOrder.SaveSchemeCommand = {
      bettingString: selectedPassTypes.join('#'),
      shopLotteryID: lotteryInfo?.id as string,
      lotteryName: lotteryInfo?.lotteryName as CoreCommonEnum.LotteryName,
      lotteryType: lotteryInfo?.lotteryType as CoreCommonEnum.LotteryType,
      buyEndTime: dayjs(minBuyEndTime).format('YYYY-MM-DD HH:mm:ss'),
      betCount: betAmount.betsCount,
      append: '2',
      optimizationType: 1,
      bonusDetailList: null,
      single: Object.keys(selectedMatches).length === 1 ? true : false,
      betContentDigitalLottery: null,
      betContentSportsLotteryList:
        SportLotteryType[lotteryInfo.lotteryName] === SportLotteryTypeEnum.Sport
          ? betContentSportsLotteryList
          : null,
      betContentTraditionalLotteryList:
        SportLotteryType[lotteryInfo.lotteryName] ===
        SportLotteryTypeEnum.Traditional
          ? betContentSportsLotteryList
          : null,
      playName: play ?? lotteryInfo?.lotteryName,
      shopCode: shopInfo?.shopCode || 0,
      userID: loginInfo?.userID || '',
      paymentMethod: null,
      betPlay: play ?? lotteryInfo?.lotteryName,
      betMultiple: multiplier,
      frontEndOnly,
      winMixAmount: (betAmount.minPayout * multiplier).toFixed(2),
      winAmount: (betAmount.maxPayout * multiplier).toFixed(2),
      betAmount: (amount * multiplier).toString(),
      username: userInfo?.username,
      needUploadTicket: isRequirePhoto,
      lotteryIcon: lotteryInfo?.lotteryIcon,
      termNo:
        SportLotteryType[lotteryInfo?.lotteryName] ===
        SportLotteryTypeEnum.Traditional
          ? (matchData[Object.keys(selectedMatches)[0]].termNo ?? 0)?.toString()
          : null,

      lotteryCategory: lotteryInfo?.lotteryCategory,
      commission: '0',
      commissionRate: commissionRate,
      lotteryNumber: null,
      paymentStatus: 2,

      orderType: orderType,
      currentOrderNo: '',

      declaration,
      programContent,
    };

    return saveLotteryScheme(dict);
  };

  return {creatOrder, saveOrder, creatFollowOrder, creatOptimizationOrder};
};
