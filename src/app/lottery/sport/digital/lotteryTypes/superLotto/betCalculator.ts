import {DoubleBallPlayEnum} from 'src/app/lottery/welfare/doubleBall/constants';
import {PositionTicket, SuperLottoTicket} from '../../core';
import {SuperLottoPlayEnum} from '../../types';
import {ArrangedThreePlayEnum} from '../../arrangedThree/constants';
import {ArrangedThreeSubPlayEnum} from '../arrangedThree/uiConfig';
import {Happy8PlayEnum} from 'src/app/lottery/welfare/happy8/constants';

// 计算组合数 C(n, k)
function combination(n: number, k: number): number {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;

  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = (result * (n - i + 1)) / i;
  }
  return result;
}

// 计算大乐透注数
export function calculateBetCount(
  ticket: Omit<SuperLottoTicket, 'betId' | 'betAmount' | 'betCount'>,
): number {
  if (
    ticket.mode === 'normal' ||
    ticket.playMode === SuperLottoPlayEnum.NORMAL ||
    ticket.mode === SuperLottoPlayEnum.NORMAL
  ) {
    // 普通模式：C(红球数, 5) * C(蓝球数, 2)
    const redCombinations = combination(ticket.positions[0].length, 5);
    const blueCombinations = combination(ticket.positions[1].length, 2);
    return redCombinations * blueCombinations;
  } else {
    // 胆拖模式：前区胆码+拖码，后区胆码+拖码
    // positions[0]: 前区胆码，positions[1]: 前区拖码
    // positions[2]: 后区胆码，positions[3]: 后区拖码
    const redDanCount = ticket.positions[0].length; // 前区胆码数
    const redTuoCount = ticket.positions[1].length; // 前区拖码数
    const blueDanCount = ticket.positions[2].length; // 后区胆码数
    const blueTuoCount = ticket.positions[3].length; // 后区拖码数

    // 前区：C(拖码数, 5-胆码数)
    const redCombinations = combination(redTuoCount, 5 - redDanCount);
    // 后区：C(拖码数, 2-胆码数)
    const blueCombinations = combination(blueTuoCount, 2 - blueDanCount);

    console.log('大乐透胆拖计算:', {
      redDan: redDanCount,
      redTuo: redTuoCount,
      blueDan: blueDanCount,
      blueTuo: blueTuoCount,
      redCombinations,
      blueCombinations,
    });

    return redCombinations * blueCombinations;
  }
}

// 计算大乐透金额
export function calculateBetAmount(
  ticket: Omit<SuperLottoTicket, 'betId' | 'betAmount' | 'betCount'>,
): number {
  const betCount = calculateBetCount(ticket);
  return betCount * 2; // 每注2元
}

// 生成投注内容字符串
export function generateBetContent(
  ticket: Omit<SuperLottoTicket, 'betId' | 'betAmount' | 'betCount'>,
): string {
  if (
    ticket.mode === 'normal' ||
    ticket.playMode === SuperLottoPlayEnum.NORMAL ||
    ticket.mode === SuperLottoPlayEnum.NORMAL
  ) {
    const redStr = ticket.positions[0].sort((a, b) => a - b).join('|');
    const blueStr = ticket.positions[1].sort((a, b) => a - b).join('|');
    return `${redStr}#${blueStr}`;
  } else {
    const redDanStr = ticket.positions[0].sort((a, b) => a - b).join('|');
    const redTuoStr = ticket.positions[1].sort((a, b) => a - b).join('|');
    const blueDanStr = ticket.positions[2].sort((a, b) => a - b).join('|');
    const blueTuoStr = ticket.positions[3].sort((a, b) => a - b).join('|');
    return `${redDanStr}#${redTuoStr}-${blueDanStr}#${blueTuoStr}`;
  }
}

// 生成玩法标识
export function generatePlayType(
  ticket: Omit<SuperLottoTicket, 'betId' | 'betAmount' | 'betCount'>,
): string {
  const betCount = calculateBetCount(ticket);
  if (betCount === 1) {
    return '单式';
  } else if (
    ticket.mode === 'dantuo' ||
    ticket.mode === SuperLottoPlayEnum.DANTUO ||
    ticket.playMode === SuperLottoPlayEnum.DANTUO
  ) {
    return '胆拖';
  } else {
    return '复式';
  }
}

// 完整计算函数
export function computeSuperLotto(ticket: SuperLottoTicket) {
  if (
    ticket.positions.length === 0 ||
    ticket.positions.some(pos => pos.length === 0)
  ) {
    return {
      betCount: 0,
      betAmount: 0,
      betContent: '',
      playType: '',
    };
  }

  const betCount = calculateBetCount(ticket);
  const betAmount = calculateBetAmount(ticket);
  const betContent = generateBetContent(ticket);
  const playType = generatePlayType(ticket);

  return {
    betCount,
    betAmount,
    betContent,
    playType,
  };
}

