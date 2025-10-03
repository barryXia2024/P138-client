import { lotteryChineseNameMap } from "@/p138-react-common/constants/LotteryCommon";
import { LotteryIconMap } from "./LotteryCommon";

 
// 足球玩法类型
export const FOOTBALL_BETTING_TYPES: LotteryCommon.BettingType[] = [
  {label: '混合投注', key: 'HHTZ'},
  {label: '胜平负', key: 'SPF'},
  {label: '猜比分', key: 'CBF'},
  {label: '总进球', key: 'ZJQ'},
  {label: '半全场', key: 'BQC'},
  {label: '猜一场', key: 'C1C'},
];

// 篮球玩法类型
export const BASKETBALL_BETTING_TYPES: LotteryCommon.BettingType[] = [
  {label: '混合投注', key: 'HHTZ'},
  {label: '胜负/让分', key: 'SP/RF'},
  {label: '大小分', key: 'DXF'},
  {label: '胜负差', key: 'SFC'},
];

// 北京单场玩法类型
export const BEIJING_SINGLE_BETTING_TYPES: LotteryCommon.BettingType[] = [
  {label: '胜平负', key: 'SPF'},
  {label: '猜比分', key: 'CBF'},
  {label: '总进球', key: 'ZJQ'},
  {label: '半全场', key: 'BQC'},
  {label: '上下单双', key: 'SXDS'},
  {label: '胜负过关', key: 'SFGG'},
];

// 玩法类型映射
export const SportBettingPlaysMap: Record<
  LotteryCommon.SportLotteryName,
  LotteryCommon.BettingType[]
> = {
  FootballLottery: FOOTBALL_BETTING_TYPES,
  BasketballLottery: BASKETBALL_BETTING_TYPES,
  BeijingSingleMatch: BEIJING_SINGLE_BETTING_TYPES,
};

export const BETTING_MESSAGES = {
  MINIMUM_SELECTION: '至少选择1场单关或任意2场比赛',
  MINIMUM_SELECTION_BJ_SFGG: '至少要选择任意3场比赛',
  MINIMUM_SELECTION_CHOOSE_9: '至少选择9比赛',
  MINIMUM_SELECTION_GAME_TOTAL_GOALS_BET_4: '选择全部4场主队与客队进行投注',
  MINIMUM_SELECTION_HALF_TIME_FULL_TIME_BET_6: '选择全部6场主队与客队进行投注',

  DUPLICATE_BETTING: '只允许一场比赛多个玩法',
} as const;

// 路由路径常量
export const ROUTE_PATHS = {
  BETTING_SLIP: '/lottery/slip/sport',
  GAME_RULE: '/lottery/rule',
  HELP: '/lottery/sport/help',
} as const;

//彩种类型
export const SportLotteryType: Record<
CoreCommonEnum.LotteryName,
CoreCommonEnum.LotteryType
> = {
  FootballLottery: 2,
  BasketballLottery: 2,
  BeijingSingleMatch: 2,
  WinLossLottery: 3,
  ChooseNine: 3,
  DoubleBall: 1,
  ArrangedFive: 1,
  ArrangedThree: 1,
  SuperLotto: 1,
  SevenHappy: 1,
  Happy8: 1,
  Fucai3D: 1,
  HalfTimeFullTimeBet6: 3,
  GameTotalGoalsBet4: 3,
  SevenStar: 1,
  Winner: 3,
  WinnerRunnerUp: 3,
};

export const LotteryBottomDescMap: Record<
  CoreCommonEnum.LotteryName,
  string
> = {
  BeijingSingleMatch: '至少选择1场单关或任意2场比赛',
  FootballLottery: '至少选择1场单关或任意2场比赛',
  BasketballLottery: '至少选择1场单关或任意2场比赛',
  WinLossLottery: '至少选择14场比赛',
  ChooseNine: '至少选择9比赛',
  GameTotalGoalsBet4: '选择全部4场主队与客队进行投注',
  HalfTimeFullTimeBet6: '选择全部6场主队与客队进行投注',
  DoubleBall: '选择全部2场主队与客队进行投注',
  ArrangedFive: '选择全部5场比赛',
  ArrangedThree: '选择全部3场比赛',
  SuperLotto: '选择全部5场比赛',

  SevenHappy: '',
  Happy8: '',
  Fucai3D: '',
  SevenStar: '',
  Winner: '',
  WinnerRunnerUp: '',
};

export const LotteryHandicapDtosNameArray: Record<
CoreCommonEnum.LotteryName,
CoreCommonEnum.PlayEnglishName[]
> = {
  BeijingSingleMatch: [
    'S_PF$PLAY',
    'Q_CBF$PLAY',
    'Z_JQ$PLAY',
    'S_FGG$PLAY',
    'B_QC$PLAY',
    'Q_CBF$PLAY',
  ],
  GameTotalGoalsBet4: [
    'S_PF$PLAY',
    'Q_CBF$PLAY',
    'Z_JQ$PLAY',
    'S_FGG$PLAY',
    'B_QC$PLAY',
    'Q_CBF$PLAY',
  ],
  DoubleBall: [],
  ArrangedFive: [],
  ArrangedThree: [],
  SuperLotto: [],
  ChooseNine: [],
  WinLossLottery: [],
  FootballLottery: [],
  BasketballLottery: [],
  SevenHappy: [],
  Happy8: [],
  Fucai3D: [],
  HalfTimeFullTimeBet6: [],
  SevenStar: [],
  Winner: [],
  WinnerRunnerUp: [],
};

