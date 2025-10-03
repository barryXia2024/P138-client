import { create } from 'zustand';
import { ALL_LEAGUES, TOP_FIVE_LEAGUES } from '../constants/competitionDetail';


export const useSportsCompetitionFilterStore = create<LotteryInfo.FilterState>((set, get) => ({
  selectedLeagues: [],
  selectedOddsRanges: [],
  onlyWinDrawLose: false,
  isFilterDialogVisible: false,
  setIsFilterDialogVisible: (isFilterDialogVisible: boolean) =>
    set({ isFilterDialogVisible }),

  setSelectedLeagues: (leagues: string[]) => 
    set({ selectedLeagues: leagues }),

  toggleLeague: (league: string) => {
    const current = get().selectedLeagues;
    const isSelected = current.includes(league);
    set({
      selectedLeagues: isSelected 
        ? current.filter(l => l !== league)
        : [...current, league]
    });
  },
  
  selectAllLeagues: () => 
    set({ selectedLeagues: ALL_LEAGUES }),
    
  unselectAllLeagues: () => 
    set({ selectedLeagues: [] }),
    
  selectTopFiveLeagues: () => 
    set({ selectedLeagues: TOP_FIVE_LEAGUES }),

  toggleOddsRange: (range: LotteryInfo.OddsRangeType) => {
    const current = get().selectedOddsRanges;
    const isSelected = current.includes(range);
    set({
      selectedOddsRanges: isSelected
        ? current.filter(r => r !== range)
        : [...current, range]
    });
  },

  setOnlyWinDrawLose: (value: boolean) => 
    set({ onlyWinDrawLose: value }),

  setSelectedOddsRanges: (ranges: string[]) => 
    set({ selectedOddsRanges: ranges }),

  resetSportsCompetitionFilterStore: () => 
    set({
      selectedLeagues: [],
      selectedOddsRanges: [],
      onlyWinDrawLose: false,
    }),
})); 