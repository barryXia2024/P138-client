/**
 * P138 API模块入口
 * 配置和导出API客户端
 */

import {createExpoApiClient} from 'p138-react-common/api/platforms/expo';
import {router} from 'expo-router';
import {env} from '../config/env';
import {createSignOut, oauthRefreshTokenApi} from './interface/users-auth';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clockManager} from '@/p138-react-common/taskManager/ClockManager';
import MqttClientManager from '@/p138-react-common/mqtt/MqttClientManager';
import P138OpenIM from '@/p138-react-common/OpenIM';
import {useUserStore} from 'src/store';

// 防止重复登出的状态标记
let isLoggingOut = false;

export const loginOut = () => {
  // 防止重复调用
  if (isLoggingOut) {
    console.log('登出操作正在进行中，跳过重复调用');
    return;
  }
  
  isLoggingOut = true;
  try {
    P138OpenIM.logout();

    P138OpenIM.reinitializeSDK();
  } catch (error) {
    console.error('登出失败:', error);
  }
  
  try {
   
    const loginInfo = useUserStore.getState().loginInfo;
    if (loginInfo?.userID) {
      createSignOut(
        {},
        {
          userID: loginInfo.userID,
        },
        {
          'X-Shop-Code': loginInfo.shopCode ?? 1,
          'X-User-Type': loginInfo.userType,
          'X-Username': loginInfo.username,
        },
      );
    }

    MqttClientManager.disconnect();

    localStorage.clear();
    clockManager.stop();
    if (Platform.OS === 'web') {  
      if (window.location.pathname !== '/user/login') {
        
        router.dismissTo('/login');
      }
    }else{
      router.dismissTo('/login');
    }
  } finally {
    // 延迟重置状态，确保登出流程完成
    setTimeout(() => {
      isLoggingOut = false;
    }, 1000);
  }
};
const localStorage = Platform.OS === 'web' ? window.localStorage : AsyncStorage;

// 创建API客户端
const config = {
  baseURL: env.BASEURL,
  useAntdMessage: true, // 使用antd的message
  onLogout: loginOut,
  onShowToast: (message: string) => {
    if (message) {
      Toast.show(message);
      // console.warn('[错误]', message);
    }
  },
  storage: {
    getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
    setItem: (key: string, value: string) =>
      Promise.resolve(localStorage.setItem(key, value)),
    removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
  },
  toast: {
    show: (message: string) => Toast.show(message),
    error: (message: string) => Toast.show(message),
    success: (message: string) => Toast.show(message),
  },
  logout: () => {
    // 只清理本地存储，不调用loginOut避免重复
    localStorage.clear();
    console.log('用户已登出');
  },
  refreshTokenApi: async (refreshToken: string) => {
    const response = await oauthRefreshTokenApi({refreshToken});
    if (response.data) {
      return {data: response.data, success: true};
    }
    throw new Error('刷新token失败');
  },
};

const api = createExpoApiClient(config);

// 导出请求函数
export const request = <
  TResponse,
  TQuery = Record<string, any>,
  TData = Record<string, any>,
  THeader = any,
>(
  props: P138Api.IRequestProps<TQuery, TData, THeader> & {ignoreAuth?: boolean},
): Promise<TResponse> => {
  return api.request<TResponse, TQuery, TData, THeader>(props).catch(error => {
    // 记录详细错误信息
    console.error('API请求失败:', error);
    // console.error('API请求失败:', {
    //   url: props.url,
    //   method: props.method,
    //   data: props.data,
    //   query: props.query,
    //   error: error.response?.data || error.message
    // });

    // 重新抛出错误
    throw error;
  });
};

// 提供默认导出以兼容旧接口
export default request;
