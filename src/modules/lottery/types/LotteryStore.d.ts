declare namespace LotteryStore {
  type LotteryResultTabsType = 'AllDigitalLottery' | 'SportDigitalLottery' | 'TraditionalDigitalLottery';


  interface LotteryResultPageState {
    selectedLotteryType: CommonCommonEnum.LotteryName | LotteryResultTabsType;
    setSelectedLotteryType: (tabIndex: CommonCommonEnum.LotteryName | LotteryResultTabsType) => void;
  }
}
