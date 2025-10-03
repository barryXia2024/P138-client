import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LotteryResultState {
  activeTab: CommonCommonEnum.LotteryName;
  setActiveTab: (tabIndex: CommonCommonEnum.LotteryName) => void;
  lotteryResult: any[];
  setLotteryResult: (result: any[]) => void;
}

export const useLotteryResultStore = create<LotteryResultState>()(
  persist(
    set => ({
      activeTab: 'FootballLottery',
      setActiveTab: tabIndex => set({ activeTab: tabIndex }),
      lotteryResult: [],
      setLotteryResult: result => set({ lotteryResult: result }),
    }),
    {
      name: 'lotteryResult',
    }
  )
);

export default useLotteryResultStore;
