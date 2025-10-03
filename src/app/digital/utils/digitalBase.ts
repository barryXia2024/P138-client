 

import {DigitalColor, LabelConfig, PositionRule} from '../types';

/**
 * 生成指定数量的不重复随机数字（指定范围）
 * @param count 需要生成的数量
 * @param range 数字范围（0到range-1）
 * @param exclude 排除的数字数组
 * @returns 排序后的数字数组
 */
export function pickDistinct(
  count: number,
  range: number,
  exclude: number[] = [],
): string[] {
  const s = new Set<number>();
  while (s.size < count) {
    const n = Math.floor(Math.random() * range);
    if (!exclude.includes(n)) {
      s.add(n);
    }
  }
  return Array.from(s).sort((a, b) => a - b).map(String);
}

/**
 * 创建数字范围的标签配置
 * @param label 标签名称
 * @param color 颜色
 * @returns 标签配置
 */
export function createDigitLabelConfig(config: {
  label: string;
  max: number;
  numbers: number;
  min: number;
  color: DigitalColor;
}): LabelConfig {
  const {label, max = 10, numbers = 10, min = 0, color = DigitalColor.red} = config;
  return {
    label,
    color,
    min,
    max,
    numbers: Array.from({length: numbers}, (_, n) => n.toString()),
  };
}

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
  // 单列规则z
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

   // 百十个位可选
   sevenOptional: () => [
    createPositionRule(0, 1, 10),
    createPositionRule(1, 1, 10),
    createPositionRule(2, 1, 10),
    createPositionRule(3, 1, 10),
    createPositionRule(4, 1, 10),
    createPositionRule(5, 1, 10),
    createPositionRule(6, 1, 14,14),
  ],
} as const;
