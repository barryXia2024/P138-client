import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 当前选中的彩种的基本信息
*/
export const useLotteryInfoStore = create<{
    lotteryInfo?: ServerCoreLottery.ListCustomLotteryResult;
    setLotteryInfo: (lotteryInfo: ServerCoreLottery.ListCustomLotteryResult) => void;
}>()(
    persist(
        (set) => ({
            lotteryInfo: undefined,
            setLotteryInfo: async (lotteryInfo) => {
                set({ lotteryInfo });
            },
        }),
        {
            name: 'lotteryInfo',

        }
    )
);
