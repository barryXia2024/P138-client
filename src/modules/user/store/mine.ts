import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MineStoreState {
  walletInfo?: ServerCoreWallet.Wallet;
  setWalletInfo: (walletInfo: ServerCoreWallet.Wallet) => void;
  betRecord?: ServerCoreOrder.GetBetRecordCountResult;
  setBetRecord: (betRecord: ServerCoreOrder.GetBetRecordCountResult) => void;
  notReadCount: number;
  setNotReadCount: (notReadCount: number) => void;
}

export const useMineStore = create<MineStoreState>()(
  persist(
    set => ({
      walletInfo: undefined,
      setWalletInfo: walletInfo => set({ walletInfo }),
      betRecord: undefined,
      setBetRecord: betRecord => set({ betRecord }),
      notReadCount: 0,
      setNotReadCount: notReadCount => set({ notReadCount }),
    }),
    {
      name: 'mine',
    }
  )
);

export default useMineStore;
