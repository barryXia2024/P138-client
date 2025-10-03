import {createApiClient} from '../core/client';

/**
 * Expo平台配置
 */
export interface IExpoConfig extends P138Api.IBaseConfig {
  // 可以添加Expo平台特有的配置
}
/**
 * 创建Expo平台的API客户端
 * @param config Expo平台配置
 * @returns API客户端实例
 */
export function createExpoApiClient(config: IExpoConfig): P138Api.IApiClient {
  return createApiClient(config);
}
