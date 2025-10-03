import {UIConfigType} from '../../lotteryTypes/configs/lotteryConfigs';

export enum ArrangedFivePlayEnum {
  /**直选*/
  DirectPositioningDuplex = '直选定位复式',
  /**组合复式*/
  DirectCombinationDuplex = '直选组合复式',
}

export enum ArrangedFiveSubPlayEnum {
  /**定位复式*/
  PositioningDuplex = '定位复式',
  /**五不同*/
  CombinationFiveDifferent = '五不同',
  /**二同*/
  TwoSame = '二同',
  /**三同号通选*/
  ThreeSame = '三同',
  /**两组二同*/
  TwoGroupTwoSame = '两组二同',
  /**四不同*/
  FourSame = '四同',
  /**三同二同*/
  ThreeTwoSame = '三同二同',
}

// 排列三 UI 配置（仅"直选"系列子玩法）
export const ArrangedFiveUIConfig: UIConfigType = {
  [ArrangedFivePlayEnum.DirectPositioningDuplex]: {
    label: '直选定位复式',
    subTabs: {
      // 1) 定位复式：三列各 0..9；可多选为复式
      [ArrangedFiveSubPlayEnum.PositioningDuplex]: {
        label: '定位复式',

        labels: [
          {
            label: '万位',
            color: 'red',
            needZero: false,
            min: 1,
            max: 10,

            numbers: Array.from({length: 10}, (_, n) => n),
          },
          {
            label: '千位',
            color: 'red',
            needZero: false,
            min: 1,
            max: 10,

            numbers: Array.from({length: 10}, (_, n) => n),
          },
          {
            label: '百位',
            color: 'red',
            needZero: false,
            min: 1,
            max: 10,

            numbers: Array.from({length: 10}, (_, n) => n),
          },
          {
            label: '十位',
            color: 'red',
            needZero: false,
            min: 1,
            max: 10,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
          {
            label: '个位',
            color: 'red',
            needZero: false,
            min: 1,
            max: 10,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [
          {index: 0, minCount: 1, maxCount: 10, numberRange: 10},
          {index: 1, minCount: 1, maxCount: 10, numberRange: 10},
          {index: 2, minCount: 1, maxCount: 10, numberRange: 10},
          {index: 3, minCount: 1, maxCount: 10, numberRange: 10},
          {index: 4, minCount: 1, maxCount: 10, numberRange: 10},
        ],
      },
    },
    labels: [],
  },

  // 组三
  [ArrangedFivePlayEnum.DirectCombinationDuplex]: {
    label: '直选组合复式',
    subTabs: {
      [ArrangedFiveSubPlayEnum.CombinationFiveDifferent]: {
        label: '五不同',
        labels: [
          {
            label: '',
            color: 'red',
            needZero: true,
            min: 5,
            max: 8,
            numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          },
        ],
      },
      [ArrangedFiveSubPlayEnum.TwoSame]: {
        label: '二同',
        labels: [
          {
            label: '',
            color: 'red',
            needZero: true,
            min: 5,
            max: 15,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [{index: 0, minCount: 2, maxCount: 10, numberRange: 10}],
      },
      [ArrangedFiveSubPlayEnum.ThreeSame]: {
        label: '三同',
        labels: [
          {
            label: '',
            color: 'red',
            needZero: true,
            min: 5,
            max: 10,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [{index: 0, minCount: 1, maxCount: 1, numberRange: 10}],
      },
      [ArrangedFiveSubPlayEnum.TwoGroupTwoSame]: {
        label: '两组二同',
        labels: [
          {
            label: '',
            color: 'red',
            needZero: false,
            min: 5,
            max: 10,
            numbers: Array.from({length: 9}, (_, n) => n + 1),
          },
        ],
        positionRules: [{index: 0, minCount: 1, maxCount: 9, numberRange: 9}],
      },
      [ArrangedFiveSubPlayEnum.FourSame]: {
        label: '四同',
        labels: [
          {
            label: '',
            color: 'red',
            needZero: true,
            min: 5,
            max: 10,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [{index: 0, minCount: 1, maxCount: 10, numberRange: 10}],
      },
      [ArrangedFiveSubPlayEnum.ThreeTwoSame]: {
        label: '三同二同',
        labels: [
          {
            label: '',
            color: 'red',
            needZero: true,
            min: 5,
            max: 10,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [{index: 0, minCount: 1, maxCount: 10, numberRange: 10}],
      },
    },
    labels: [],
  },
};
