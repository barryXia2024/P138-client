import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

// 投注信息
interface BetInfo {
  betsCount: number;
  maxPayout: number;
  minPayout: number;
  betsAmount: number;
}

// Slip状态管理
interface SlipState {
  // 核心状态
  betInfo: BetInfo;
  
  // 弹窗状态
  showPassTypeModal: boolean;
  showMultiplierModal: boolean;
  
  // 核心方法
  setBetInfo: (info: BetInfo) => void;
  togglePassTypeModal: () => void;
  toggleMultiplierModal: () => void;
}

// 创建Store
export const useSlipStore = create<SlipState>()(
  devtools(
    (set) => ({
      // 初始状态
      betInfo: {
        betsCount: 0,
        maxPayout: 0,
        minPayout: 0,
        betsAmount: 0,
      },
      
      // 弹窗状态
      showPassTypeModal: false,
      showMultiplierModal: false,

      // 核心方法
      setBetInfo: (betInfo) => set({betInfo}),
      togglePassTypeModal: () => set(state => ({showPassTypeModal: !state.showPassTypeModal})),
      toggleMultiplierModal: () => set(state => ({showMultiplierModal: !state.showMultiplierModal})),
    }),
    {
      name: 'slip-store',
    },
  ),
); 