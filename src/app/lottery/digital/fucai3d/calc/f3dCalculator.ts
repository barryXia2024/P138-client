import {Fucai3DPlayEnum, Fucai3DSubPlayEnum} from '../shared/enums';
import {Fucai3DTicket} from '../core/types';
import {combination} from '../utils/mathUtils';

export function f3dComputeBetCount(ticket: Fucai3DTicket): number {
  const {playMode, subPlayMode, positions} = ticket;

  if (playMode === Fucai3DPlayEnum.DirectSelection) {
    if (subPlayMode === Fucai3DSubPlayEnum.PositioningDuplex) {
      // 定位复式：百位数×十位数×个位数
      return positions.reduce((acc, pos) => acc * (pos?.length ?? 0), 1);
    }
  }

  if (playMode === Fucai3DPlayEnum.GroupThree) {
    if (subPlayMode === Fucai3DSubPlayEnum.Single) {
      // 组三：C(n,2) * 2
      const n = positions.length ?? 0;
      return n < 2 ? 0 : 1;
    }
    if (subPlayMode === Fucai3DSubPlayEnum.Duplex) {
      // 组六：C(n,3)
      const n = positions[0]?.length ?? 0;
      return n < 2 ? 0 : combination(n, 2) * 2;
    }
  }

  if (playMode === Fucai3DPlayEnum.GroupSix) {
    if (subPlayMode === Fucai3DSubPlayEnum.Duplex) {
      // 组六：C(n,3)
      const n = positions[0]?.length ?? 0;
      return n < 2 ? 0 : combination(n, 3);
    }
  }
  if (playMode === Fucai3DPlayEnum.OneD) {
    if (subPlayMode === Fucai3DSubPlayEnum.OneD) {
      // 1D：C(n,3)
      const count = positions.reduce((sum, pos) => {
        return sum + (pos?.length ?? 0);
      }, 0);
      return count;
    }
    if (subPlayMode === Fucai3DSubPlayEnum.GuessOneD) {
      // 1D猜：C(n,1)
      const n = positions[0]?.length ?? 0;
      return n * 3;
    }
  }
  if (playMode === Fucai3DPlayEnum.TwoD) {
    if (subPlayMode === Fucai3DSubPlayEnum.TwoD) {
      const lens = positions.map(pos => pos?.length ?? 0);

      // 所有的两两组合
      const pairCombos = [
        [lens[0], lens[1]], // 百、十
        [lens[0], lens[2]], // 百、个
        [lens[1], lens[2]], // 十、个
      ];

      // 遍历组合，计算注数
      return pairCombos.reduce((sum, [a, b]) => {
        if (a > 0 && b > 0) {
          sum += a * b;
        }
        return sum;
      }, 0);
    }
    if (subPlayMode === Fucai3DSubPlayEnum.GuessTwoDDiff) {
      // 2D猜：C(n,2)
      const n = positions[0]?.length ?? 0;
      return n < 3 ? 0 : (n * (n - 1)) / 2;
    }
    if (subPlayMode === Fucai3DSubPlayEnum.GuessTwoDSame) {
      // 2D猜：C(n,2)
      const n = positions[0]?.length ?? 0;
      return n < 2 ? 0 : n;
    }
  }

  return 0;
}

export function f3dGenerateBetItem(ticket: Fucai3DTicket): string {
  const {playMode, subPlayMode, positions} = ticket;

  if (
    playMode === Fucai3DPlayEnum.DirectSelection &&
    subPlayMode === Fucai3DSubPlayEnum.PositioningDuplex
  ) {
    // 定位复式：百位#十位#个位
    return positions.map(pos => (pos || []).join('|')).join('#');
  }
  if (playMode === Fucai3DPlayEnum.GroupThree) {
    if (subPlayMode === Fucai3DSubPlayEnum.Single) {
      return positions
        .map((pos, index) => {
          if (index === 0) {
            return pos.map(p => `${p}${p}`);
          }
          return pos.join('|');
        })
        .join('#');
    }
  }

  if (
    playMode === Fucai3DPlayEnum.OneD &&
    subPlayMode === Fucai3DSubPlayEnum.OneD
  ) {
    return positions.map(p => p.join('|')).join('#');
  }
  if (
    playMode === Fucai3DPlayEnum.TwoD &&
    subPlayMode === Fucai3DSubPlayEnum.TwoD
  ) {
    return positions.map(p => p.join('|')).join('#');
  }

  // 其他情况：单列选号
  return (positions[0] || []).join('|');
}

export function f3dGenerateBetPlay(ticket: Fucai3DTicket): {
  playMode: string;
  subPlayMode: string;
} {
  const {playMode, subPlayMode} = ticket;
  const betCount = f3dComputeBetCount(ticket);

  if (playMode === Fucai3DPlayEnum.DirectSelection) {
    if (subPlayMode === Fucai3DSubPlayEnum.PositioningDuplex) {
      return {
        playMode: '直选',
        subPlayMode: betCount > 1 ? '复式' : '单式',
      };
    }
  }

  if (playMode === Fucai3DPlayEnum.GroupThree) {
    if (subPlayMode === Fucai3DSubPlayEnum.Single) {
      return {
        playMode: '组三',
        subPlayMode: '单式',
      };
    }
    if (subPlayMode === Fucai3DSubPlayEnum.Duplex) {
      return {
        playMode: '组三',
        subPlayMode: '复式',
      };
    }
  }
  if (playMode === Fucai3DPlayEnum.GroupSix) {
    if (subPlayMode === Fucai3DSubPlayEnum.Duplex) {
      return {
        playMode: '组六',
        subPlayMode: betCount > 1 ? '复式' : '',
      };
    }
  }
  if (playMode === Fucai3DPlayEnum.OneD) {
    if (subPlayMode === Fucai3DSubPlayEnum.OneD) {
      return {
        playMode: '1D',
        subPlayMode: '',
      };
    }
    if (subPlayMode === Fucai3DSubPlayEnum.GuessOneD) {
      return {
        playMode: '猜1D',
        subPlayMode: '',
      };
    }
  }
  if (playMode === Fucai3DPlayEnum.TwoD) {
    if (subPlayMode === Fucai3DSubPlayEnum.TwoD) {
      return {
        playMode: '2D',
        subPlayMode: '',
      };
    }
    if (subPlayMode === Fucai3DSubPlayEnum.GuessTwoDDiff) {
      return {
        playMode: '猜2D-两不同号',
        subPlayMode: '',
      };
    }
    if (subPlayMode === Fucai3DSubPlayEnum.GuessTwoDSame) {
      return {
        playMode: '猜2D-两同号',
        subPlayMode: '',
      };
    }
  }
  return {
    playMode: '直选',
    subPlayMode: '单式',
  };
}
