/**
 * 福彩3D标签配置生成器
 */

import {LabelConfig} from '../../core/types';

/**
 * 创建0-9数字范围的标签配置
 * @param label 标签名称
 * @param color 颜色
 * @returns 标签配置
 */
export function createDigitLabelConfig(
  label: string,
  color: 'red' | 'blue' = 'red',
): LabelConfig {
  return {
    label,
    color,
    min: 0,
    max: 9,
    numbers: Array.from({length: 10}, (_, n) => n),
  };
}

// 常用的标签配置
export const LABEL_CONFIGS = {
  hundred: () => createDigitLabelConfig('百位'),
  ten: () => createDigitLabelConfig('十位'),
  unit: () => createDigitLabelConfig('个位'),
  heavy: () => createDigitLabelConfig('重号'),
  single: () => createDigitLabelConfig('单号'),
  empty: () => createDigitLabelConfig(''),
} as const;
