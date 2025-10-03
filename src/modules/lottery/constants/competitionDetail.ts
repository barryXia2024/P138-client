
/**
 * 对阵数据请求类型
 */
export enum VS_TYPE {
    ALL = 'All',
    HOME = 'HOME',
    AWAY = 'AWAY',
    HOME_AWAY = 'HOME_AWAY'
  }
  /**
  * 对阵数据请求类型
  */
  export enum StatisticType {
    HOME = 'HOME',
    AWAY = 'AWAY',
    HOME_AWAY = 'HOME_AWAY'
  }
  /**
   * 进攻防守类型
   */
  export enum OFFENSE_DEFENSE_TYPE {
    TEN = 0,
    TWENTY = 1,
  }

  
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