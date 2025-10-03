import {computeFucai3D, computeSevenStar} from './superLotto';
import {
  DigitalLotteryName,
  BaseTicket,
  SuperLottoTicket,
  PositionTicket,
} from '../core/types';
import {
  slComputeBetCount,
  slGenerateBetItem,
  slGenerateBetPlay,
} from '../superLotto/calc/slCalculator';

type CalculatorResult = {
  betCount: number;
  betAmount: number;
  betContent?: string;
  betPlay?: string;
  playType?: string;
  betItem?: string;
};

type Calculator = (ticket: BaseTicket) => CalculatorResult;

export const calculatorRegistry: Record<DigitalLotteryName, Calculator> = {
  SuperLotto: ticket => {
    const slTicket = ticket as SuperLottoTicket;
    const betCount = slComputeBetCount(slTicket);
    const betItem = slGenerateBetItem(slTicket);
    const betPlay = slGenerateBetPlay(slTicket);
    return {
      betCount,
      betAmount: 0,
      betContent: betItem,
      playType: betPlay,
      betItem,
      betPlay,
    };
  },
  SevenStar: ticket => {
    const posTicket = ticket as PositionTicket;
    const { betCount, betAmount, betContent, playType } = computeSevenStar(posTicket);
    return {
      betCount,
      betAmount,
      betContent: betContent ?? '',
      playType,
      betItem: betContent ?? '',
      betPlay: playType ?? ('' as string),
    };
  },
  ArrangedThree: function (ticket: BaseTicket): CalculatorResult {
    const posTicket = ticket as PositionTicket;
    const { betCount, betAmount, betContent, playType } = computeSevenStar(posTicket);
    return {
      betCount,
      betAmount,
      betContent: betContent ?? '',
      playType,
      betItem: betContent ?? '',
      betPlay: playType ?? ('' as string),
    };
  },
  ArrangedFive: function (ticket: BaseTicket): CalculatorResult {
    const posTicket = ticket as PositionTicket;
    const { betCount, betAmount, betContent, playType } = computeSevenStar(posTicket);
    return {
      betCount,
      betAmount,
      betContent: betContent ?? '',
      playType,
      betItem: betContent ?? '',
      betPlay: playType ?? ('' as string),
    };
  },
  DoubleBall: function (ticket: BaseTicket): CalculatorResult {
    const posTicket = ticket as PositionTicket;
    const { betCount, betAmount, betContent, playType } = computeSevenStar(posTicket);
    return {
      betCount,
      betAmount,
      betContent: betContent ?? '',
      playType,
      betItem: betContent ?? '',
      betPlay: playType ?? ('' as string),
    };
  },
  Fucai3D: function (ticket: BaseTicket): CalculatorResult {
    const posTicket = ticket as PositionTicket;
    const { betCount, betAmount, betContent, playType } = computeFucai3D(posTicket);
    return {
      betCount,
      betAmount,
      betContent: betContent ?? '',
      playType,
      betItem: betContent ?? '',
      betPlay: playType ?? ('' as string),
    };
  }
};
