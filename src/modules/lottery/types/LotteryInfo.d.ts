declare namespace LotteryInfo {
  type BetPlayActiveTab =
    | LotteryCommon.FootballLotteryBettingType
    | LotteryCommon.BasketballLotteryBettingType
    | LotteryCommon.BeijingSingleMatchBettingType
    | LotteryCommon.DefaultBettingType;
  /**
   * 投注状态存储
   */

  interface LotteryBetInfo {
    /**
     * 当前彩种玩法
     */
    betPlayActiveTab: BetPlayActiveTab;

    /**
     * 用户选择的比赛和对应的玩法
     */
    selectedMatches: Record<string, string[]>;
    /**
     * 用户选择的倍数
     */
    multiplier: number;

    /**
     * 比赛数据
     */
    matchData: Record<string, LotteryDataSource.MatchInfo>;
 
    /**
     * 缓存数据
     */
    cache: Record<string, any>;
    /**
     * 是否要求店主上传照片
     */
    isRequirePhoto: boolean;
    /**
     * 用户选择的过关方式
     */
    selectedPassTypes: string[];
    /**
     * 过关方式选项
     */
    passTypeOptions: string[];
    /**
     * 设置当前彩种玩法
     */
    setBetPlayActiveTab: (betPlayActiveTab: BetPlayActiveTab) => void;
    /**
     * 设置用户选择的过关方式
     */
    setSelectedPassTypes: (selectedPassTypes: string[]) => void;
    /**
     * 设置过关方式选项
     */
    setPassTypeOptions: (passTypeOptions: string[]) => void;
    /**
     * 设置是否要求店主上传照片
     */
    setIsRequirePhoto: (isRequirePhoto: boolean) => void;
    /**
     * 设置比赛数据
     */
    setMatchData: (
      matchId: string,
      matchInfo: LotteryDataSource.MatchInfo,
    ) => void;
    
    /**
     * 批量设置比赛数据 - 性能优化
     */
    setMatchDataBatch: (
      matchDataBatch: Record<string, LotteryDataSource.MatchInfo>,
    ) => void;
     

    /**
     * 切换选择状态
     */
    toggleSelection: (
      matchId: string,
      oddsCellKey: string,
      maxCount?: number,
    ) => void;
 
    /**
     * 设置选中的比赛
     */
    setSelectedMatches: (selectedMatches: Record<string, string[]>) => void;
    /**
     * 设置倍数
     */
    setMultiplier: (multiplier: number) => void;
    /**
     * 重置状态
     */
    resetStore: () => void;
  }

  type OddsRangeType = 'under1.5' | '1.5to2' | 'above2';

  interface FilterState {
    // 联赛筛选
    selectedLeagues: string[];
    // 赔率范围筛选（支持多选）
    selectedOddsRanges: string[];
    // 只显示胜平负
    onlyWinDrawLose: boolean;
    // 是否显示筛选弹窗
    isFilterDialogVisible: boolean;
    // 设置是否显示筛选弹窗
    setIsFilterDialogVisible: (isFilterDialogVisible: boolean) => void;
    // actions
    setSelectedLeagues: (leagues: string[]) => void;
    toggleLeague: (league: string) => void;
    selectAllLeagues: () => void;
    unselectAllLeagues: () => void;
    selectTopFiveLeagues: () => void;

    toggleOddsRange: (range: OddsRangeType) => void;
    setOnlyWinDrawLose: (value: boolean) => void;
    setSelectedOddsRanges: (ranges: string[]) => void;
    resetSportsCompetitionFilterStore: () => void;
  }
}
