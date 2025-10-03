import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {PositionTicket} from '../types';

interface DigitalBetState {
  lotteryData?: LotteryDataSource.CharityLotteryDataSource;
  tickets: PositionTicket[];
  setLotteryData: (data: LotteryDataSource.CharityLotteryDataSource) => void;
  addTicket: (ticket: PositionTicket) => void;
  removeTicket: (betId: string) => void;
  clearAllTickets: () => void;
}

export const useDigitalBetStore = create<DigitalBetState>()(
  persist(
    (set, get) => ({
      lotteryData: undefined,
      tickets: [],
      setLotteryData: (data: LotteryDataSource.CharityLotteryDataSource) => {
        set({lotteryData: data});
      },
      addTicket: (ticket: PositionTicket) => {
        set({tickets: [...(get().tickets || []), ticket]});
      },
      clearAllTickets: () => {
        set({tickets: []});
      },
      // 移除票据
      removeTicket: betId => {
        set(state => ({
          tickets: state.tickets.filter(t => t.betId !== betId),
        }));
      },
    }),
    {
      name: 'Digital-Bet-Store',
    },
  ),
);
