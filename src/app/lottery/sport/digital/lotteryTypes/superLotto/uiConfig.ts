import { SuperLottoPlayEnum } from '../../types';
import {UIUnit} from '../configs/lotteryConfigs';

export type LabelConfig = {
  label: string;
  color: 'red' | 'blue';
  needZero?: boolean;
  min: number;
  max?: number;
  numbers: number[];
};

export const SuperLottoUIConfig: Record<SuperLottoPlayEnum, UIUnit> = {
  [SuperLottoPlayEnum.NORMAL]: {
    label: '普通选号',
    labels: [
      {
        label: '前区',
        color: 'red',
        needZero: true,
        min: 5,
        max: 35,
        numbers: Array.from({length: 35}, (_, n) => n + 1),
      },
      {
        label: '后区',
        color: 'blue',
        needZero: true,
        min: 2,
        max: 12,
        numbers: Array.from({length: 12}, (_, n) => n + 1),
      },
    ],
  },
  [SuperLottoPlayEnum.DANTUO]: {
    label: '胆拖选号',
    labels: [
      {
        label: '前区胆码',
        color: 'red',
        needZero: true,
        min: 1,
        max: 4,
        numbers: Array.from({length: 35}, (_, n) => n + 1),
      },
      {
        label: '前区拖码',
        color: 'red',
        needZero: true,
        min: 2,
        max: 35,
        numbers: Array.from({length: 35}, (_, n) => n + 1),
      },
      {
        label: '后区胆码',
        color: 'blue',
        needZero: true,
        min: 0,
        max: 1,
        numbers: Array.from({length: 12}, (_, n) => n + 1),
      },
      {
        label: '后区拖码',
        color: 'blue',
        needZero: true,
        min: 2,
        max: 12,
        numbers: Array.from({length: 12}, (_, n) => n + 1),
      },
    ],
  },
};
