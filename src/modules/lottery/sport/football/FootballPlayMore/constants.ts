import {
  betPlayColorBlue,
  betPlayColorBrown,
  betPlayColorGreen,
} from 'p138-react-common/utils/styles/color';

// 常量定义
export const LOTTERY_CONFIG:Record<CommonCommonEnum.LotteryName,{
    playKey: string;
    colorMap: Record<string, string>;
    showSingleBetTip: boolean;
    singleBetTipText: string;
    renderType: 'simple' | 'complex';
    emptyCellsAfterWinOther: number;
    buttons?: {text: string; color: string; style: 'large' | 'small'}[];
}> = {
  FootballLottery: {
    playKey: 'Q_CBF$PLAY',
    colorMap: {
      全场比分: betPlayColorGreen,
      进球数: betPlayColorBlue,
      半全场: betPlayColorBrown,
    },
    showSingleBetTip: true,
    singleBetTipText: '红色选框可以投单关',
    renderType: 'complex',
    emptyCellsAfterWinOther: 2,
  },
  BeijingSingleMatch: {
    playKey: 'S_XDS$PLAY',
    buttons: [
      {text: '胜', color: betPlayColorBlue, style: 'large'},
      {text: '平', color: betPlayColorGreen, style: 'small'},
      {text: '负', color: betPlayColorBrown, style: 'large'},
    ],
    showSingleBetTip: false,
    renderType: 'simple',
    emptyCellsAfterWinOther: 0,
  },
}  ;

// 渲染配置
export const RENDER_CONFIG = {
  oddsRowCount: 5,
  simpleRenderIndices: [0, 1], // 使用简单渲染的索引
  complexRenderIndices: [2, 3, 4], // 使用复杂渲染的索引
  heightConfig: {
    scoreDialog: 0.6,
    normal: 0.9,
  },
}  ;

// 类型定义
export type LotteryName = keyof typeof LOTTERY_CONFIG;
export type RenderType = 'simple' | 'complex';

// 配置类型定义
type FootballLotteryConfig = typeof LOTTERY_CONFIG.FootballLottery;
type BeijingSingleMatchConfig = typeof LOTTERY_CONFIG.BeijingSingleMatch;
export type LotteryConfig = FootballLotteryConfig | BeijingSingleMatchConfig;
