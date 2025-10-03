import dayjs from 'dayjs';
import {
  PositionTicket,
  SevenStarPlayEnum,
  SevenStarSubPlayEnum,
} from '../../types';
import {pickDistinct} from '../../utils';
import {getBetCount} from './initBase';

export function sevenStarQuickPickOne(): string[][] {
  return [
    pickDistinct(1, 10),
    pickDistinct(1, 10),
    pickDistinct(1, 10),
    pickDistinct(1, 10),
    pickDistinct(1, 10),
    pickDistinct(1, 10),
    pickDistinct(1, 14),
  ];
}

export function sevenStarQuickPickOneTicket(): PositionTicket {
  const positions = sevenStarQuickPickOne();

  const betCount = getBetCount(positions);
  return {
    positions,
    betId: dayjs().valueOf().toString(),
    lotteryName: 'SevenStar',
    betAmount: betCount * 2,
    betCount,
    playMode: SevenStarPlayEnum.NORMAL,
    subPlayMode: SevenStarSubPlayEnum.DIRECT_SELECTION,
  };
}