const createPlayTypesConfig = (
  keys:
    | LotteryCommon.FootballLotteryBettingType[]
    | LotteryCommon.BasketballLotteryBettingType[]
    | LotteryCommon.BeijingSingleMatchBettingType[]
    | LotteryCommon.DefaultBettingType[],
  defaultConfig: Partial<LotteryCommon.PlayTypeRulesConfig>,
  customConfigMap?: Record<string, Partial<LotteryCommon.PlayTypeRulesConfig>>,
): LotteryCommon.SportLotteryConfig['playTypesConfig'] => {
  return keys.reduce((acc, key) => {
    const custom = customConfigMap?.[key] || {};
    acc[key] = {
      isSingle: custom.isSingle ?? defaultConfig.isSingle ?? false,
      min: custom.min ?? defaultConfig.min ?? 1,
      max: custom.max ?? defaultConfig.max ?? 8,
      desc: custom.desc ?? defaultConfig.desc ?? '至少选1场单关或任意2场比赛',
    };
    return acc;
  }, {} as LotteryCommon.SportLotteryConfig['playTypesConfig']);
};
export const SportPlayNameMap: Record<
  | LotteryCommon.FootballLotteryBettingType
  | LotteryCommon.BasketballLotteryBettingType
  | LotteryCommon.BeijingSingleMatchBettingType
  | LotteryCommon.DefaultBettingType,
  string
> = {
  HHTZ: '混合投注',
  SPF: '胜平负',
  CBF: '猜比分',
  ZJQ: '总进球',
  BQC: '半全场',
  C1C: '猜一场',
  'SP/RF': '胜负/让分',
  DXF: '大小分',
  SFC: '胜负差',
  SXDS: '上下单双',
  SFGG: '胜负过关',
  default: '',
};

 const getSportsLotteryConfig = (): Record<
  CoreCommonEnum.LotteryName,
  LotteryCommon.SportLotteryConfig
