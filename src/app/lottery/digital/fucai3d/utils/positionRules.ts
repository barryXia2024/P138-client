/**
 * 福彩3D位置规则生成器
 */

import {PositionRule} from '../../core/types';

/**
 * 创建位置规则
 * @param index 位置索引
 * @param minCount 最小选择数量
 * @param maxCount 最大选择数量
 * @param numberRange 数字范围
 * @returns 位置规则
 */
export function createPositionRule(
  index: number, 
  minCount: number, 
  maxCount: number, 
  numberRange: number = 10
): PositionRule {
  return {index, minCount, maxCount, numberRange};
}

// 常用的位置规则配置
export const POSITION_RULES = {
  // 必须选1个的规则
  required: (index: number) => createPositionRule(index, 1, 10),
  // 可选的规则
  optional: (index: number) => createPositionRule(index, 0, 10),
  // 单列规则
  singleColumn: (minCount: number) => createPositionRule(0, minCount, 10),
  // 百十个位必须选1个
  threeRequired: () => [
    createPositionRule(0, 1, 10),
    createPositionRule(1, 1, 10),
    createPositionRule(2, 1, 10),
  ],
  // 百十个位可选
  threeOptional: () => [
    createPositionRule(0, 0, 10),
    createPositionRule(1, 0, 10),
    createPositionRule(2, 0, 10),
  ],
} as const;
