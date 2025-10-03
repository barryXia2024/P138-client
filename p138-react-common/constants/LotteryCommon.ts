/**
 * 彩票名字映射
 */
export const lotteryChineseNameMap: Record<
  CoreCommonEnum.LotteryName|'All',
  CoreCommonEnum.LotteryChineseName
> = {
  All: "全部",
  FootballLottery: "竞彩足球",
  BasketballLottery: "竞彩篮球",
  DoubleBall: "双色球",
  ArrangedFive: "排列五",
  ArrangedThree: "排列三",
  SuperLotto: "大乐透",
  ChooseNine: "任选九",
  WinLossLottery: "胜负彩",
  BeijingSingleMatch: "北京单场",
  SevenHappy: "七乐彩",
  Happy8: "快乐8",
  Fucai3D: "福彩3D",
  HalfTimeFullTimeBet6: "6场半全场",
  GameTotalGoalsBet4: "4场进球彩",
  SevenStar: "七星彩",
  Winner: "冠军",
  WinnerRunnerUp: "冠亚军",

};

export type AllLotteryNameMapKey = keyof typeof lotteryChineseNameMap;
export type AllLotteryNameMapValue =
  (typeof lotteryChineseNameMap)[AllLotteryNameMapKey];
export enum LotteryName {
  FootballLottery = "FootballLottery",
  BasketballLottery = "BasketballLottery",
  BeijingSingleMatch = "BeijingSingleMatch",
  DoubleBall = "DoubleBall",
  ArrangedFive = "ArrangedFive",
  ArrangedThree = "ArrangedThree",
  SuperLotto = "SuperLotto",
  ChooseNine = "ChooseNine",
  WinLossLottery = "WinLossLottery",
  SevenHappy = "SevenHappy",
  Happy8 = "Happy8",
  Fucai3D = "Fucai3D",
  HalfTimeFullTimeBet6 = "HalfTimeFullTimeBet6",
  GameTotalGoalsBet4 = "GameTotalGoalsBet4",
  SevenStar = "SevenStar",
  Winner = "Winner",
  WinnerRunnerUp = "WinnerRunnerUp",
}
export const SportLotteryNameArray = [
  "FootballLottery",
  "BasketballLottery",
  "BeijingSingleMatch",
];
export const DigitalLotteryNameArray = [
  "DoubleBall",
  "ArrangedFive",
  "ArrangedThree",
  "SuperLotto",
  "ChooseNine",
  "WinLossLottery",
  "SevenHappy",
  "Happy8",
  "Fucai3D",
  "HalfTimeFullTimeBet6",
  "GameTotalGoalsBet4",
  "SevenStar",
  "Winner",
  "WinnerRunnerUp",
];
export const TraditionalLotteryNameArray = [
  "ChooseNine",
  "WinLossLottery",
  "HalfTimeFullTimeBet6",
  "GameTotalGoalsBet4",
  "Winner",
  "WinnerRunnerUp",
];
