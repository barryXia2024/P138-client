

export type MatchInfo = LotteryDataSource.MatchInfo & {
  selectedHandicapDtos: {
    [playEnglishName: string]: LotteryDataSource.CompetitionOddsDto[];
  }; // 玩法和投注项
  isConfirmed: boolean;
};
export type CacheKey = string;  
export type CacheValue = {
  betsCount: number;
  maxPayout: number;
  minPayout: number;
};

export type BetResultCache = Record<CacheKey, CacheValue>;



export type BetOption = {
  mode: '自由过关' | 'M串N'; // 投注模式
  passTypes: string[]; // 串关方式，如 ['2串1', '3串1'] 或 ['4串5']
};
export type EveryBetType = {
  matchId: string;
  playType: string;
  bet: LotteryDataSource.CompetitionOddsDto;
};

export type MatchData = {
  [matchId: string]: {
    selectedHandicapDtos: {
      [playEnglishName: string]: LotteryDataSource.CompetitionOddsDto[];
    }; // 玩法和投注项
  };
};

export type LotteryMatchListProps = {
  lotteryName: Extract<
    CommonCommonEnum.LotteryName,
    | 'FootballLottery'
    | 'BasketballLottery'
    | 'BeijingSingleMatch'
    | 'WinLossLottery'
    | 'ChooseNine'
  >;
};