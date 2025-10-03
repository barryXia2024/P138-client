import { create } from 'zustand';

// 定义联赛数据
export const TOP_FIVE_LEAGUES = ['英超', '西甲', '德甲', '意甲', '法甲'];

// 足球联赛
export const FOOTBALL_LEAGUES = [
  ...TOP_FIVE_LEAGUES,
  '英冠', '英甲', 
  '西乙', 
  '德乙',
  '意乙',
  '法乙',
  // ... 其他联赛
];

// 篮球联赛
export const BASKETBALL_LEAGUES = [
  'NBA',
  'CBA',
  '欧洲联赛',
  '美国大学联赛',
  '澳大利亚NBL',
  '土耳其超级联赛',
  '西班牙甲级联赛',
  '希腊篮球联赛',
  '法国篮球联赛',
  '意大利篮球联赛',
  // ... 其他篮球联赛
];

// 所有联赛
export const ALL_LEAGUES = [...FOOTBALL_LEAGUES];

export type OddsRangeType = 'under1.5' | '1.5to2' | 'above2';

export interface FilterState {
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

export const useSportsCompetitionFilterStore = create<FilterState>((set, get) => ({
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

  toggleOddsRange: (range: OddsRangeType) => {
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