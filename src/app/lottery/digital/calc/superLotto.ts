// 数字彩侧完整复制的大乐透与位置型（七星彩等）计算逻辑
// 使用 any 降低耦合，仅依赖 positions 结构与 mode/playMode 字段

import {SuperLottoPlayEnum} from '../shared/enums';
import {PositionTicket, SuperLottoTicket} from '../core/types';
import { Fucai3DPlayEnum, Fucai3DSubPlayEnum } from '../fucai3d/shared/enums';
import { Fucai3DTicket } from '../fucai3d/core/types';
import { f3dComputeBetCount, f3dGenerateBetItem, f3dGenerateBetPlay } from '../fucai3d/calc/f3dCalculator';
import { isEmpty } from '@/p138-react-common/utils';

function combination(n: number, k: number): number {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = (result * (n - i + 1)) / i;
  }
  return result;
}

export function computeSuperLotto(ticket: SuperLottoTicket) {
  const positions: number[][] = ticket.positions || [];
  if (
    positions.length === 0 ||
    positions.some(pos => (pos?.length ?? 0) === 0)
  ) {
    return {betCount: 0, betAmount: 0, betContent: '', playType: ''};
  }

  const isNormal = ticket.playMode === SuperLottoPlayEnum.NORMAL;

  let betCount = 0;
  if (isNormal) {
    const redCombinations = combination(positions[0].length, 5);
    const blueCombinations = combination(positions[1].length, 2);
    betCount = redCombinations * blueCombinations;
  } else {
    const redDan = positions[0]?.length ?? 0;
    const redTuo = positions[1]?.length ?? 0;
    const blueDan = positions[2]?.length ?? 0;
    const blueTuo = positions[3]?.length ?? 0;
    const redCombinations = combination(redTuo, 5 - redDan);
    const blueCombinations = combination(blueTuo, 2 - blueDan);
    betCount = redCombinations * blueCombinations;
  }

  const betAmount = betCount * 2;
  const betContent = isNormal
    ? `${(positions[0] || []).slice().sort((a, b) => a - b).join('|')}#${(positions[1] || [])
        .slice()
        .sort((a, b) => a - b)
        .join('|')}`
    : `${(positions[0] || []).slice().sort((a, b) => a - b).join('|')}|${(positions[1] || [])
        .slice()
        .sort((a, b) => a - b)
        .join('|')}#${(positions[2] || [])
        .slice()
        .sort((a, b) => a - b)
        .join('|')}|${(positions[3] || [])
        .slice()
        .sort((a, b) => a - b)
        .join('|')}`;
  const playType =
    betCount === 1
      ? '单式'
      : ticket.playMode === SuperLottoPlayEnum.DANTUO
        ? '胆拖'
        : '复式';

  return {betCount, betAmount, betContent, playType};
}

export function computeSevenStar(ticket: PositionTicket) {
  const positions: number[][] = ticket.positions || [];
  const betCount = positions.reduce((acc, pos) => acc * (pos?.length ?? 0), 1);
  const betAmount = betCount * 2;
  const betContent = positions.map(pos => (pos || []).join('|')).join('#');
  const playType = betCount > 1 ? '复式' : '单式';
  return {betCount, betAmount, betContent, playType};
}


export function computeFucai3D(ticket: Fucai3DTicket) {
 
  const betCount = f3dComputeBetCount(ticket);
  const betAmount = betCount * 2;
  const betContent = f3dGenerateBetItem(ticket);
  let {playMode, subPlayMode} =  f3dGenerateBetPlay(ticket);
  let playType = isEmpty(subPlayMode)?playMode:`${playMode}[${subPlayMode}]`;
  return {betCount, betAmount, betContent, playType};
}
