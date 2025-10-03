import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 存储适配器接口
 */
export interface IStorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * Web平台存储适配器
 */
class WebStorageAdapter implements IStorageAdapter {
  getItem(key: string): Promise<string | null> {
    return Promise.resolve(localStorage.getItem(key));
  }

  setItem(key: string, value: string): Promise<void> {
    return Promise.resolve(localStorage.setItem(key, value));
  }

  removeItem(key: string): Promise<void> {
    return Promise.resolve(localStorage.removeItem(key));
  }
  clear(): Promise<void> {
    return Promise.resolve(localStorage.clear());
  }
}

/**
 * React Native平台存储适配器
 */
class RNStorageAdapter implements IStorageAdapter {
  getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }

  setItem(key: string, value: string): Promise<void> {
    return AsyncStorage.setItem(key, value);
  }

  removeItem(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  }
  clear(): Promise<void> {
    return AsyncStorage.clear();
  }
}

// 根据平台选择存储适配器
export const storageAdapter: IStorageAdapter =
  Platform.OS === 'web' ? new WebStorageAdapter() : new RNStorageAdapter();