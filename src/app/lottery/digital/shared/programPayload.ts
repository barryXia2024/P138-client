import {MultiplierDict, AppendFlagEnum} from './types';
import {BaseTicket, DigitalLotteryName, PositionTicket} from '../core/types';

// 统一构建数字彩 SaveSchemeCommand 的 payload（仅填充数字彩相关字段）
export function buildProgramPayload(args: {
  tickets: PositionTicket[];
  ticketsMultiplier: MultiplierDict;
  append: AppendFlagEnum;
  chaseNumber: number;
  lotteryData: LotteryDataSource.CharityLotteryDataSource;
  lotteryInfo: ServerCoreLottery.ListCustomLotteryResult;
  loginInfo: ServerCoreAuth.UserSignInResult;
  calculatorRegistry: Record<
    DigitalLotteryName,
    (t: BaseTicket) => {betCount: number; betItem?: string; betPlay?: string}
  >;
}) {
  const {
    tickets,
    ticketsMultiplier,
    append,
    chaseNumber,
    lotteryData,
    lotteryInfo,
    loginInfo,
    calculatorRegistry,
  } = args;
  const betPlayArray = new Set<string>();
  const betContentDigitalLottery = tickets.map(item => {
    const gameKey = item.lotteryName;
    const calculator = calculatorRegistry[gameKey];
    const computed = calculator(item);
    const multiplier = ticketsMultiplier[item.betId] || 1;
    const perBetAmount = append === '1' ? 3 : 2;
    const totalAmount = perBetAmount * (computed.betCount || 1) * multiplier;
    betPlayArray.add(computed.betPlay ?? '');
    return {
      betContentDigitalLotteryID: undefined,
      betPlay: computed.betPlay ?? '',
      playType: null,
      betItem: computed.betItem ?? '',
      betAmount: totalAmount.toFixed(2),
      betMultiple: multiplier,
      orderItemID: undefined,
    };
  });

  const totalAmount = tickets.reduce((acc, curr) => {
    const calculator =
      calculatorRegistry[curr.lotteryName as DigitalLotteryName];
    const computed = calculator(curr);
    const multiplier = ticketsMultiplier[curr.betId] || 1;
    const perBetAmount = append === '1' ? 3 : 2;
    return acc + perBetAmount * (computed.betCount || 1) * multiplier;
  }, 0);

  const payload: ServerCoreOrder.SaveSchemeCommand = {
    bettingString: null,
    shopLotteryID: lotteryInfo?.id as string,
    lotteryName: lotteryInfo?.lotteryName as CoreCommonEnum.LotteryName,
    lotteryType: lotteryInfo?.lotteryType as CoreCommonEnum.LotteryType,
    buyEndTime: lotteryData?.buyEndTime,
    betCount: 1,
    append: append as CoreCommonEnum.AppendType,
    optimizationType: undefined,
    bonusDetailList: null,
    single: false,
    betContentDigitalLottery,
    chaseNumber: chaseNumber,
    betContentSportsLotteryList: null,
    betContentTraditionalLotteryList: null,
    playName:  betPlayArray.size === 1
    ? (betPlayArray.values().next().value as string)
    : '混合投注',
    shopCode: loginInfo?.shopCode || 0,
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
    betAmount: (totalAmount * chaseNumber).toFixed(2),
    username: loginInfo?.username,
    needUploadTicket: true,
    lotteryIcon: lotteryInfo?.lotteryIcon as string,
    termNo: lotteryData?.currentTermNo,
    lotteryCategory:
      lotteryInfo?.lotteryCategory as CoreCommonEnum.LotteryCategory,
    commissionRate: '',
    lotteryNumber: null,
    paymentStatus: 2,
    orderType: null,
    currentOrderNo: '',
    optimization: '',
    declaration: null,
    programContent: null,
    commission: '0',
  };


  console.log(payload, 'payload');
  return payload;
}
