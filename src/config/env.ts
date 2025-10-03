/**
 * 环境配置
 * 集中管理所有环境相关的配置
 */

import { STORAGE_KEYS, URL_CONFIG } from 'p138-react-common/config';
import { Platform } from 'react-native';

// 获取当前环境
// const currentEnv: P138Api.Environment = process.env.EXPO_PUBLIC_APP_ENV as P138Api.Environment || 'development';
const isServerBuild: boolean = process.env.EXPO_PUBLIC_IS_SERVER_BUILD === "true";
  

// const isServerBuild = false
const currentEnv: P138Api.Environment = 'staging'
// const isServerBuild: boolean = true;2

console.log('process.env.EXPO_PUBLIC_IS_SERVER_BUILD', process.env);
// 环境配置
const ENV_CONFIGS: Record<P138Api.Environment, { 
  BASEURL: string;
  H5_Client_URL: string;
  H5_Business_URL: string;
  MQTT_Base_ClientID:string;
  OpenIM_API_URL:string;
  OpenIM_WS_URL:string;
}> = {
  development: {
    BASEURL: isServerBuild ? '' : URL_CONFIG.Local_Client_API,
    H5_Client_URL: URL_CONFIG.Local_Client_H5,
    H5_Business_URL: URL_CONFIG.Local_Business_H5,
    MQTT_Base_ClientID:`P138-Customer-${Platform.OS}`,

    OpenIM_API_URL: URL_CONFIG.Local_OpenIM_API,
    OpenIM_WS_URL: URL_CONFIG.Local_OpenIM_WS,
  },
  test: {
    BASEURL: isServerBuild ? '' : URL_CONFIG.Staging_Client_API,
    H5_Client_URL: URL_CONFIG.Staging_Client_H5,
    H5_Business_URL: URL_CONFIG.Staging_Business_H5,
    MQTT_Base_ClientID:`P138-Customer-${Platform.OS}`,

    OpenIM_API_URL: URL_CONFIG.Local_OpenIM_API,
    OpenIM_WS_URL: URL_CONFIG.Local_OpenIM_WS,
  },
  staging: {
    BASEURL: isServerBuild ? '' : URL_CONFIG.Staging_Client_API,
    H5_Client_URL: URL_CONFIG.Staging_Client_H5,
    H5_Business_URL: URL_CONFIG.Staging_Business_H5,
    MQTT_Base_ClientID:`P138-Customer-${Platform.OS}`,

    OpenIM_API_URL: URL_CONFIG.Staging_OpenIM_API,
    OpenIM_WS_URL: URL_CONFIG.Staging_OpenIM_WS,
  },
  production: {
    BASEURL: isServerBuild ? '' : URL_CONFIG.Production_Client_API,
    H5_Client_URL: URL_CONFIG.Production_Client_H5,
    H5_Business_URL: URL_CONFIG.Production_Business_H5,
    MQTT_Base_ClientID:`P138-Customer-${Platform.OS}`,

    OpenIM_API_URL: URL_CONFIG.Production_OpenIM_API,
    OpenIM_WS_URL: URL_CONFIG.Production_OpenIM_WS,
  }
};


// 导出当前环境配置
 const env = ENV_CONFIGS[currentEnv];
 
const DEFAULT_IMAGE = '1948676346276929536/ossimg_default_header.png'
// 🚨 修复：使用当前环境的配置，而不是硬编码的Local配置
const OpenIM_API_URL = env.OpenIM_API_URL
const OpenIM_WS_URL = env.OpenIM_WS_URL

 
// 重新导出通用配置
export { STORAGE_KEYS, DEFAULT_IMAGE,env, OpenIM_API_URL, OpenIM_WS_URL }; 