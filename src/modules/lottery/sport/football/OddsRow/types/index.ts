import {StyleProp, ViewStyle} from 'react-native';

export interface OddsRowProps {
  competition: LotteryDataSource.MatchInfo;
  openScore?: () => void;
}

export interface RenderOddsCellsProps {
  handicapDto: LotteryDataSource.HandicapDto;
  competition: LotteryDataSource.MatchInfo;
  oddsCellStyle: StyleProp<ViewStyle>;
  selectedMatches: Record<string, string[]>;
  toggleSelection: (
    competitionId: string,
    oddsCellKey: string,
    type: number,
  ) => void;
}

export interface HandicapRowProps {
  handicapDto: LotteryDataSource.HandicapDto;
  competition: LotteryDataSource.MatchInfo;
  oddsCellStyle: StyleProp<ViewStyle>;
  toggleSelection: (
    competitionId: string,
    oddsCellKey: string,
    type: number,
  ) => void;
  selectedMatches: Record<string, string[]>;
}

export interface ScoreButtonProps {
  competition: LotteryDataSource.MatchInfo;
  selectedMatches: Record<string, string[]>;
  onPress: () => void;
} 