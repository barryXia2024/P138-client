import dayjs from 'dayjs';
import {
  PositionRule,
  PositionTicket,
  SuperLottoPlayEnum,
  SuperLottoSubPlayEnum,
} from '../../types';
import {pickDistinct} from '../../utils';
import {getBetCount} from './initBase';
 function getSLRulesByPlayMode(playMode: SuperLottoPlayEnum): PositionRule[] {
  if (playMode === SuperLottoPlayEnum.DANTUO) {
    return [
      {index: 0, minCount: 1, maxCount: 4, numberRange: 35}, // 前胆 1-4
      {index: 1, minCount: 2, maxCount: 35, numberRange: 35}, // 前拖 ≥2
      {index: 2, minCount: 0, maxCount: 1, numberRange: 12}, // 后胆 0-1
      {index: 3, minCount: 2, maxCount: 12, numberRange: 12}, // 后拖 ≥2
    ];
  }
  // NORMAL
  return [
    {index: 0, minCount: 5, maxCount: 35, numberRange: 35},
    {index: 1, minCount: 2, maxCount: 12, numberRange: 12},
  ];
}
export function superLottoQuickPickOne(playMode: SuperLottoPlayEnum): string[][] {
  const rules = getSLRulesByPlayMode(playMode);
  if (playMode === SuperLottoPlayEnum.NORMAL) {
    const front = pickDistinct(5, rules[0].numberRange);
    const back = pickDistinct(2, rules[1].numberRange);
    return [front, back];
  }
  // 胆拖：前胆1、前拖>=2，后胆<=1，后拖>=2
  const frontDan = pickDistinct(1, rules[0].numberRange);
  const backDan = pickDistinct(0, rules[2].numberRange); // 允许0或1，由外部规则控制

  const frontTuo: string[] = [];
  while (frontTuo.length < 2) {
    const n = Math.floor(Math.random() * rules[1].numberRange) + 1;
    if (!frontDan.includes(n.toString()) && !frontTuo.includes(n.toString())) frontTuo.push(n.toString());
  }
  const backTuo: string[] = [];
  while (backTuo.length < 2) {
    const n = Math.floor(Math.random() * rules[3].numberRange) + 1;
    if (!backDan.includes(n.toString()) && !backTuo.includes(n.toString())) backTuo.push(n.toString());
  }
  return [
    frontDan.sort((a, b) => Number(a) - Number(b)),
    frontTuo.sort((a, b) => Number(a) - Number(b)),
    backDan.sort((a, b) => Number(a) - Number(b)),
    backTuo.sort((a, b) => Number(a) - Number(b)),
  ];
}

export function superLottoQuickPickOneTicket( ): PositionTicket {
  const positions = superLottoQuickPickOne(SuperLottoPlayEnum.NORMAL);

  const betCount = getBetCount(positions,SuperLottoPlayEnum.NORMAL);
  return {
    positions,
    betId: dayjs().valueOf().toString(),
    lotteryName: 'SuperLotto',
    betAmount: betCount * 2,
    betCount,
    playMode: SuperLottoPlayEnum.NORMAL,
    subPlayMode: SuperLottoSubPlayEnum.DIRECT_SELECTION,
  };
}
