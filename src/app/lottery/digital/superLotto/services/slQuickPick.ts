
import { SuperLottoPlayEnum } from '../../shared/enums';
import {getSLRulesByPlayMode} from '../rules/slRules';

function pickDistinct(count: number, range: number, zeroBased = false): number[] {
  const s = new Set<number>();
  while (s.size < count) {
    const n = zeroBased ? Math.floor(Math.random() * range) : Math.floor(Math.random() * range) + 1;
    s.add(n);
  }
  return Array.from(s).sort((a, b) => a - b);
}

export function slQuickPick(playMode: SuperLottoPlayEnum): number[][] {
  const rules = getSLRulesByPlayMode(playMode);
  if (playMode === SuperLottoPlayEnum.NORMAL) {
    const front = pickDistinct(5, rules[0].numberRange);
    const back = pickDistinct(2, rules[1].numberRange);
    return [front, back];
  }
  // 胆拖：前胆1、前拖>=2，后胆<=1，后拖>=2
  const frontDan = pickDistinct(1, rules[0].numberRange);
  const backDan = pickDistinct(0, rules[2].numberRange); // 允许0或1，由外部规则控制

  const frontTuo: number[] = [];
  while (frontTuo.length < 2) {
    const n = Math.floor(Math.random() * rules[1].numberRange) + 1;
    if (!frontDan.includes(n) && !frontTuo.includes(n)) frontTuo.push(n);
  }
  const backTuo: number[] = [];
  while (backTuo.length < 2) {
    const n = Math.floor(Math.random() * rules[3].numberRange) + 1;
    if (!backDan.includes(n) && !backTuo.includes(n)) backTuo.push(n);
  }
  return [
    frontDan.sort((a, b) => a - b),
    frontTuo.sort((a, b) => a - b),
    backDan.sort((a, b) => a - b),
    backTuo.sort((a, b) => a - b),
  ];
}


