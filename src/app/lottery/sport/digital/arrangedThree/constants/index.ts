import {UIConfigType} from '../../lotteryTypes/configs/lotteryConfigs';

export enum ArrangedThreePlayEnum {
  /**直选*/ 
  DirectSelection = '直选',
  /**组三*/ 
  GroupThree = '组三',
  /**组六*/ 
  GroupSix = '组六',
  /**组选*/ 
  Group = '组选',
}

export enum ArrangedThreeSubPlayEnum {
  /**定位复式*/ 
  PositioningDuplex = '定位复式',
  /**组合三不同*/ 
  CombinationDifferent = '组合三不同',
  /**和值*/ 
  SumValue = '和值',
  /**组合胆拖*/ 
  CombinationDrag = '组合胆拖',
  /**跨度复式*/ 
  SpanDuplex = '跨度复式',
  /**单式*/ 
  Single = '单式',
  /**复式*/ 
  Duplex = '复式',
  /**胆拖*/ 
  CourageDragged = '胆拖',
  /**组选和值*/ 
  GroupSumValue = '组选和值',
  /**组选2码全包*/ 
  GroupTwoCode = '组选2码全包',
}

// 排列三 UI 配置（仅"直选"系列子玩法）
export const ArrangedThreeUIConfig: UIConfigType = {
  [ArrangedThreePlayEnum.DirectSelection]: {
    label: '直选',
    subTabs: {
      // 1) 定位复式：三列各 0..9；可多选为复式
      [ArrangedThreeSubPlayEnum.PositioningDuplex]: {
        label: '定位复式',
    
        labels: [
          {
            label: '百位',
            color: 'red',
            needZero: false,
            min: 1,
            max: 10,
      
            showQuickPick: true,
            showMissControl: true,
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
        ],
      },

      // 2) 组合三不同：单列 0..9，至少 3 个；机选 3 个互不相同
      [ArrangedThreeSubPlayEnum.CombinationDifferent]: {
        label: '组合三不同',
        labels: [
          {
            label: '',
            color: 'red',
            needZero: false,
            min: 3,
            max: 10,
            numbers: Array.from({length: 10}, (_, n) => n),
            showQuickPick: true,
            showMissControl: true,
          },
        ],
        positionRules: [{index: 0, minCount: 3, maxCount: 10, numberRange: 10}],
      },

      // 3) 和值：单列 0..27；机选 1 个；（注数可按表优化，目前按选择数量计算）
      [ArrangedThreeSubPlayEnum.SumValue]: {
        label: '和值',
        labels: [
          {
            label: '',
            color: 'red',
            showQuickPick: true,
 
            min: 1,
            max: 28,
            numbers: Array.from({length: 28}, (_, n) => n),
          },
        ],
        positionRules: [{index: 0, minCount: 1, maxCount: 28, numberRange: 28}],
      },

      // 4) 组合胆拖：两列 0..9；胆最少 1、最多 2；拖与胆并集 ≥ 4
      [ArrangedThreeSubPlayEnum.CombinationDrag]: {
        label: '组合胆拖',
        labels: [
          {
            label: '',
            color: 'red',
            showQuickPick: true,
            min: 1,
            max: 2,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
          {
            label: '',
            color: 'blue',
            
            min: 1,
            max: 10,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [
          {index: 0, minCount: 1, maxCount: 2, numberRange: 10},
          {index: 1, minCount: 1, maxCount: 10, numberRange: 10},
        ],
      },

      // 5) 跨度：单列 0..9；机选 1 个
      [ArrangedThreeSubPlayEnum.SpanDuplex]: {
        label: '跨度复式',
        labels: [
          {
            label: '',
            color: 'red',
            showQuickPick: true,
            min: 1,
            max: 10,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [{index: 0, minCount: 1, maxCount: 10, numberRange: 10}],
      },
    },
    labels: [],
  },

  // 组三
  [ArrangedThreePlayEnum.GroupThree]: {
    label: '组三',
    subTabs: {
      [ArrangedThreeSubPlayEnum.Single]: {
        label: '单式',
        labels: [
          {
            label: '重号',
            color: 'red',
            showQuickPick: true,
            min: 1,
            max: 1,
            numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          },
          {
            label: '单号',
            color: 'red',
      
            min: 1,
            max: 1,
            numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          },
        ],
        positionRules: [
          {index: 0, minCount: 1, maxCount: 1, numberRange: 10},
          {index: 1, minCount: 1, maxCount: 1, numberRange: 10},
        ],
      },
      [ArrangedThreeSubPlayEnum.Duplex]: {
        label: '复式',
        quickPick: [
            { label: '10选10 赔率 1.92', count: 10 },
            { label: '10选9 赔率 2.40', count: 9 },
            { label: '10选8 赔率 3.09', count: 8 },
            { label: '10选7 赔率 4.12', count: 7 },
        ],
        
        labels: [
          {
            label: '',
            color: 'red',
            showQuickPick: true,
            showMissControl: true,
            min: 2,
            max: 10,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [{index: 0, minCount: 2, maxCount: 10, numberRange: 10}],
      },
      [ArrangedThreeSubPlayEnum.CourageDragged]: {
        label: '胆拖',
        labels: [
          {
            label: '',
            color: 'red',
            showQuickPick: true,
            min: 1,
            max: 1,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
          {
            label: '',
            color: 'blue',
            
            min: 1,
            max: 10,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [
          {index: 0, minCount: 1, maxCount: 1, numberRange: 10},
          {index: 1, minCount: 1, maxCount: 10, numberRange: 10},
        ],
      },
      [ArrangedThreeSubPlayEnum.SpanDuplex]: {
        label: '跨度复式',
        labels: [
          {
            label: '',
            color: 'red',
 
            min: 1,
            max: 9,
            showQuickPick: true,
            numbers: Array.from({length: 9}, (_, n) => n + 1),
          },
        ],
        positionRules: [{index: 0, minCount: 1, maxCount: 9, numberRange: 9}],
      },
    },
    labels: [],
  },

  // 组六
  [ArrangedThreePlayEnum.GroupSix]: {
    label: '组六',
    subTabs: {
      [ArrangedThreeSubPlayEnum.Duplex]: {
        label: '复式',
        labels: [
          {
            label: '',
            color: 'red',
            showQuickPick: true,
            showMissControl: true,
            min: 3,
            max: 10,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        quickPick: [
          {label: '10选8 赔率 1.54', count: 8},
          {label: '10选7 赔率 2.00', count: 7},
          {label: '10选6 赔率 4.32', count: 6},
          {label: '10选5 赔率 8.65', count: 5},
        ],
        positionRules: [{index: 0, minCount: 3, maxCount: 10, numberRange: 10}],
      },
      [ArrangedThreeSubPlayEnum.CourageDragged]: {
        label: '胆拖',
        labels: [
          {
            label: '胆码',
            color: 'red',
            showQuickPick: true,
            showMissControl: true,
            min: 1,
            max: 2,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
          {
            label: '拖码',
            color: 'blue',
            
            min: 1,
            max: 10,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [
          {index: 0, minCount: 1, maxCount: 2, numberRange: 10},
          {index: 1, minCount: 1, maxCount: 10, numberRange: 10},
        ],
      },
      [ArrangedThreeSubPlayEnum.SpanDuplex]: {
        label: '跨度复式',
        labels: [
          {
            label: '',
            color: 'red',
            showQuickPick: true,
            min: 2,
            max: 9,
            numbers: Array.from({length: 8}, (_, n) => n + 2),
          },
        ],
        positionRules: [{index: 0, minCount: 1, maxCount: 8, numberRange: 8}],
      },
    },
    labels: [],
  },

  // 组选
  [ArrangedThreePlayEnum.Group]: {
    label: '组选',
    subTabs: {
      [ArrangedThreeSubPlayEnum.GroupSumValue]: {
        label: '组选和值',
        labels: [
          {
            label: '',
            color: 'red',
            showQuickPick: true,
            min: 1,
            max: 26,
            numbers: Array.from({length: 26}, (_, n) => n + 1),
          },
        ],
        positionRules: [{index: 0, minCount: 1, maxCount: 26, numberRange: 26}],
      },
      [ArrangedThreeSubPlayEnum.GroupTwoCode]: {
        label: '组选2码全包',
        labels: [
          {
            label: '',
            color: 'red',
            showQuickPick: true,
            min: 2,
            max: 10,
            numbers: Array.from({length: 10}, (_, n) => n),
          },
        ],
        positionRules: [{index: 0, minCount: 2, maxCount: 10, numberRange: 10}],
      },
    },
    labels: [],
  },
};
