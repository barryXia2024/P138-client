import { DigitalLotteryNames } from "../configs/lotteryConfigs";

// 通用彩票Store接口
export interface BaseLotteryState {
  // 基础状态
  mode?: 'normal' | 'dantuo';
  lotteryName: DigitalLotteryNames;

  // 计算属性
  betCount: number;
  betAmount: number;

  // 操作方法
  clearSelection: () => void;
  quickPick: (count?: number) => void;
  buildTicket: () => Promise<any | undefined>;

  // 票据构建
  createTicket: () => Promise<any | undefined>;
}

// 数字彩票Store接口（大乐透等）
export interface DigitalLotteryState extends BaseLotteryState {
  // 选号状态
  red: number[];
  blue: number[];
  redDan: number[];
  redTuo: number[];
  blueDan: number[];
  blueTuo: number[];

  // 切换方法
  toggleRed: (num: number) => void;
  toggleBlue: (num: number) => void;
  toggleRedDan: (num: number) => void;
  toggleRedTuo: (num: number) => void;
  toggleBlueDan: (num: number) => void;
  toggleBlueTuo: (num: number) => void;

  // 模式切换
  setMode: (mode: 'normal' | 'dantuo') => void;
}

// 位置式彩票Store接口（七星彩等）
export interface PositionLotteryState extends BaseLotteryState {
  // 位置选号状态
  positions: number[][];

  // 切换方法
  toggleNumber: (positionIndex: number, num: number) => void;

  // 获取每位选号
  getPosition: (index: number) => number[];

  // 设置每位选号
  setPosition: (index: number, numbers: number[]) => void;
}

// 通用Store创建器类型
export interface LotteryStoreCreator<T extends BaseLotteryState> {
  (): T;
  getState: () => T;
  setState: (state: Partial<T>) => void;
  subscribe: (listener: (state: T) => void) => () => void;
}

// 彩票类型枚举
export enum LotteryType {
  SUPER_LOTTO = 'SuperLotto',
  SEVEN_STAR = 'SevenStar',
  ARRANGED_THREE = 'ArrangedThree',
  ARRANGED_FIVE = 'ArrangedFive',
}

// 彩票配置接口
export interface LotteryConfig {
  type: LotteryType;
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
