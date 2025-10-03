/**
 * 用户信息状态管理
 * 
 * 管理用户的登录状态、基本信息、认证状态和令牌
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from 'p138-react-common/config';
import { P138OpenIM } from '@/p138-react-common/OpenIM';
 
 

/**
 * 用户信息状态接口
 */
interface UserState {
  /** 是否已登录 */
  isLoggedIn: boolean;
  /** 用户登录信息 */
  loginInfo: ServerCoreAuth.UserSignInResult;
  /** 用户基本信息 */
  userInfo: ServerCoreAuth.User;
  /** 认证令牌 */
  token: string | null;
  /** 店铺信息（如适用） */
  shopInfo: ServerCoreShop.LotteryShop;
  
  /** 设置登录状态 */
  setLoggedIn: (isLoggedIn: boolean) => void;
  /** 设置用户登录信息 */
  setLoginInfo: (loginInfo: ServerCoreAuth.UserSignInResult) => void;
  /** 设置用户基本信息 */
  setUserInfo: (userInfo: ServerCoreAuth.User) => void;
  /** 设置店铺信息 */
  setShopInfo: (shopInfo: ServerCoreShop.LotteryShop) => void;
  /** 重置用户状态 */
  resetUserStore: () => void;
}

/**
 * 用户信息状态管理Hook
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // 是否已登录
      isLoggedIn: false,
      // 用户登录信息
      loginInfo: {} as ServerCoreAuth.UserSignInResult,
      // 用户基本信息
      userInfo: {} as ServerCoreAuth.User,
      // 认证令牌
      token: null,
      // 店铺信息
      shopInfo: {} as ServerCoreShop.LotteryShop,
      
      // 设置登录状态
      setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      
      // 设置用户登录信息
      setLoginInfo: (loginInfo) => {
        // 持久化存储登录信息
        AsyncStorage.setItem(STORAGE_KEYS.LOGIN_INFO, JSON.stringify(loginInfo));
        set({ loginInfo });
      },
      
      // 设置用户基本信息
      setUserInfo: (userInfo) => set({ userInfo }),
      
      // 设置店铺信息
      setShopInfo: (shopInfo) => set({ shopInfo }),
      
      // 重置用户状态
      resetUserStore: async () => {
           // 先清理 OpenIM 状态
           try {
        
              P138OpenIM.logout();
          } catch (error) {
            console.warn('P138OpenIM logout failed:', error);
          }
        set({
          isLoggedIn: false,
          shopInfo: undefined,
          userInfo: undefined,
          loginInfo: undefined,
        });
        AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO);
        AsyncStorage.removeItem(STORAGE_KEYS.OAUTH_TOKEN);
        AsyncStorage.removeItem(STORAGE_KEYS.LOGIN_INFO);
      },
    }),
    {
      name: 'user-storage', // 存储键名
      storage: createJSONStorage(() => AsyncStorage), // 使用AsyncStorage
    }
  )
);

/**
 * 获取用户信息
 * @returns 用户信息
 */
export const getUserInfo = () => {
  const userState = useUserStore.getState();
  return {
    isLoggedIn: userState.isLoggedIn,
    userInfo: userState.userInfo,
    token: userState.token,
    shopInfo: userState.shopInfo,
  };
}; 