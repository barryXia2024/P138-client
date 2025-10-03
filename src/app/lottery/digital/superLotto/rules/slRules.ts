import {SuperLottoPlayEnum} from '../../shared/enums';

export interface SLRuleUnit {
  index: number;
  minCount: number;
  maxCount: number;
  numberRange: number;
}

export function getSLRulesByPlayMode(playMode: SuperLottoPlayEnum): SLRuleUnit[] {
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

export function normalizeSLPositions(playMode: SuperLottoPlayEnum): number[][] {
  const rules = getSLRulesByPlayMode(playMode);
  return Array.from({length: rules.length}, () => []);
}

export function validateSLPositions(playMode: SuperLottoPlayEnum, positions: number[][]): string | null {
  const rules = getSLRulesByPlayMode(playMode);

  // 长度校验
  if (positions.length !== rules.length) return '选号位数不正确';

  // 最小/最大限制
  for (let i = 0; i < rules.length; i++) {
    const r = rules[i];
    const len = positions[i]?.length ?? 0;
    if (len < r.minCount) return `第${i + 1}位至少选择${r.minCount}个号码`;
    if (typeof r.maxCount === 'number' && len > r.maxCount)
      return `第${i + 1}位最多选择${r.maxCount}个号码`;
  }

  // 胆拖互斥
  if (playMode === SuperLottoPlayEnum.DANTUO) {
    const frontDan = positions[0] ?? [];
    const frontTuo = positions[1] ?? [];
    const backDan = positions[2] ?? [];
    const backTuo = positions[3] ?? [];
    if (frontDan.some(n => frontTuo.includes(n))) return '前区胆码与拖码不能相同';
    if (backDan.some(n => backTuo.includes(n))) return '后区胆码与拖码不能相同';
  }

  return null;
}


