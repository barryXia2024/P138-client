/**
 * Web平台API客户端实现
 */

import {createApiClient} from '../core/client';


/**
 * 创建适配器
 */
export class AsyncStorageAdapter {
  static getItem(key: string): Promise<string | null> {
    return Promise.resolve(localStorage.getItem(key));
  }

  static setItem(key: string, value: string): Promise<void> {
    return Promise.resolve(localStorage.setItem(key, value));
  }

  static removeItem(key: string): Promise<void> {
    return Promise.resolve(localStorage.removeItem(key));
  }
}

/**
 * Web平台配置
 */
export interface IWebConfig extends P138Api.IBaseConfig {
  // 可以添加Web平台特有的配置
  useAntdMessage?: boolean; // 是否使用antd的message组件
}

/**
 * 创建Web平台的API客户端
 * @param config Web平台配置
 * @returns API客户端实例
 */
export function createWebApiClient(config: IWebConfig): P138Api.IApiClient {
  return createApiClient({
    ...config,
    storage: {
      getItem: (key: string) => AsyncStorageAdapter.getItem(key),
      setItem: (key: string, value: string) => AsyncStorageAdapter.setItem(key, value),
      removeItem: (key: string) => AsyncStorageAdapter.removeItem(key),
    },
    toast: {
      show: (message: string) => config.onShowToast?.(message),
      error: (message: string) => config.onShowToast?.(message),
      success: (message: string) => config.onShowToast?.(message),
    },
    logout: config.onLogout || (() => {}),

   
  });
}
