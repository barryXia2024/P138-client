declare namespace CompetitionProps {
  interface DetailBaseInfo {
    className?: string;
    style?: ViewStyle;
    onChange?: (liveUrl: string) => void;
    liveStream?: ServerCommonLive.LiveStream;
    liveInfo?: ServerCommonLive.BasketBallCompetition | ServerCommonLive.FootBallCompetition;
    // liveStreamID?: string;
  }
  interface DetailInfos {
    className?: string;
    style?: ViewStyle;
    liveStream?: ServerCommonLive.LiveStream;
    liveInfo?: ServerCommonLive.BasketBallCompetition | ServerCommonLive.FootBallCompetition;
    competitionType: ServerCommonLive.CompetitionType;
  }
  interface Information {
    home: string | number;
    away: string | number;
    label: string;
  }
  interface OddsTabProps {
    europeOddsList: any[];
    asiaOddsList: any[];
    bigSmallOddsList: any[];
    competitionId: number;
  }
  type OddsCellProps = {
    competitionOddsDtos:  LotteryDataSource.CompetitionOddsDto;
    handicapDtos: LotteryDataSource.HandicapDto;
    isLast?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    isConfirmed?: boolean; // 是否可取消
    toggleSelection: () => void;
    isSelected: boolean;
  };
  
  interface StatisticsBarProps {
    home: string | number;
    away: string | number;
    label: string;
  }
  interface RecordBoxProps {
    homeWin: number;
    draw: number;
    awayWin: number;
  }
  interface StatistiCsViewProps {
    leagueId: number;
    vsType: VS_TYPE;
    statisticType: StatisticType;
    onChange?: (data: ServerCommonLive.CompetitionRecordList) => void;
  }
  interface OddsInfoProps {
    rows: {title: string; cells: number[]}[];
  }

  interface PickBoxProps {
    width?: number;
    isHiddenGreen?: boolean;
  }

  interface CompetitionCardAdapterProps {
    competition: LotteryDataSource.MatchInfo;
    isMatchBetList?: boolean;
  }

  interface MatchCardProps {
    competition: LotteryDataSource.MatchInfo;
    isLastItem?: boolean;
    isMatchBetList?: boolean;
    isLast?: boolean;
    style?: StyleProp<ViewStyle>;
  }
}
