/** 赔率单元格宽度配置 */
export const ODDS_CELL_WIDTH: Record<string, string> = {
  SPF: '33%',
  ZJQ: '25%',
  DEFAULT: '20%',
};

/** 投注类型配置 - 包含所有投注玩法的配置信息 */
export const BETTING_TYPE_SETTINGS: Record<LotteryCommon.FootballLotteryBettingType | LotteryCommon.DefaultBettingType, {
  /* 赔率数据索引 */
  index: number;          
  /* 单元格宽度 */
  width: string;          
  /* 是否显示盘口 */
  showHandicap: boolean;  
  /* 是否显示单关提示 */
  showSingleTip: boolean; 
  /* 切片数量 */
  sliceCount: number;     
  /* 是否为特殊按钮（比分投注） */
  isSpecialButton?: boolean;
  /* 投注类型 */
  maxCount: number;           
}> = {
  HHTZ: {
    index: 0,
    width: ODDS_CELL_WIDTH.SPF,
    showHandicap: true,
    showSingleTip: true,
    sliceCount: 2,
    maxCount: 8,
  },
  SPF: {
    index: 1,
    width: ODDS_CELL_WIDTH.SPF,
    showHandicap: true,
    showSingleTip: true,
    sliceCount: 2,
    maxCount: 8,
  },
  C1C: {
    index: 2,
    width: ODDS_CELL_WIDTH.SPF,
    showHandicap: true,
    showSingleTip: false,
    sliceCount: 2,
    maxCount: 1,
  },
  ZJQ: {
    index: 3,
    width: ODDS_CELL_WIDTH.ZJQ,
    showHandicap: false,
    showSingleTip: false,
    sliceCount: 1,
    maxCount: 8,
  },
  BQC: {
    index: 4,
    width: ODDS_CELL_WIDTH.DEFAULT,
    showHandicap: false,
    showSingleTip: false,
    sliceCount: 1,
    maxCount: 8,
  },
  CBF: {
    index: 5,
    width: ODDS_CELL_WIDTH.DEFAULT,
    showHandicap: false,
    showSingleTip: false,
    sliceCount: 1,
    isSpecialButton: true, // 比分投注使用特殊按钮
    maxCount: 8,
  },
  default: {
    index: 0,
    width: ODDS_CELL_WIDTH.DEFAULT,
    showHandicap: false,
    showSingleTip: false,
    sliceCount: 1,
    maxCount: 8,
  },
};
