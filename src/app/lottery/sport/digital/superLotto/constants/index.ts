import {UIConfigType} from 'src/app/lottery/sport/digital/lotteryTypes/configs/lotteryConfigs';
import { LotteryPlayEnum, LotterySubPlayEnum } from '../../types';

// 简单直接的枚举定义 - 符合 TypeScript 最佳实践
export enum SuperLottoPlayEnum {
  NORMAL = LotteryPlayEnum.NORMAL,
  DANTUO = LotteryPlayEnum.DANTUO,
}

export enum SuperLottoSubPlayEnum {
  DEFAULT = LotterySubPlayEnum.DEFAULT,
}

// 大乐透 UI 配置
export const SuperLottoUIConfig: UIConfigType = {
  [SuperLottoPlayEnum.NORMAL]: {
    label: '普通选号',
    subTabs: {
      //  默认直选
      [SuperLottoSubPlayEnum.DEFAULT]: {
        label: '',
        labels: [
          {
            label: '',
            color: 'red',
            needZero: true,
            min: 1,
            max: 35,
            numbers: Array.from({length: 35}, (_, n) => n + 1),
          },
          {
            label: '',
            color: 'blue',
            needZero: true,
            min: 1,
            max: 12,
            numbers: Array.from({length: 12}, (_, n) => n + 1),
          },
        ],
        // 基础规则
        positionRules: [
          {index: 0, minCount: 1, maxCount: 35, numberRange: 35},
          {index: 1, minCount: 1, maxCount: 12, numberRange: 12},
        ],
      },
    },
    labels: [],
  },

  [SuperLottoPlayEnum.DANTUO]: {
    label: '胆拖选号',
    subTabs: {
      // 默认直选的子玩法1. 红胆 2.红拖 3.蓝胆 4.蓝拖
      [SuperLottoSubPlayEnum.DEFAULT]: {
        label: '',
        labels: [
          {
            label: '',
            color: 'red',
            min: 1,
            max: 5,
            numbers: Array.from({length: 35}, (_, n) => n + 1),
          },
          {
            label: '',
            color: 'red',
            min: 2,
            max: 28,
            numbers: Array.from({length: 35}, (_, n) => n + 1),
          },
          {
            label: '',
            color: 'blue',
            min: 1,
            max: 12,
            numbers: Array.from({length: 12}, (_, n) => n + 1),
          },
          {
            label: '',
            color: 'blue',
            min: 1,
            max: 12,
            numbers: Array.from({length: 12}, (_, n) => n + 1),
          },
        ],
        // 基础规则
        positionRules: [
          {index: 0, minCount: 1, maxCount: 4, numberRange: 35}, // 红胆码1-5个
          {index: 1, minCount: 2, maxCount: 28, numberRange: 35}, // 红拖码2-28个
          {index: 2, minCount: 1, maxCount: 1, numberRange: 12}, // 蓝胆1-12个
          {index: 3, minCount: 1, maxCount: 12, numberRange: 12}, // 蓝拖1-12个
        ],
      },
    },
    labels: [],
  },
};