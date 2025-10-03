import {SuperLottoPlayEnum} from '../../shared/enums';
import {UIConfig} from '../../core/types';

export function getSuperLottoUIConfig(playMode: SuperLottoPlayEnum): UIConfig {
  if (playMode === SuperLottoPlayEnum.NORMAL) {
    return {
      label: '普通选号',
      labels: [
        {
          label: '',
          color: 'red' as const,
          needZero: true,
          min: 1,
          max: 35,
          numbers: Array.from({length: 35}, (_, n) => n + 1),
        },
        {
          label: '',
          color: 'blue' as const,
          needZero: true,
          min: 1,
          max: 12,
          numbers: Array.from({length: 12}, (_, n) => n + 1),
        },
      ],
      positionRules: [
        {index: 0, minCount: 5, maxCount: 35, numberRange: 35},
        {index: 1, minCount: 2, maxCount: 12, numberRange: 12},
      ],
    };
  }
  
  // DANTUO
  return {
    label: '胆拖选号',
    labels: [
      {
        label: '',
        color: 'red' as const,
        needZero: false,
        min: 1,
        max: 5,
        numbers: Array.from({length: 35}, (_, n) => n + 1),
      },
      {
        label: '',
        color: 'red' as const,
        needZero: false,
        min: 2,
        max: 28,
        numbers: Array.from({length: 35}, (_, n) => n + 1),
      },
      {
        label: '',
        color: 'blue' as const,
        needZero: false,
        min: 1,
        max: 12,
        numbers: Array.from({length: 12}, (_, n) => n + 1),
      },
      {
        label: '',
        color: 'blue' as const,
        needZero: false,
        min: 1,
        max: 12,
        numbers: Array.from({length: 12}, (_, n) => n + 1),
      },
    ],
    positionRules: [
      {index: 0, minCount: 1, maxCount: 4, numberRange: 35}, // 红胆码1-4个
      {index: 1, minCount: 2, maxCount: 28, numberRange: 35}, // 红拖码2-28个
      {index: 2, minCount: 0, maxCount: 1, numberRange: 12}, // 蓝胆0-1个
      {index: 3, minCount: 2, maxCount: 12, numberRange: 12}, // 蓝拖2-12个
    ],
  };
}
