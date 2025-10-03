export const matchPlayTabList: Record<
CoreCommonEnum.LotteryName,
  LotteryResult.TabList[]
> = {
  FootballLottery: [
    {label: '胜平负', key: 'result'},
    {label: '让球', key: 'jcHandicapResult', rq: 'jcHandicap'},
    {label: '比分', key: 'matchScoreResult'},
    {label: '总进球', key: 'totalScoreResult'},
    {label: '半全场', key: 'halfFullResult'},
  ],
  BasketballLottery: [
    {label: '胜负', key: 'result'},
    {label: '让分', key: 'asiaResult', rq: 'asiaHandicap'},
    {label: '大小分', key: 'bigSmallResult', rq: 'bsHandicap'},
    {label: '胜负差', key: 'pointResult'},
  ],
  DoubleBall: [],
  ArrangedFive: [],
  ArrangedThree: [],
  SuperLotto: [],
  ChooseNine: [],
  WinLossLottery: [],
  BeijingSingleMatch: [
    {label: '胜平负', key: 'jcHandicapResult'},
    {label: '总进球', key: 'totalScoreResult'},
    {label: '比分', key: 'matchScoreResult'},
    {label: '上下单双', key: 'upDownResult'},
    {label: '半全场', key: 'halfFullResult'},
    {label: '胜负过关', key: 'asiaResult'},
  ],
  SevenHappy: [],
  Happy8: [],
  Fucai3D: [],
  HalfTimeFullTimeBet6: [],
  GameTotalGoalsBet4: [],
  SevenStar: [],
  Winner: [],
  WinnerRunnerUp: [],
};

