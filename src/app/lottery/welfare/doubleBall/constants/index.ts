import {UIConfigType} from 'src/app/lottery/sport/digital/lotteryTypes/configs/lotteryConfigs';

export enum DoubleBallPlayEnum {
  normal = '普通选号',
  dantuo = '胆拖选号',
}

// 排列三 UI 配置（仅"直选"系列子玩法）
export const DoubleBallUIConfig: UIConfigType = {
  [DoubleBallPlayEnum.normal]: {
    label: '普通选号',
    subTabs: {
      // 1) 定位复式：三列各 0..9；可多选为复式
      [DoubleBallPlayEnum.normal]: {
        label: '',
        labels: [
          {
            label: '',
            color: 'red',
            needZero: true,
            min: 1,
            max: 33,

            numbers: Array.from({length: 33}, (_, n) => n+1),
          },
          {
            label: '',
            color: 'blue',
            needZero: true,
            min: 1,
            max: 16,
            numbers: Array.from({length: 16}, (_, n) => n+1),
          },
        ],
        positionRules: [
          {index: 0, minCount: 1, maxCount: 33, numberRange: 33},
          {index: 1, minCount: 1, maxCount: 16, numberRange: 16},
        ],
      },
    },
    labels: [],
  },

  // 胆拖选号
  [DoubleBallPlayEnum.dantuo]: {
    label: '胆拖选号',
    subTabs: {
      [DoubleBallPlayEnum.normal]: {
        label: '',
        labels: [
          {
            label: '',
            color: 'red',
            min: 1,
            max: 5,
            numbers: Array.from({length: 33}, (_, n) => n+1),
          },
          {
            label: '',
            color: 'red',
            min: 2,
            max: 28,
            numbers: Array.from({length: 33}, (_, n) => n+1),
          },
          {
            label: '',
            color: 'blue',
            min: 1,
            max: 16,
            numbers: Array.from({length: 16}, (_, n) => n+1),
          },
        ],
        positionRules: [
          {index: 0, minCount: 1, maxCount: 5, numberRange: 33}, // 前区胆码1-5个
          {index: 1, minCount: 2, maxCount: 28, numberRange: 33}, // 前区拖码2-28个
          {index: 2, minCount: 1, maxCount: 16, numberRange: 16}, // 蓝球1-16个
        ],
      },
    },
    labels: [],
  },
};
