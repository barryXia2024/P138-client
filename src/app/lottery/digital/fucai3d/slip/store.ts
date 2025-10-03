import { create } from 'zustand';
import { Fucai3DTicket } from '../core/types';

interface BettingListState {
  tickets: Fucai3DTicket[];
  ticketsMultiplier: Record<string, number>;
  lotteryData?:  LotteryDataSource.CharityLotteryDataSource;

  // 操作
  addTicket: (ticket: Fucai3DTicket) => void;
  removeTicket: (betId: string) => void;
  clearAll: () => void;
  setLotteryData: (data:  LotteryDataSource.CharityLotteryDataSource) => void;
  setTicketsMultiplier: (multiplier: Record<string, number>) => void;

  // 计算
  getTotalBetCount: () => number;
  getTotalBetAmount: () => number;
}

export const useBettingListStore = create<BettingListState>((set, get) => ({
  tickets: [],
  ticketsMultiplier: {},
  lotteryData: undefined,

  // 添加票据
  addTicket: (ticket) => {
      set(state => ({
        tickets: [...state.tickets, ticket],
    }));
  },

  // 移除票据
  removeTicket: (betId) => {
    set(state => ({
      tickets: state.tickets.filter(t => t.betId !== betId),
      ticketsMultiplier: Object.fromEntries(
        Object.entries(state.ticketsMultiplier).filter(([id]) => id !== betId)
      ),
    }));
  },

  // 清空所有
  clearAll: () => {
    set({ tickets: [], ticketsMultiplier: {}, lotteryData: undefined });
  },

  setLotteryData: (data) => {
    set({ lotteryData: data });
  },

  setTicketsMultiplier: (multiplier) => {
    set({ ticketsMultiplier: multiplier });
  },

  // 计算总注数
  getTotalBetCount: () => {
    const { tickets, ticketsMultiplier } = get();
    return tickets.reduce((acc, ticket) => {
      const multiplier = ticketsMultiplier[ticket.betId] || 1;
      return acc + ticket.betCount * multiplier;
    }, 0);
  },

  // 计算总金额
  getTotalBetAmount: () => {
    const { tickets, ticketsMultiplier } = get();
    return tickets.reduce((acc, ticket) => {
      const multiplier = ticketsMultiplier[ticket.betId] || 1;
      return acc + ticket.betAmount * multiplier;
    }, 0);
  },
}));
