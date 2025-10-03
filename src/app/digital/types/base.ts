import {SevenStarPlayEnum, SevenStarSubPlayEnum} from './sevenStar';
import { SuperLottoPlayEnum, SuperLottoSubPlayEnum } from './superLotto';

export type DigitalLotteryName =
  | 'SuperLotto'
  | 'SevenStar'
  | 'ArrangedThree'
  | 'ArrangedFive'
  | 'DoubleBall'
  | 'Fucai3D';

export interface PositionRule {
  index: number;
  minCount: number;
  maxCount: number;
  numberRange: number;
}
export interface PositionTicket {
  lotteryName: DigitalLotteryName;
  betId: string;
  betAmount: number;
  betCount: number;
  positions: string[][];
  playMode: SevenStarPlayEnum | SuperLottoPlayEnum; // 支持其他玩法的playMode
  subPlayMode?: SevenStarSubPlayEnum | SuperLottoSubPlayEnum; // 支持其他玩法的subPlayMode
}
export enum DigitalColor {
  red = 'red',
  blue = 'blue',
  gray = 'gray',
}

export interface LabelConfig {
  label: string;
  color: DigitalColor;
  needZero?: boolean;
  min: number;
  max: number;
  numbers: string[];
}

export interface UIConfig {
  label: string;
  labels: LabelConfig[];
  positionRules: PositionRule[];
  quickPick?: {label: string; count?: number}[];
}
// 追加标识：'1' 追加，'2' 不追加（与后端约定保持一致）
export enum AppendFlagEnum {
  Append = '1',
  NotAppend = '2',
}
export interface MultiplierDict {
  [betId: string]: number;
}