// 数字彩共享枚举（从 sport 迁移，数字彩自管理）

export enum SuperLottoPlayEnum {
  NORMAL = '普通选号',
  DANTUO = '胆拖选号',
}

export enum SuperLottoSubPlayEnum {
  DEFAULT = '默认',
}

// 当前数字彩彩种（需要时可扩展）
export type DigitalLotteryNames =
  | 'SuperLotto'
  | 'SevenStar'
  | 'ArrangedThree'
  | 'ArrangedFive'
  | 'DoubleBall'
  | 'Fucai3D';


