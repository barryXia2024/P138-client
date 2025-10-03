import {Fucai3DPlayEnum, Fucai3DSubPlayEnum} from '../shared/enums';
import {pickDistinct, pickSingle, pickDistinctInRange} from '../utils/numberGenerators';

export function f3dQuickPick(playMode: Fucai3DPlayEnum, subPlayMode: Fucai3DSubPlayEnum): number[][] {
  
  if (playMode === Fucai3DPlayEnum.DirectSelection) {
    if (subPlayMode === Fucai3DSubPlayEnum.PositioningDuplex) {
      // 定位复式：百十个位各选1个
      return [
        [pickSingle()],
        [pickSingle()],
        [pickSingle()],
      ];
    }
  }
  
  if (playMode === Fucai3DPlayEnum.GroupThree) {
    if (subPlayMode === Fucai3DSubPlayEnum.Single) {
      // 组三单式：重号1个，单号1个，且不能相同
      const heavy = pickDistinct(1);
      const single = pickDistinct(1, heavy);
      return [heavy, single];
    }
    if (subPlayMode === Fucai3DSubPlayEnum.Duplex) {
      // 组三复式：选2个不同数字
      return [pickDistinct(2)];
    }
  }

  if (playMode === Fucai3DPlayEnum.GroupSix) {
    if (subPlayMode === Fucai3DSubPlayEnum.Duplex) {
      // 组六复式：选3个不同数字
      return [pickDistinct(3)];
    }
  }

  if (playMode === Fucai3DPlayEnum.OneD) {
    if (subPlayMode === Fucai3DSubPlayEnum.OneD) {
      // 1D：在百十个中随机选一个位置，然后在该位置选1个数字
      const positions = [0, 1, 2]; // 百十个
      const randomPosition = positions[Math.floor(Math.random() * positions.length)];
      const result: number[][] = [[], [], []];
      result[randomPosition] = [pickSingle()];
      return result;
    }
    if (subPlayMode === Fucai3DSubPlayEnum.GuessOneD) {
      // 1D猜：选1个数字
      return [[pickSingle()]];
    }
  }

  if (playMode === Fucai3DPlayEnum.TwoD) {
    if (subPlayMode === Fucai3DSubPlayEnum.TwoD) {
      // 2D：在百十个中随机选两个不同位置，然后在这两个位置各选1个数字
      const selectedPositions = pickDistinctInRange(2, 3);
      const result: number[][] = [[], [], []];
      selectedPositions.forEach(pos => {
        result[pos] = [pickSingle()];
      });
      return result;
    }
    if (subPlayMode === Fucai3DSubPlayEnum.GuessTwoDDiff) {
      // 猜2D两不同号：选3个不同数字
      return [pickDistinct(3)];
    }
    if (subPlayMode === Fucai3DSubPlayEnum.GuessTwoDSame) {
      // 猜2D两同号：选1个数字
      return [[pickSingle(),pickSingle()]];
    }
  }

  // 默认：定位复式
  return [
    [pickSingle()],
    [pickSingle()],
    [pickSingle()],
  ];
}

