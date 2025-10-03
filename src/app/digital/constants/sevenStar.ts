import {DigitalColor, UIConfig} from '../types';
import {createDigitLabelConfig, POSITION_RULES} from '../utils';
const positionArr = [
  '第一位',
  '第二位',
  '第三位',
  '第四位',
  '第五位',
  '第六位',
  '第七位',
];

export function getSevenStarUIConfig(): UIConfig {
  // 默认：定位复式
  return {
    label: '定位复式',
    labels: positionArr.map(item =>
      createDigitLabelConfig({
        label: item,
        color: DigitalColor.red,
        min: 0,
        max: item === '第七位' ? 14 : 10,
        numbers: item === '第七位' ? 15 : 10,
      }),
    ),

    positionRules: POSITION_RULES.threeRequired(),
  };
}
