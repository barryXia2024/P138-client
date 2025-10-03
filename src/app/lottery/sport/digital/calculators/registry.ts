import { PositionTicket } from '../core';
import {
  computeDoubleBall,
  computeHappy8,
  computeSevenStar,
  computeSuperLotto,
} from '../lotteryTypes';
import {DigitalLotteryNames} from '../lotteryTypes/configs/lotteryConfigs';

type CalculatorResult = {
  betCount: number;
  betAmount: number;
  betContent?: string;
  betPlay?: string;
  playType?: string;
  betItem?: string;
};

type Calculator = (ticket: any) => CalculatorResult;

export const calculatorRegistry: Record<DigitalLotteryNames, Calculator> = {
  SuperLotto: ticket => {
    const {betCount, betAmount, betContent, playType} =
      computeSuperLotto(ticket);
    return {
      betCount,
      betAmount,
      betContent: betContent ?? '',
      playType,
      betItem: betContent ?? '',
      betPlay: playType ?? (null as unknown as string),
    };
  },
  SevenStar: ticket => {
    const {betCount, betAmount, betContent, playType} =
      computeSevenStar(ticket);
    return {
      betCount,
      betAmount,
      betContent: betContent ?? '',
      playType,
      betItem: betContent ?? '',
      betPlay: playType ?? (null as unknown as string),
    };
  },
  ArrangedThree: function (ticket: any): CalculatorResult {
    const {betCount, betAmount, betContent, playType} =
      computeSevenStar(ticket);
    return {
      betCount,
      betAmount,
      betContent: betContent ?? '',
      playType,
      betItem: betContent ?? '',
      betPlay: playType ?? (null as unknown as string),
    };
  },
  ArrangedFive: function (ticket: any): CalculatorResult {
    const {betCount, betAmount, betContent, playType} =
      computeSevenStar(ticket);
    return {
      betCount,
      betAmount,
      betContent: betContent ?? '',
      playType,
      betItem: betContent ?? '',
      betPlay: playType ?? (null as unknown as string),
    };
  },
  DoubleBall: function (ticket: any): CalculatorResult {
    const {betCount, betAmount, betContent, playType} =
      computeDoubleBall(ticket);
    return {
      betCount,
      betAmount,
      betContent: betContent ?? '',
      playType,
      betItem: betContent ?? '',
      betPlay: playType ?? (null as unknown as string),
    };
  },
  SevenHappy: function (ticket: any): CalculatorResult {
    const {betCount, betAmount, betContent, playType} =
      computeSevenStar(ticket);
    return {
      betCount,
      betAmount,
      betContent: betContent ?? '',
      playType,
      betItem: betContent ?? '',
      betPlay: playType ?? (null as unknown as string),
    };
  },
  Happy8: function (ticket: PositionTicket): CalculatorResult {
    const {betCount, betAmount, betContent, playType} =
      computeHappy8(ticket);
    return {
      betCount,
      betAmount,
      betContent: betContent ?? '',
      playType,
      betItem: betContent ?? '',
      betPlay: playType ?? (null as unknown as string),
    };
  },
};
