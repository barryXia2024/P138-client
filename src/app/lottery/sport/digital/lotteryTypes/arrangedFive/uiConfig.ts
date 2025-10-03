import {
  UIConfigType,
  LabelConfig,
  PositionRule,
} from '../configs/lotteryConfigs';

type UIUnit = {
  label: string;
  labels: LabelConfig[];
  positionRules?: PositionRule[];
  subTabs?: Record<string, UIUnit>;
};

// 排列五 UI 配置
export const arrangedFiveUIConfig: UIConfigType = {
  // 直选定位复式
  zhixuan: {
    label: '直选定位复式',
    subTabs: {
      dwfs: {
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

  // 直选组合复式
  zhixuanzh: {
    label: '直选组合复式',
    subTabs: {
      wbt: {
        label: '五不同',
        labels: [
          {
            label: '选号',
            color: 'red',
            needZero: false,
            min: 5,
            max: 8,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [{index: 0, minCount: 5, maxCount: 8, numberRange: 10}],
      },
      et: {
        label: '二同',
        labels: [
          {
            label: '选号',
            color: 'red',
            needZero: false,
            min: 4,
            max: 9,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [{index: 0, minCount: 4, maxCount: 9, numberRange: 10}],
      },
      st: {
        label: '三同',
        labels: [
          {
            label: '选号',
            color: 'red',
            needZero: false,
            min: 3,
            max: 8,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [{index: 0, minCount: 3, maxCount: 8, numberRange: 10}],
      },
      lzet: {
        label: '两组二同',
        labels: [
          {
            label: '选号',
            color: 'red',
            needZero: false,
            min: 4,
            max: 8,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [{index: 0, minCount: 4, maxCount: 8, numberRange: 10}],
      },
      sit: {
        label: '四同',
        labels: [
          {
            label: '选号',
            color: 'red',
            needZero: false,
            min: 2,
            max: 7,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [{index: 0, minCount: 2, maxCount: 7, numberRange: 10}],
      },
      stet: {
        label: '三同二同',
        labels: [
          {
            label: '选号',
            color: 'red',
            needZero: false,
            min: 3,
            max: 7,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [{index: 0, minCount: 3, maxCount: 7, numberRange: 10}],
      },
    },
    labels: [],
  },
};
