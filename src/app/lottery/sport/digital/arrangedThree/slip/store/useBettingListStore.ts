import {create} from 'zustand';
import { DigitalTicket } from '../../../core';
import { SuperLottoMockData } from '../../../mockdata';


interface BettingListStore {
  tickets: DigitalTicket[];
  lotteryData?:SuperLottoMockData['data'],
  ticketsMultiplier: Record<string, number>,
  // 操作
  addTicket: (ticket: DigitalTicket) => void;
  setLotteryData:(data:SuperLottoMockData['data'])=>void,
  removeTicket: (betId: string) => void;
  clearAll: () => void;
  
  // 计算
  getTotalBetCount: () => number;
  getTotalBetAmount: () => number;
  
  // 获取票据
  getTickets: () => DigitalTicket[];
  setTicketsMultiplier: (multiplier: Record<string, number>) => void;
}

export const useBettingListStore = create<BettingListStore>((set, get) => ({
  tickets: [],
  lotteryData:undefined,
  ticketsMultiplier: {},
  // 添加票据
  addTicket: (ticket) => {
    set(state => ({
      tickets: [...state.tickets, ticket],
    }));
  },
  setLotteryData: (data ) => {
    set({lotteryData: data});
  },
  setTicketsMultiplier: (multiplier) => {
    set({ticketsMultiplier: multiplier});
  },
  // 移除票据
  removeTicket: (betId) => {
    set(state => ({
      tickets: state.tickets.filter(t => t.betId !== betId),
    }));
  },
  
  // 清空所有
  clearAll: () => {
    set({tickets: []});
  },
  
  // 计算总注数
  getTotalBetCount: () => {
    const {tickets} = get();
    return tickets.reduce((acc, ticket) => acc + ticket.betCount, 0);
  },
  
  // 计算总金额
  getTotalBetAmount: () => {
    const {tickets} = get();
    return tickets.reduce((acc, ticket) => acc + ticket.betAmount, 0);
  },
  
  // 获取所有票据
  getTickets: () => {
    return get().tickets;
  },
}));
