declare namespace LotteryCommon {
  type FootballLotteryBettingType =
    | 'HHTZ'
    | 'SPF'
    | 'CBF'
    | 'ZJQ'
    | 'BQC'
    | 'C1C';
  type BasketballLotteryBettingType = 'HHTZ' | 'SP/RF' | 'DXF' | 'SFC';
  type BeijingSingleMatchBettingType =
    | 'SPF'
    | 'CBF'
    | 'ZJQ'
    | 'BQC'
    | 'SXDS'
    | 'SFGG';
    type DefaultBettingType = 'default'

  type BettingType = {
    label: CommonLottery.NewSportBallPlay;
    key:
      | FootballLotteryBettingType
      | BasketballLotteryBettingType
      | BeijingSingleMatchBettingType;
  };

  type SportLotteryName = Extract<
    CommonCommonEnum.LotteryName,
    'FootballLottery' | 'BasketballLottery' | 'BeijingSingleMatch'
  >;
  type TransSportLotteryName = Extract<
    CommonCommonEnum.LotteryName,
    | 'GameTotalGoalsBet4'
    | 'HalfTimeFullTimeBet6'
    | 'Winner'
    | 'WinnerRunnerUp'
    | 'ChooseNine'
    | 'WinLossLottery'
  >;
  type DigitLotteryName = Extract<
    CommonCommonEnum.LotteryName,
    | 'DoubleBall'
    | 'ArrangedFive'
    | 'ArrangedThree'
    | 'SuperLotto'
    | 'SevenHappy'
    | 'Happy8'
    | 'Fucai3D'
  >;
  type PlayTypeRulesConfig = {
    min: number;
    max: number;
    desc: string;
    isSingle: boolean;
    toolTip?: string;
  };

  type SportLotteryConfig = {
    chineseName: string;
    icon: string | number;
    playTypes: BettingType[];
    showSingle: boolean;
    playTypesConfig: Record<
      | LotteryCommon.FootballLotteryBettingType
      | LotteryCommon.BasketballLotteryBettingType
      | LotteryCommon.BeijingSingleMatchBettingType
      | LotteryCommon.DefaultBettingType,
      PlayTypeRulesConfig
    >;
  };

  type TraditionalLotteryConfig = {
    chineseName: string;
    icon: string | number;
    playTypes: BettingType[];
    showSingle: boolean;
    playTypesConfig: Record<
      number,
      PlayTypeRulesConfig
    >;
  };
}
