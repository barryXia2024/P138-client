import {create} from 'zustand';

interface LotteryEventStore {
  /**
   * 比分弹窗控制Model
   */
  basketballPlayMore: {
    isVisible: boolean;
    // setIsVisible:(val:boolean)=>void,
    competitionInfo: LotteryDataSource.MatchInfo | null;
    // setCompetitionInfo:(val:LotteryDataSource.MatchInfo|null)=>void,
  };

  /**
   * 足球玩法弹窗控制Model
   */
  footballPlayMore: {
    isVisible: boolean;
    isScoreDialogVisible: boolean;
    competitionInfo: LotteryDataSource.MatchInfo | null;
  };

  /**
   * 筛选弹窗控制Model
   */
  filterDialog: {
    isVisible: boolean;
    matchData: LotteryDataSource.TimeSportsLotteryResult[];
    lotteryName: CommonCommonEnum.LotteryName;
  };

  /**
   * 分析详情弹窗控制Model
   */
  showAnalysisDetails: {
    [matchId: string]: {
      isVisible: boolean;
      competitionInfo: LotteryDataSource.MatchInfo | null;
    };
  };
  playMoreDialog: {
    isVisible: boolean;
    lotteryName: CommonCommonEnum.LotteryName;
    competitionInfo: LotteryDataSource.MatchInfo | null;
    dialogType: 'score' | 'more';
  };
 
  setPlayMoreDialog: (playMoreDialog: {
    isVisible: boolean;
    lotteryName: CommonCommonEnum.LotteryName;
    competitionInfo: LotteryDataSource.MatchInfo | null;
    dialogType: 'score' | 'more';
  }) => void;

  setBasketballPlayMore: (basketballPlayMore: {
    isVisible: boolean;
    competitionInfo: LotteryDataSource.MatchInfo | null;
  }) => void;
  setFootballPlayMore: (footballPlayMore: {
    isVisible: boolean;
    isScoreDialogVisible: boolean;
    competitionInfo: LotteryDataSource.MatchInfo | null;
  }) => void;
  setFilterDialog: (filterDialog: {
    isVisible: boolean;
    matchData: LotteryDataSource.TimeSportsLotteryResult[];
    lotteryName: CommonCommonEnum.LotteryName;
  }) => void;
  setShowAnalysisDetails: (showAnalysisDetails: {
    [matchId: string]: {
      isVisible: boolean;
      competitionInfo: LotteryDataSource.MatchInfo | null;
    };
  }) => void;
}

export const useLotteryEventStore = create<LotteryEventStore>(set => ({
  basketballPlayMore: {
    isVisible: false,
    competitionInfo: null,
  },
  footballPlayMore: {
    isVisible: false,
    isScoreDialogVisible: false,
    competitionInfo: null,
  },
  filterDialog: {
    isVisible: false,
    matchData: [],
    lotteryName: 'FootballLottery',
  },
  showAnalysisDetails: {},
  playMoreDialog: {
    isVisible: false,
    lotteryName: 'FootballLottery',
    competitionInfo: null,
    dialogType: 'score',
  },
  setPlayMoreDialog: playMoreDialog => set({playMoreDialog}),
  
  setBasketballPlayMore: basketballPlayMore => set({basketballPlayMore}),
  setFootballPlayMore: footballPlayMore => set({footballPlayMore}),
  setFilterDialog: filterDialog => set({filterDialog}),
  setShowAnalysisDetails: showAnalysisDetails => set({showAnalysisDetails}),
}));
