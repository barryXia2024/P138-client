export interface OddsSelectionProps {
  handicapDto: LotteryDataSource.HandicapDto;
  competitionId: string;
  lotteryName: string;
  currentConfig: any;
  isOddsSelected: (key: string) => boolean;
  toggleOddsSelection: (key: string) => void;
}

export interface RenderConfigItem {
  index: number;
  handicapDto: LotteryDataSource.HandicapDto;
  renderType: 'simple' | 'complex';
}

export interface FootballPlayMoreHookReturn {
  competitionInfo: LotteryDataSource.MatchInfo | null;
  isVisible: boolean;
  isScoreDialogVisible: boolean;
  competitionId: string | undefined;
  lotteryName: string | undefined;
  currentConfig: any;
  selectedMatches: Record<string, string[]>;
  handleClose: () => void;
  handleConfirm: (selectedOdds: string[]) => void;
  filteredHandicapDtos: LotteryDataSource.HandicapDto[];
  renderConfig: RenderConfigItem[] | null;
} 