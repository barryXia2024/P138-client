import {Fucai3DPlayEnum, Fucai3DSubPlayEnum} from '../shared/enums';
import {UIConfig} from '../../core/types';
import {LABEL_CONFIGS} from '../utils/labelConfigs';
import {POSITION_RULES} from '../utils/positionRules';

export function getFucai3DUIConfig(
  playMode: Fucai3DPlayEnum,
  subPlayMode: Fucai3DSubPlayEnum,
): UIConfig {
  // 直选
  if (playMode === Fucai3DPlayEnum.DirectSelection) {
    if (subPlayMode === Fucai3DSubPlayEnum.PositioningDuplex) {
      return {
        label: '定位复式',
        labels: [
          LABEL_CONFIGS.hundred(),
          LABEL_CONFIGS.ten(),
          LABEL_CONFIGS.unit(),
        ],
        positionRules: POSITION_RULES.threeRequired(),
      };
    }
  }

  // 组三
  if (playMode === Fucai3DPlayEnum.GroupThree) {
    if (subPlayMode === Fucai3DSubPlayEnum.Single) {
      return {
        label: '组三单式',
        labels: [
          LABEL_CONFIGS.heavy(),
          LABEL_CONFIGS.single(),
        ],
        positionRules: [
          POSITION_RULES.required(0),
          POSITION_RULES.required(1),
        ],
      };
    }
    if (subPlayMode === Fucai3DSubPlayEnum.Duplex) {
      return {
        label: '组三复式',
        quickPick: [
          {label: '10选10 赔率 1.92', count: 10},
          {label: '10选9 赔率 2.40', count: 9},
          {label: '10选8 赔率 3.09', count: 8},
          {label: '10选7 赔率 4.12', count: 7},
        ],
        labels: [LABEL_CONFIGS.empty()],
        positionRules: [POSITION_RULES.singleColumn(2)],
      };
    }
  }

  // 组六
  if (playMode === Fucai3DPlayEnum.GroupSix) {
    if (subPlayMode === Fucai3DSubPlayEnum.Duplex) {
      return {
        label: '组六复式',
        quickPick: [
          {label: '10选10 赔率 1.92', count: 10},
          {label: '10选9 赔率 2.40', count: 9},
          {label: '10选8 赔率 3.09', count: 8},
          {label: '10选7 赔率 4.12', count: 7},
        ],
        labels: [LABEL_CONFIGS.empty()],
        positionRules: [POSITION_RULES.singleColumn(3)],
      };
    }
  }

  // 1D
  if (playMode === Fucai3DPlayEnum.OneD) {
    if (subPlayMode === Fucai3DSubPlayEnum.OneD) {
      return {
        label: '1D',
        labels: [
          LABEL_CONFIGS.hundred(),
          LABEL_CONFIGS.ten(),
          LABEL_CONFIGS.unit(),
        ],
        positionRules: POSITION_RULES.threeOptional(),
      };
    }
    if (subPlayMode === Fucai3DSubPlayEnum.GuessOneD) {
      return {
        label: '猜1D',
        labels: [LABEL_CONFIGS.empty()],
        positionRules: [POSITION_RULES.singleColumn(1)],
      };
    }
  }

  // 2D
  if (playMode === Fucai3DPlayEnum.TwoD) {
    if (subPlayMode === Fucai3DSubPlayEnum.TwoD) {
      return {
        label: '2D',
        labels: [
          LABEL_CONFIGS.hundred(),
          LABEL_CONFIGS.ten(),
          LABEL_CONFIGS.unit(),
        ],
        positionRules: POSITION_RULES.threeOptional(),
      };
    }
    if (subPlayMode === Fucai3DSubPlayEnum.GuessTwoDDiff) {
      return {
        label: '猜2D两不同号',
        labels: [LABEL_CONFIGS.empty()],
        positionRules: [POSITION_RULES.singleColumn(3)],
      };
    }
    if (subPlayMode === Fucai3DSubPlayEnum.GuessTwoDSame) {
      return {
        label: '猜2D两同号',
        labels: [LABEL_CONFIGS.empty()],
        positionRules: [POSITION_RULES.singleColumn(1)],
      };
    }
  }

  // 默认：定位复式
  return {
    label: '定位复式',
    labels: [
      LABEL_CONFIGS.hundred(),
      LABEL_CONFIGS.ten(),
      LABEL_CONFIGS.unit(),
    ],
    positionRules: POSITION_RULES.threeRequired(),
  };
}
