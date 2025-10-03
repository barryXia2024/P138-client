import {SuperLottoPlayEnum} from '../../shared/enums';
import {SuperLottoTicket} from '../../core/types';

export function combination(n: number, k: number): number {
  if (k < 0 || n < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let num = 1;
  let den = 1;
  for (let i = 1; i <= k; i++) {
    num *= n - i + 1;
    den *= i;
  }
  return Math.round(num / den);
}

export function slComputeBetCount(ticket: SuperLottoTicket): number {
  const p = ticket.positions;
  if (ticket.playMode === SuperLottoPlayEnum.NORMAL) {
    return combination(p[0]?.length ?? 0, 5) * combination(p[1]?.length ?? 0, 2);
  }
  const frontDan = p[0]?.length ?? 0;
  const frontTuo = p[1]?.length ?? 0;
  const backDan = p[2]?.length ?? 0;
  const backTuo = p[3]?.length ?? 0;
  if (frontTuo < 2 || backTuo < 2) return 0;
  const frontComb = combination(frontTuo, 5 - frontDan);
  const backComb = backDan > 0 ? combination(backTuo, 2 - backDan) : combination(backTuo, 2);
  return frontComb * backComb;
}

export function slGenerateBetItem(ticket: SuperLottoTicket): string {
  const p = ticket.positions;
  if (ticket.playMode === SuperLottoPlayEnum.NORMAL) {
    // 普通：号码之间用 | ，前后区之间用 -
    return `${(p[0] || []).join('|')}#${(p[1] || []).join('|')}`;
  }
  // 胆拖：号码之间用 | ，胆拖之间用 # ，前后区之间用 -
  // 前区：前胆#前拖  后区：后胆#后拖
  const front = `${(p[0] || []).join('|')}#${(p[1] || []).join('|')}`;
  const back = `${(p[2] || []).join('|')}#${(p[3] || []).join('|')}`;
  return `${front}-${back}`;
}

export function slGenerateBetPlay(ticket: SuperLottoTicket): string {
  if (ticket.playMode === SuperLottoPlayEnum.DANTUO) return '胆拖';
  const betCount = slComputeBetCount(ticket);
  return betCount === 1 ? '单式' : '复式';
}


