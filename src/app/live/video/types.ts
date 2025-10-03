// 日期项接口
export interface DateItem {
  date: string;
  day: string;
  isToday: boolean;
}

// 足球比赛数据接口 - 使用后端框架生成的类型
export interface FootballCompetitionData {
  list: ServerCommonLive.FootBallCompetition[];
  total: number;
  query: ServerCommonLive.ListFootBallCompetitionCommand;
}

// 篮球比赛数据接口 - 使用后端框架生成的类型
export interface BasketballCompetitionData {
  list: ServerCommonLive.BasketBallCompetition[];
  total: number;
  query: ServerCommonLive.ListBasketBallCompetitionCommand;
}

// 通用比赛数据接口
export type CompetitionData = FootballCompetitionData | BasketballCompetitionData;

// 视频列表状态接口
export interface VideoListState {
  selectedDate: string;
  selectedTabIndex: number;
  selectedFilterIndex: number;
  selectedLotteryTermNo: number;
  footballData: Record<string, FootballCompetitionData>;
  basketballData: Record<string, BasketballCompetitionData>;
  lotteryTermNo: number[];
  page: number;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
}

// 足球筛选器配置接口 - 使用后端框架生成的类型
export interface FootballFilterConfig {
  competitionType: ServerCommonLive.CompetitionType[];
  sort: ServerCommonLive.Sort[];
  label: string[];
}

// 篮球筛选器配置接口 - 使用后端框架生成的类型
export interface BasketballFilterConfig {
  competitionType: ServerCommonLive.CompetitionType[];
  sort: CommonCommonEnum.Sort[];
  label: string[];
}

// 足球 API 参数接口
export interface FootballApiParams {
  current: number;
  pageSize: number;
  competitionType: string;
  direction: string;
  sort: string;
  processDate?: string;
  sfcTermNo?: number;
}

// 篮球 API 参数接口
export interface BasketballApiParams {
  current: number;
  pageSize: number;
  competitionType: string;
  direction: string;
  sort: string;
  processDate?: string;
}

// 获取足球数据参数接口
export interface GetFootballDataParams {
  date: string;
  currentPage: number;
  filterIndex: number;
  termNo: number;
}

// 获取篮球数据参数接口
export interface GetBasketballDataParams {
  date: string;
  currentPage: number;
  filterIndex: number;
}

// 比赛类型枚举 - 使用后端框架生成的类型
export type CompetitionType = ServerCommonLive.CompetitionType;

// 筛选器配置接口
export interface FilterConfig {
  competitionType: string[];
  sort: string[];
  label: string[];
}

// API 映射接口
export interface CompetitionApiMap {
  [key: number]: (params: any) => Promise<any>;
}

// 获取数据参数接口
export interface GetDataParams {
  date: string;
  currentPage: number;
  tabIndex: number;
  filterIndex: number;
  termNo: number;
}

// 足球列表项接口 - 使用后端框架生成的类型
export interface FootballListItem extends Omit<ServerCommonLive.FootBallCompetition, 'competitionId'> {
  competitionId: string;
}

// 篮球列表项接口 - 使用后端框架生成的类型
export interface BasketballListItem extends Omit<ServerCommonLive.BasketBallCompetition, 'competitionId'> {
  competitionId: string;
} 