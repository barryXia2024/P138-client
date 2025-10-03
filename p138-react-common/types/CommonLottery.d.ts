declare namespace CommonLottery {
  /**开奖结果*/
  interface LotteryResult {
    /**当前选中的玩法*/
    activeTab: CommonCommonEnum.LotteryName;
    /**开奖结果*/
    lotteryResult?: LotteryDrawAnnouncement.LotteryStatisticsVo[];
    /**设置当前选中的玩法*/
    setActiveTab: (activeTab: CommonCommonEnum.LotteryName) => void;
    /**设置开奖结果*/
    setLotteryResult: (
      lotteryResult: LotteryDrawAnnouncement.LotteryStatisticsVo[]
    ) => void;
  }
  /**彩种玩法信息，用于首页获取彩种玩法信息*/
  interface LotteryTypeInfo {
    /**彩种玩法信息*/
    lotteryTypeInfo?: ServerCommonLottery.Lottery;
    /**设置彩种玩法信息*/
    setTypeInfo: (appState: ServerCommonLottery.Lottery) => void;
  }

  type NewSportBallPlay =
    | "混合"
    | "混合投注"
    | "猜一场"
    | "胜平负"
    | "让球胜平负"
    | "猜比分"
    | "总进球"
    | "半全场"
    | "胜负"
    | "让分"
    | "大小分"
    | "胜负差"
    | "上下单双"
    | "胜负/让分"
    | "胜负过关";
}
