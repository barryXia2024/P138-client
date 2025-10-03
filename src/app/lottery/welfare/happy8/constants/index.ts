import {UIConfigType} from 'src/app/lottery/sport/digital/lotteryTypes/configs/lotteryConfigs';

export enum Happy8PlayEnum {
  normal = '普通选号',
  dantuo = '胆拖选号',
}
export enum QuickPickButtonEnum {
  pick1 = '选一',
  pick2 = '选二',
  pick3 = '选三',
  pick4 = '选四',
  pick5 = '选五',
  pick6 = '选六',
  pick7 = '选七',
  pick8 = '选八',
  pick9 = '选九',
  pick10 = '选十',
}
// 排列三 UI 配置（仅"直选"系列子玩法）
export const Happy8UIConfig: UIConfigType = {
  [Happy8PlayEnum.normal]: {
    label: '普通选号',
    subTabs: {
      // 1) 定位复式：三列各 0..9；可多选为复式
      [QuickPickButtonEnum.pick1]: {
        label: '',
        labels: [
          {
            label: '',
            color: 'red',
            needZero: true,
            min: 1,
            max: 80,
            
            showQuickPick: false,
            numbers: Array.from({length: 80}, (_, n) => n+1),
          },
 
        ],
        positionRules: [
          {index: 0, minCount: 1, maxCount: 80, numberRange: 80},
 
        ],
      },
    },
    labels: [],
  },

  // 胆拖选号
  [Happy8PlayEnum.dantuo]: {
    label: '胆拖选号',
    subTabs: {
      [QuickPickButtonEnum.pick1]: {
        label: '',
        labels: [
          {
            label: '',
            color: 'red',
            min: 1,
            max: 80,
            needZero: true,
            numbers: Array.from({length: 80}, (_, n) => n+1),
          },
 
          {
            label: '',
            color: 'blue',
            min: 1,
            max: 80,
            needZero: true,
            numbers: Array.from({length: 80}, (_, n) => n+1),
          },
        ],
        positionRules: [
          {index: 0, minCount: 1, maxCount: 6, numberRange: 80}, // 前区胆码1-5个
          {index: 1, minCount: 2, maxCount: 20, numberRange: 80}, // 前区拖码2-28个
 
        ],
      },
    },
    labels: [],
  },
};




export const quickPickButtons: {label: QuickPickButtonEnum, key: QuickPickButtonEnum}[] = [
  {label: QuickPickButtonEnum.pick1, key: QuickPickButtonEnum.pick1},
  {label: QuickPickButtonEnum.pick2, key: QuickPickButtonEnum.pick2},
  {label: QuickPickButtonEnum.pick3, key: QuickPickButtonEnum.pick3},
  {label: QuickPickButtonEnum.pick4, key: QuickPickButtonEnum.pick4},
  {label: QuickPickButtonEnum.pick5, key: QuickPickButtonEnum.pick5},
  {label: QuickPickButtonEnum.pick6, key: QuickPickButtonEnum.pick6},
  {label: QuickPickButtonEnum.pick7, key: QuickPickButtonEnum.pick7},
  {label: QuickPickButtonEnum.pick8, key: QuickPickButtonEnum.pick8},
  {label: QuickPickButtonEnum.pick9, key: QuickPickButtonEnum.pick9},
  {label: QuickPickButtonEnum.pick10, key: QuickPickButtonEnum.pick10},
];
export const quickPickButtonsMap: Record<QuickPickButtonEnum, number> = {
  [QuickPickButtonEnum.pick1] : 1,
  [QuickPickButtonEnum.pick2]: 2,
  [QuickPickButtonEnum.pick3]: 3,
  [QuickPickButtonEnum.pick4]: 4,
  [QuickPickButtonEnum.pick5]: 5,
  [QuickPickButtonEnum.pick6]: 6,
  [QuickPickButtonEnum.pick7]: 7,
  [QuickPickButtonEnum.pick8]: 8,
  [QuickPickButtonEnum.pick9]: 9,
  [QuickPickButtonEnum.pick10]: 10,
};