import { DoubleBallPlayEnum } from 'src/app/lottery/welfare/doubleBall/constants';
import { ArrangedFivePlayEnum, ArrangedFiveSubPlayEnum } from '../arrangedFive/constants';
import { ArrangedThreePlayEnum, ArrangedThreeSubPlayEnum } from '../arrangedThree/constants';
import {DigitalLotteryNames} from '../lotteryTypes/configs/lotteryConfigs';
import {SuperLottoPlayEnum} from '../superLotto/constants/index';
import { LotteryPlayEnum, SuperLottoSubPlayEnum } from '../types';
import { Happy8PlayEnum } from 'src/app/lottery/welfare/happy8/constants';

// 基础投注票据接口
export interface BaseTicket {
  lotteryName: DigitalLotteryNames;
  betId: string;
  betAmount: number;
  betCount: number;
}

// 大乐透票据
export interface SuperLottoTicket extends BaseTicket {
  lotteryName: DigitalLotteryNames;
  positions: number[][]; // 每个位置的选号数组
  mode: 'normal' | 'dantuo';
  append: '1' | '2';
  playMode: SuperLottoPlayEnum;
  subPlayMode: SuperLottoSubPlayEnum;
}

export interface ArrangedFiveTicket extends BaseTicket {
  lotteryName: DigitalLotteryNames;
  positions: number[][]; // 每个位置的选号数组
  playMode: ArrangedFivePlayEnum;
  subPlayMode: ArrangedFiveSubPlayEnum;
}
// 位置型彩票票据（七星彩、排列三、排列五）
export interface PositionTicket extends BaseTicket {
  lotteryName: DigitalLotteryNames;
  positions: number[][]; // 每个位置的选号数组
  playMode: ArrangedThreePlayEnum | DoubleBallPlayEnum | LotteryPlayEnum | SuperLottoPlayEnum | Happy8PlayEnum;
  subPlayMode: ArrangedThreeSubPlayEnum | Happy8PlayEnum;
}

// 统一票据类型
export type DigitalTicket = SuperLottoTicket | PositionTicket | ArrangedFiveTicket;

// 彩种配置接口
export interface LotteryConfig {
  name: string;
  positions: number;
  numberRange: number[]; // 每个位置的号码范围
  minSelections: number[]; // 每个位置最少选号数
  pricePerBet: number; // 每注价格
}

// 彩种配置映射
export const LOTTERY_CONFIGS: Record<DigitalLotteryNames, LotteryConfig> = {
  SuperLotto: {
    name: '大乐透',
    positions: 2, // 前区+后区
    numberRange: [35, 12], // 前区1-35，后区1-12
    minSelections: [5, 2], // 前区至少5个，后区至少2个
    pricePerBet: 2,
  },
  SevenStar: {
    name: '七星彩',
    positions: 7,
    numberRange: [10, 10, 10, 10, 10, 10, 15], // 第7位0-14
    minSelections: [1, 1, 1, 1, 1, 1, 1],
    pricePerBet: 2,
  },
  ArrangedThree: {
    name: '排列三',
    positions: 3,
    numberRange: [10, 10, 10],
    minSelections: [1, 1, 1],
    pricePerBet: 2,
  },
  ArrangedFive: {
    name: '排列五',
    positions: 5,
    numberRange: [10, 10, 10, 10, 10],
    minSelections: [1, 1, 1, 1, 1],
    pricePerBet: 2,
  },
  DoubleBall: {
    name: '双色球',
    positions: 2,
    numberRange: [33, 16],
    minSelections: [6, 1],
    pricePerBet: 2,
  },
  SevenHappy: {
    name: '快乐7',
    positions: 1,
    numberRange: [30],
    minSelections: [1],
    pricePerBet: 2,
  },
  Happy8: {
    name: '快乐8',
    positions: 1,
    numberRange: [80],
    minSelections: [1],
    pricePerBet: 2,
  }
};
