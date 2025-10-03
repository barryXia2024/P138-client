// 福彩3D 枚举定义（参考 arrangedThree）

export enum Fucai3DPlayEnum {
  DirectSelection = '直选', // 直选
  GroupThree = '组三', // 组选
  GroupSix='组六',
  OneD='1D',
  TwoD='2D'
}

export enum Fucai3DSubPlayEnum {
  // 直选子玩法
  PositioningDuplex = '定位复试', // 定位复式
  Single='单式',
  Duplex='复式',
  OneD='1D',
  GuessOneD='猜1D',
  TwoD='2D',
  GuessTwoDDiff='猜2D两不同号',
  GuessTwoDSame='猜2D两同号',
 
}
