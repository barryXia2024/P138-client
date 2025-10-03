/**
 * 投注状态管理
 *
 * 管理用户的投注选择、倍数和相关比赛数据
 */

import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {storageAdapter} from '@/p138-react-common/api/platforms/storage';
type AnchorState = {
  isAnchor: boolean;
  setIsAnchor: (isAnchor: boolean) => void;
};
export const useAnchorStore = create<AnchorState>()(
  persist(
    (set, get) => ({
      isAnchor: false,

      setIsAnchor: (isAnchor: boolean) => set({isAnchor}),

      // 重置状态
      resetStore: () => set({isAnchor: false}),
    }),
    {
      name: 'anchorStore',
      storage: createJSONStorage(() => storageAdapter),
    },
  ),
);
