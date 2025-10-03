// 数字彩核心类型定义
import {DigitalLotteryNames, SuperLottoPlayEnum} from '../shared/enums';

export type DigitalLotteryName = DigitalLotteryNames;

export interface BaseTicket {
  lotteryName: DigitalLotteryName;
  betId: string;
  betAmount: number;
  betCount: number;
  positions: number[][];
  playMode: SuperLottoPlayEnum | any; // 支持其他玩法的playMode
  subPlayMode?: string | any; // 支持其他玩法的subPlayMode
}

export interface SuperLottoTicket extends BaseTicket {
  lotteryName: 'SuperLotto';
  playMode: SuperLottoPlayEnum;
}

export interface PositionTicket extends BaseTicket {
  lotteryName: Exclude<DigitalLotteryName, 'SuperLotto'>;
}

export interface PositionRule {
  index: number;
  minCount: number;
  maxCount: number;
  numberRange: number;
}

export interface LabelConfig {
  label: string;
  color: 'red' | 'blue';
  needZero?: boolean;
  min: number;
  max: number;
  numbers: number[];
}

export interface UIConfig {
  label: string;
  labels: LabelConfig[];
  positionRules: PositionRule[];
  quickPick?: { label: string; count?: number }[];
}