> => {
 console.log(lotteryChineseNameMap)
  return {
    FootballLottery: {
      chineseName: lotteryChineseNameMap.FootballLottery,
      icon: LotteryIconMap['FootballLottery'],
      playTypes: FOOTBALL_BETTING_TYPES,
      showSingle: true,
      playTypesConfig: createPlayTypesConfig(
        ['HHTZ', 'SPF', 'CBF', 'ZJQ', 'BQC', 'C1C'],
        {min: 1, max: 8, desc: '至少选1场单关或任意2场比赛', isSingle: false},
        {
          CBF: {isSingle: true},
          ZJQ: {isSingle: true},
          BQC: {isSingle: true},
          C1C: {isSingle: true},
        },
      ),
    },
    BasketballLottery: {
      chineseName: lotteryChineseNameMap.BasketballLottery,
      icon: LotteryIconMap['BasketballLottery'],
      playTypes: BASKETBALL_BETTING_TYPES,
      showSingle: true,
      playTypesConfig: createPlayTypesConfig(
        ['HHTZ', 'SP/RF', 'DXF', 'SFC'],
        {min: 1, max: 8, desc: '至少选1场单关或任意2场比赛', isSingle: false},
        {
          CBF: {isSingle: true},
          ZJQ: {isSingle: true},
          BQC: {isSingle: true},
          C1C: {isSingle: true},
        },
      ),
    },
    BeijingSingleMatch: {
      chineseName: lotteryChineseNameMap.BeijingSingleMatch,
      icon: LotteryIconMap['BeijingSingleMatch'],
      playTypes: BEIJING_SINGLE_BETTING_TYPES,
      showSingle: true,
      playTypesConfig: createPlayTypesConfig(
        ['SPF', 'CBF', 'ZJQ', 'BQC', 'SXDS', 'SFGG'],
        {
          min: 1,
          max: 8,
          desc: '至少选1场单关或任意2场比赛',
          isSingle: true,
          toolTip: '北单赛前赔率仅供参考，请以开奖后实际赔率为准',
        },
        {
          SFGG: {isSingle: false, min: 3, max: 3, desc: '至少要选择任意3场比赛'},
        },
      ),
    },
    ChooseNine: {
      chineseName: lotteryChineseNameMap.ChooseNine,
      icon: LotteryIconMap['ChooseNine'],
      playTypes: BEIJING_SINGLE_BETTING_TYPES,
      showSingle: true,
      playTypesConfig: createPlayTypesConfig(['default'], {
        min: 1,
        max: 8,
        desc: LotteryBottomDescMap.ChooseNine,
        isSingle: false,
      }),
    },
    WinLossLottery: {
      chineseName: lotteryChineseNameMap.WinLossLottery,
      icon: LotteryIconMap['WinLossLottery'],
      playTypes: BEIJING_SINGLE_BETTING_TYPES,
      showSingle: true,
      playTypesConfig: createPlayTypesConfig(['default'], {
        min: 14,
        max: 14,
        desc: LotteryBottomDescMap.WinLossLottery,
        isSingle: false,
      }),
    },
    HalfTimeFullTimeBet6: {
      chineseName: lotteryChineseNameMap.HalfTimeFullTimeBet6,
      icon: LotteryIconMap['HalfTimeFullTimeBet6'],
      playTypes: BEIJING_SINGLE_BETTING_TYPES,
      showSingle: true,
      playTypesConfig: createPlayTypesConfig(['default'], {
        min: 1,
        max: 8,
        desc: LotteryBottomDescMap.HalfTimeFullTimeBet6,
        isSingle: true,
      }),
    },
    GameTotalGoalsBet4: {
      chineseName: lotteryChineseNameMap.GameTotalGoalsBet4,
      icon: LotteryIconMap['GameTotalGoalsBet4'],
      playTypes: BEIJING_SINGLE_BETTING_TYPES,
      showSingle: true,
      playTypesConfig: createPlayTypesConfig(['default'], {
        min: 1,
        max: 8,
        desc: LotteryBottomDescMap.GameTotalGoalsBet4,
        isSingle: true,
      }),
    },
    Winner: {
      chineseName: lotteryChineseNameMap.Winner,
      icon: LotteryIconMap['Winner'],
      playTypes: BEIJING_SINGLE_BETTING_TYPES,
      showSingle: true,
      playTypesConfig: createPlayTypesConfig(['default'], {
        min: 1,
        max: 8,
        desc: '至少选1场单关或任意2场比赛',
        isSingle: true,
      }),
    },
    WinnerRunnerUp: {
      chineseName: lotteryChineseNameMap.WinnerRunnerUp,
      icon: LotteryIconMap['WinnerRunnerUp'],
      playTypes: BEIJING_SINGLE_BETTING_TYPES,
      showSingle: true,
      playTypesConfig: createPlayTypesConfig(['default'], {
        min: 1,
        max: 8,
        desc: '至少选1场单关或任意2场比赛',
        isSingle: true,
      }),
    },
    DoubleBall: {
      chineseName: lotteryChineseNameMap.DoubleBall,
      icon: LotteryIconMap['DoubleBall'],
      playTypes: [],
      showSingle: false,
      playTypesConfig: {} as LotteryCommon.SportLotteryConfig['playTypesConfig'],
    },
    ArrangedFive: {
      chineseName: lotteryChineseNameMap.ArrangedFive,
      icon: LotteryIconMap['ArrangedFive'],
      playTypes: [],
      showSingle: false,
      playTypesConfig: {} as LotteryCommon.SportLotteryConfig['playTypesConfig'],
    },
    ArrangedThree: {
      chineseName: lotteryChineseNameMap.ArrangedThree,
      icon: LotteryIconMap['ArrangedThree'],
      playTypes: [],
      showSingle: false,
      playTypesConfig: {} as LotteryCommon.SportLotteryConfig['playTypesConfig'],
    },
    SuperLotto: {
      chineseName: lotteryChineseNameMap.SuperLotto,
      icon: LotteryIconMap['SuperLotto'],
      playTypes: [],
      showSingle: false,
      playTypesConfig: createPlayTypesConfig(
        ['HHTZ', 'SPF', 'CBF', 'ZJQ', 'BQC', 'C1C'],
        {min: 1, max: 8, desc: '至少选1场单关或任意2场比赛', isSingle: false},
        {
          CBF: {isSingle: true},
          ZJQ: {isSingle: true},
          BQC: {isSingle: true},
          C1C: {isSingle: true},
        },
      ),
    },
    SevenHappy: {
      chineseName: lotteryChineseNameMap.SevenHappy,
      icon: LotteryIconMap['SevenHappy'],
      playTypes: [],
      showSingle: false,
      playTypesConfig: {} as LotteryCommon.SportLotteryConfig['playTypesConfig'],
    },
    Happy8: {
      chineseName: lotteryChineseNameMap.Happy8,
      icon: LotteryIconMap['Happy8'],
      playTypes: [],
      showSingle: false,
      playTypesConfig: {} as LotteryCommon.SportLotteryConfig['playTypesConfig'],
    },
    Fucai3D: {
      chineseName: lotteryChineseNameMap.Fucai3D,
      icon: LotteryIconMap['Fucai3D'],
      playTypes: [],
      showSingle: false,
      playTypesConfig: {} as LotteryCommon.SportLotteryConfig['playTypesConfig'],
    },
    SevenStar: {
      chineseName: lotteryChineseNameMap.SevenStar,
      icon: LotteryIconMap['SevenStar'],
      playTypes: [],
      showSingle: false,
      playTypesConfig: {} as LotteryCommon.SportLotteryConfig['playTypesConfig'],
    },
  };
};


export const SportsLotteryConfig = getSportsLotteryConfig();