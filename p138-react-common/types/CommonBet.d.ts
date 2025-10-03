declare namespace CommonBet {
  interface BetStore {
    /**缓存*/
    cache: BetResultCache;
    /**记录选中的比赛*/
    selectedMatches: Record<
      string, // competitionId
      string[]
    >;
    /**玩法选项卡
     * 足球 0混合 1胜平负 2猜比分 3总进球 4半全场 5猜一场
     * 篮球 0混合 ，1胜负，2大小分，3胜负差
     * 北京单场 0胜平负 1猜比分 2总进球 3半全场 4上下单双 5胜负过关*/
    activeBallPay: number; //玩法选项卡
    /** 倍数*/
    multiplier: number;
    /**选择投注*/
    toggleSelection: (
      matchId: string,
      oddsCellKey: string,
      /**最大限制*/
      maxCount?: number
    ) => // /**比赛*/
    void; // 切换选中状态
    /**设置倍数*/
    setMultiplier: (multiplier: number) => void; // 更新倍数
    /**存储比赛数据*/
    matchData: Record<string, LotteryDataSource.MatchInfo>; 
 
 
 
    /**设置比赛数据*/
    setMatchData: (
      matchId: string,
      matchInfo: LotteryDataSource.MatchInfo
    ) => void;
    /**设置按日期和赛事分组存储比赛ID*/
    setGroupedMatches: (
      date: string,
      leagueName: string,
      matchIds: string[]
    ) => void;
    /**更新玩法tab选择*/
    setActiveBallPay: (activeBallPay: number) => void;
    /**重置store*/
    resetStore: () => void;
    /**设置选中的比赛*/
    setSelectedMatches: (
      selectedMatches: Record<
        string, // competitionId
        string[]
      >
    ) => void;
  }
}
