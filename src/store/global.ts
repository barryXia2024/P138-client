/**
 * 用户信息状态管理
 * 
 * 管理用户的登录状态、基本信息、认证状态和令牌
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


/**
 * 全局状态管理
 */
interface GlobalState {
  /** 是否已登录 */
  isFloatingOpen: boolean;
  setIsFloatingOpen: (isFloatingOpen: boolean) => void;
}

/**
 * 用户信息状态管理Hook
 */
export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
        isFloatingOpen: true,
        setIsFloatingOpen: (isFloatingOpen: boolean) => set({ isFloatingOpen }),
    }),
    {
      name: 'global-storage', // 存储键名
      storage: createJSONStorage(() => AsyncStorage), // 使用AsyncStorage
    }
  )
);