export function computeSevenStar(
  ticket: Omit<PositionTicket, 'betId' | 'betAmount' | 'betCount'>,
) {
  const betCount = ticket.positions.reduce((acc, pos) => acc * pos.length, 1);

  const betAmount = betCount * 2;
  let betContent = ticket.positions.map(pos => pos.join('|')).join('#');
  if (
    ticket.playMode === ArrangedThreePlayEnum.GroupThree &&
    ticket.subPlayMode === ArrangedThreeSubPlayEnum.Single
  ) {
    betContent = ticket.positions.map(pos => pos.join('')).join('#');
  }

  const playType = betCount > 1 ? '复式' : '单式';

  return {
    betCount,
    betAmount,
    betContent,
    playType,
  };
}

export function computeArrangeThree(
  ticket: Omit<PositionTicket, 'betId' | 'betAmount' | 'betCount'>,
) {
  const betCount = ticket.positions.reduce((acc, pos) => acc * pos.length, 1);

  const betAmount = betCount * 2;
  const betContent = ticket.positions.map(pos => pos.join('|')).join('#');
  const playType = betCount > 1 ? '复式' : '单式';

  return {
    betCount,
    betAmount,
    betContent,
    playType,
  };
}
export function computeArrangeFive(
  ticket: Omit<PositionTicket, 'betId' | 'betAmount' | 'betCount'>,
) {
  const betCount = ticket.positions.reduce((acc, pos) => acc * pos.length, 1);

  const betAmount = betCount * 2;
  const betContent = ticket.positions.map(pos => pos.join('|')).join('#');
  const playType = betCount > 1 ? '复式' : '单式';

  return {
    betCount,
    betAmount,
    betContent,
    playType,
  };
}
const generateBetContentDoubleBall = (
  ticket: Omit<PositionTicket, 'betId' | 'betAmount' | 'betCount'>,
) => {
  if (ticket.playMode === SuperLottoPlayEnum.NORMAL) {
    const redStr = ticket.positions[0].sort((a, b) => a - b).join('|');
    const blueStr = ticket.positions[1].sort((a, b) => a - b).join('|');
    return `${redStr}#${blueStr}`;
  } else {
    const redDanStr = ticket.positions[0].sort((a, b) => a - b).join('|');
    const redTuoStr = ticket.positions[1].sort((a, b) => a - b).join('|');
    const blueDanStr = ticket.positions[2].sort((a, b) => a - b).join('|');

    return `${redDanStr}#${redTuoStr}-${blueDanStr}`;
  }
};

 

const playTypeHappy8 = (
  ticket: Omit<PositionTicket, 'betId' | 'betAmount' | 'betCount'>,
  betCount: number,
) => {
  if (ticket.playMode === Happy8PlayEnum.normal) {
    return `${ticket.subPlayMode}[${Number(betCount) === 1 ? '单式' : '复式'}]`;
  } else {
    return `${ticket.subPlayMode}[胆拖]`;
  }
};
export function computeHappy8(
  ticket: PositionTicket,
) {
  const betCount = ticket.betCount;
  const betAmount = betCount * 2;
  const betContent = ticket.positions.map(pos => pos.join('|')).join('#');
  const playType = playTypeHappy8(ticket, betCount);
  return {
    betCount,
    betAmount,
    betContent,
    playType,
  };
}

// 计算大乐透注数
export function calculateBetCountDoubleBall(
  ticket: Omit<PositionTicket, 'betId' | 'betAmount' | 'betCount'>,
): number {
  if (ticket.playMode === DoubleBallPlayEnum.normal) {
    // 普通模式：C(红球数, 5) * C(蓝球数, 2)
    const redCombinations = combination(ticket.positions[0].length, 6);
    const blueCombinations = combination(ticket.positions[1].length, 1);
    return redCombinations * blueCombinations;
  } else {
    // 胆拖模式：前区胆码+拖码，后区胆码+拖码
    // positions[0]: 前区胆码，positions[1]: 前区拖码
    // positions[2]: 后区胆码，positions[3]: 后区拖码
    const redDanCount = ticket.positions[0].length; // 前区胆码数
    const redTuoCount = ticket.positions[1].length; // 前区拖码数
    const blueDanCount = ticket.positions[2].length; // 后区胆码数

    // 前区：C(拖码数, 5-胆码数)
    const redCombinations = combination(redTuoCount, 6 - redDanCount);

    return redCombinations * blueDanCount;
  }
}
export function computeDoubleBall(
  ticket: Omit<PositionTicket, 'betId' | 'betAmount' | 'betCount'>,
) {
  const betContent = generateBetContentDoubleBall(ticket);
  const betCount = calculateBetCountDoubleBall(ticket);

  const betAmount = betCount * 2;
  const playType =
    ticket.playMode === DoubleBallPlayEnum.dantuo
      ? '胆拖'
      : betCount > 1
        ? '复式'
        : '单式';

  return {
    betCount,
    betAmount,
    betContent,
    playType,
  };
}
