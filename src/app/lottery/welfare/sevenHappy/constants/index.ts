import {UIConfigType} from 'src/app/lottery/sport/digital/lotteryTypes/configs/lotteryConfigs';

export enum SevenHappyPlayEnum {
  normal = '普通选号',
  dantuo = '胆拖选号',
}

// 排列三 UI 配置（仅"直选"系列子玩法）
export const SevenHappyUIConfig: UIConfigType = {
  [SevenHappyPlayEnum.normal]: {
    label: '普通选号',
    subTabs: {
      // 1) 定位复式：三列各 0..9；可多选为复式
      [SevenHappyPlayEnum.normal]: {
        label: '',
        labels: [
          {
            label: '',
            color: 'red',
            needZero: true,
            min: 1,
            max: 30,

            showQuickPick: false,
            numbers: Array.from({length: 30}, (_, n) => n+1),
          },
 
        ],
        positionRules: [
          {index: 0, minCount: 1, maxCount: 30, numberRange: 30},
 
        ],
      },
    },
    labels: [],
  },

  // 胆拖选号
  [SevenHappyPlayEnum.dantuo]: {
    label: '胆拖选号',
    subTabs: {
      [SevenHappyPlayEnum.normal]: {
        label: '',
        labels: [
          {
            label: '',
            color: 'red',
            min: 1,
            max: 30,
            needZero: true,
            numbers: Array.from({length: 30}, (_, n) => n+1),
          },
 
          {
            label: '',
            color: 'blue',
            min: 1,
            max: 30,
            needZero: true,
            numbers: Array.from({length: 30}, (_, n) => n+1),
          },
        ],
        positionRules: [
          {index: 0, minCount: 1, maxCount: 6, numberRange: 30}, // 前区胆码1-5个
          {index: 1, minCount: 2, maxCount: 20, numberRange: 30}, // 前区拖码2-28个
 
        ],
      },
    },
    labels: [],
  },
};
