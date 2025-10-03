/**
 * P138OpenIM 库专用存储工具
 * 跨平台存储抽象，独立实现
 */

import { isWeb } from './openIMUtils';

// 存储键名
const STORAGE_KEYS = {
  IM_TOKEN: 'P138_IM_TOKEN',
  CHAT_TOKEN: 'P138_CHAT_TOKEN',
  USER_ID: 'P138_USER_ID',
} as const;

// 存储接口
interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// Web 存储实现
const webStorage: StorageAdapter = {
  getItem: async (key: string) => localStorage.getItem(key),
  setItem: async (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: async (key: string) => localStorage.removeItem(key),
};

// RN 存储实现
let rnStorage: StorageAdapter | null = null;
if (!isWeb()) {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    rnStorage = {
      getItem: (key: string) => AsyncStorage.getItem(key),
      setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
      removeItem: (key: string) => AsyncStorage.removeItem(key),
    };
  } catch (error) {
    console.warn('AsyncStorage 不可用，使用内存存储:', error);
    // 降级到内存存储
    const memoryStorage: Record<string, string> = {};
    rnStorage = {
      getItem: async (key: string) => memoryStorage[key] || null,
      setItem: async (key: string, value: string) => { memoryStorage[key] = value; },
      removeItem: async (key: string) => { delete memoryStorage[key]; },
    };
  }
}

// 获取当前平台的存储适配器
const getStorage = (): StorageAdapter => {
  return isWeb() ? webStorage : (rnStorage || webStorage);
};

// ===========================
// 公共存储方法
// ===========================

/**
 * 获取 IM Token
 */
export const getIMToken = async (): Promise<string | null> => {
  return await getStorage().getItem(STORAGE_KEYS.IM_TOKEN);
};

/**
 * 获取聊天 Token
 */
export const getChatToken = async (): Promise<string | null> => {
  return await getStorage().getItem(STORAGE_KEYS.CHAT_TOKEN);
};

/**
 * 获取用户 ID
 */
export const getIMUserID = async (): Promise<string | null> => {
  return await getStorage().getItem(STORAGE_KEYS.USER_ID);
};

/**
 * 设置 IM Token
 */
export const setIMToken = async (token: string): Promise<void> => {
  await getStorage().setItem(STORAGE_KEYS.IM_TOKEN, token);
};

/**
 * 设置聊天 Token
 */
export const setChatToken = async (token: string): Promise<void> => {
  await getStorage().setItem(STORAGE_KEYS.CHAT_TOKEN, token);
};

/**
 * 设置用户 ID
 */
export const setIMUserID = async (userID: string): Promise<void> => {
  await getStorage().setItem(STORAGE_KEYS.USER_ID, userID);
};

/**
 * 设置完整的 IM 配置信息
 */
export const setIMProfile = async ({ 
  userID, 
  imToken, 
  chatToken 
}: { 
  userID: string; 
  imToken: string; 
  chatToken?: string; 
}): Promise<void> => {
  await setIMToken(imToken);
  await setIMUserID(userID);
  if (chatToken) {
    await setChatToken(chatToken);
  }
};

/**
 * 清除所有 IM 配置信息
 */
export const clearIMProfile = async (): Promise<void> => {
  const storage = getStorage();
  await Promise.all([
    storage.removeItem(STORAGE_KEYS.IM_TOKEN),
    storage.removeItem(STORAGE_KEYS.CHAT_TOKEN),
    storage.removeItem(STORAGE_KEYS.USER_ID),
  ]);
};

/**
 * 检查是否已登录（有有效的凭证）
 */
export const checkLoginStatus = async (): Promise<boolean> => {
  const [imToken, userID] = await Promise.all([
    getIMToken(),
    getIMUserID(),
  ]);
  return !!(imToken && userID);
};