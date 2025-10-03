export enum LotteryPlayEnum {
  NORMAL = '普通选号',
  DANTUO = '胆拖选号',
  DIRECT_SELECTION = '直选',
  GROUP_SELECTION = '组选',
  GROUP_SELECTION_3 = '组选3',
  GROUP_SELECTION_6 = '组选6',
  DIRECT_SELECTION_POSITION_DUPLEX = '直选定位复式',
  DIRECT_SELECTION_GROUP_DUPLEX = '直选组合复式',
}

export enum LotterySubPlayEnum {
  DEFAULT = '默认',
  POSITION_DUPLEX = '定位复式',
  GROUP_DIFFERENT = '组合三不同',
  SUM_VALUE = '和值',
  COMBINATION_DRAG = '组合胆拖',
  COURAGE_DRAGGED = '胆拖',
  SINGLE = '单式',
  DUPLEX = '复式',
  SPAN_DUPLEX = '跨度复式',
  GROUP_SUM_VALUE = '组选和值',
  GROUP_TWO_CODE = '组选2码全包',
  GROUP_DIFFERENT_FIVE = '组合五不同',
  GROUP_SAME_TWO = '二同',
  GROUP_SAME_THREE = '三同',
  GROUP_SAME_FOUR = '四同',
  GROUP_SAME_THREE_TWO = '三同二同',
  GROUP_TWO_SAME_TWO = '两组二同',
}
 

// SuperLottoPlayEnum 作为 LotteryPlayEnum 的子类
export enum SuperLottoPlayEnum {
  NORMAL= LotteryPlayEnum.NORMAL,
  DANTUO= LotteryPlayEnum.DANTUO,
}  ;

// SuperLottoSubPlayEnum 作为 LotterySubPlayEnum 的子类
export enum SuperLottoSubPlayEnum {
  DEFAULT= LotterySubPlayEnum.DEFAULT, // 这个值在父类中没有，所以单独定义
}  

 

// UI配置相关类型定义
export interface LabelConfig {
  label: string;
  color: 'red' | 'blue' | 'gray';
  needZero?: boolean;
  min: number;
  max: number;
  numbers: number[];
}

export interface PositionRule {
  index: number;
  minCount: number;
  maxCount?: number;
  numberRange: number;
}

export interface UIUnit {
  /**
   * position 左侧名称
   * */
  label: string;
  /**
   * 快速选号
   * */
  quickPick?: {label: string; count?: number}[];
  /**
   * position 右侧列表
   * */
  labels: LabelConfig[];
  /**
   * position 规则
   * */
  positionRules?: PositionRule[];
  /**
   * 子玩法
   * */
  subTabs?: Record<string, UIUnit>;
}

export type UIConfigType = Record<string, UIUnit>;
