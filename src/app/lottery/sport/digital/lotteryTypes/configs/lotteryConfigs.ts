export type DigitalLotteryNames =
  | 'SuperLotto'
  | 'DoubleBall'
  | 'SevenStar'
  | 'ArrangedThree'
  | 'ArrangedFive'
  | 'DoubleBall'
  | 'SevenHappy'
  | 'Happy8';

export interface LotteryConfig {
  type: CoreCommonEnum.LotteryName;
  name: string;
  chineseName: string;
  price: number;
  rules: {
    minRed?: number;
    maxRed?: number;
    minBlue?: number;
    maxBlue?: number;
    positions?: number;
    positionRules?: Array<{
      index: number;
      minCount: number;
      maxCount: number;
      numberRange: number;
    }>;
  };
}

// 彩票配置定义
export const LOTTERY_CONFIGS: Record<DigitalLotteryNames, LotteryConfig> = {
  SuperLotto: {
    type: 'SuperLotto',
    name: 'SuperLotto',
    chineseName: '大乐透',
    price: 2,
    rules: {
      // 使用position方式统一管理
      positions: 2, // 单式:2, 复式:2, 胆拖:4
      positionRules: [
        // 单式玩法 (normal) - 前区5个，后区2个
        {index: 0, minCount: 5, maxCount: 5, numberRange: 35}, // 前区红球
        {index: 1, minCount: 2, maxCount: 2, numberRange: 12}, // 后区蓝球
        // 复式玩法 (fushi) - 前区6-20个，后区3-12个，注数大于1
        // 胆拖玩法 (dantuo) - 使用全部4个position
        {index: 2, minCount: 0, maxCount: 1, numberRange: 12}, // 后区胆码
        {index: 3, minCount: 2, maxCount: 12, numberRange: 12}, // 后区拖码
      ],
    },
  },

  SevenStar: {
    type: 'SevenStar',
    name: 'SevenStar',
    chineseName: '七星彩',
    price: 2,
    rules: {
      positions: 7,
      positionRules: [
        {index: 0, minCount: 1, maxCount: 10, numberRange: 10}, // 第一位：0-9（不限制最大）
        {index: 1, minCount: 1, maxCount: 10, numberRange: 10}, // 第二位：0-9（不限制最大）
        {index: 2, minCount: 1, maxCount: 10, numberRange: 10}, // 第三位：0-9（不限制最大）
        {index: 3, minCount: 1, maxCount: 10, numberRange: 10}, // 第四位：0-9（不限制最大）
        {index: 4, minCount: 1, maxCount: 10, numberRange: 10}, // 第五位：0-9（不限制最大）
        {index: 5, minCount: 1, maxCount: 10, numberRange: 10}, // 第六位：0-9（不限制最大）
        {index: 6, minCount: 1, maxCount: 15, numberRange: 15}, // 第七位：0-14（不限制最大）
      ],
    },
  },

  ArrangedThree: {
    type: 'ArrangedThree',
    name: 'ArrangedThree',
    chineseName: '排列三',
    price: 2,
    rules: {
      positions: 3,
      positionRules: [
        {index: 0, minCount: 1, maxCount: 1, numberRange: 10},
        {index: 1, minCount: 1, maxCount: 1, numberRange: 10},
        {index: 2, minCount: 1, maxCount: 1, numberRange: 10},
      ],
    },
  },

  ArrangedFive: {
    type: 'ArrangedFive',
    name: 'ArrangedFive',
    chineseName: '排列五',
    price: 2,
    rules: {
      positions: 5,
      positionRules: [
        {index: 0, minCount: 1, maxCount: 1, numberRange: 10},
        {index: 1, minCount: 1, maxCount: 1, numberRange: 10},
        {index: 2, minCount: 1, maxCount: 1, numberRange: 10},
        {index: 3, minCount: 1, maxCount: 1, numberRange: 10},
        {index: 4, minCount: 1, maxCount: 1, numberRange: 10},
      ],
    },
  },
};

// 获取彩票配置
export function getLotteryConfig(type: DigitalLotteryNames): LotteryConfig {
  return LOTTERY_CONFIGS[type];
}

// 获取所有彩票配置
export function getAllLotteryConfigs(): LotteryConfig[] {
  return Object.values(LOTTERY_CONFIGS);
}

// 根据名称获取配置
export function getLotteryConfigByName(
  name: string,
): LotteryConfig | undefined {
  return Object.values(LOTTERY_CONFIGS).find(config => config.name === name);
}

// UI配置相关类型定义
export interface LabelConfig {
  label: string;
  color: 'red' | 'blue';
  needZero?: boolean;
  min: number;
  max: number;
  numbers: number[];
  showMissControl?: boolean;
  showQuickPick?: boolean;
  showQuickFivePick?: boolean;
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

// SuperLotto 枚举已移至专用文件：src/app/lottery/sport/digital/superLotto/constants/index.ts
// 请从该文件导入：import { SuperLottoPlayEnum, SuperLottoSubPlayEnum } from '../superLotto/constants/index'
