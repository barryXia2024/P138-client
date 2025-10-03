/**
 * P138通用配置
 */

// URL配置
export const URL_CONFIG = {
  //本地环境
  Local_Client_API: 'http://192.168.31.249:8888',
  Local_Client_H5: 'http://192.168.31.44:8081',
  Local_Business_API: 'http://192.168.31.249:8889',
  Local_Business_H5: 'http://192.168.31.44:8082',
  Local_Admin_API: 'http://192.168.31.249:8887',
  Local_Admin_H5: 'http://192.168.31.44:8000',
  Local_Oss_API: 'https://liangzai-dev-p138.oss-cn-hongkong.aliyuncs.com',
  Local_WebSocket_API: 'ws://192.168.31.249:8887/ws',

  Local_OpenIM_API: 'http://47.107.143.93:10002',
  Local_OpenIM_WS: 'ws://47.107.143.93:10001/ws',
  // Local_OpenIM_API:'https://im-api-test-p138.lengz.ai',
  // Local_OpenIM_WS: 'wss://im-ws-api-test-p138.lengz.ai',

  //内网测试环境
  Staging_Client_API: 'https://customer-api-test-p138.lengz.ai',
  Staging_Client_H5: 'https://p138-customer-h5.pages.dev',
  Staging_Business_API: 'https://business-api-test-p138.lengz.ai',
  Staging_Business_H5: 'https://p138-business-h5.pages.dev',
  Staging_Admin_API: 'https://admin-api-test-p138.lengz.ai',
  Staging_Admin_H5: 'https://p138-admin-h5.pages.dev',
  Staging_Oss_API: 'https://liangzai-dev-p138.oss-cn-hongkong.aliyuncs.com',
  Staging_WebSocket_API: 'wss://admin-api-test-p138.lengz.ai/ws',
  Staging_OpenIM_API: 'https://im-api-test-p138.lengz.ai',
  Staging_OpenIM_WS: 'wss://im-ws-api-test-p138.lengz.ai/ws',

  //生产环境
  Production_Client_API: 'https://customer-api-p138-dev.lengz.cc',
  Production_Client_H5: 'https://client-ui-p138-dev.lengz.cc',
  Production_Business_API: 'https://business-api-p138-dev.lengz.cc',
  Production_Business_H5: 'https://business-ui-p138-dev.lengz.cc',
  Production_Admin_API: 'https://admin-api-p138-dev.lengz.cc',
  Production_Admin_H5: 'https://admin-ui-p138-dev.lengz.cc',
  Production_Oss_API: 'https://liangzai-dev-p138.oss-cn-hongkong.aliyuncs.com',
  Production_WebSocket_API: 'wss://admin-api-p138-dev.lengz.cc/ws',

  Production_OpenIM_API: 'https://im-api-test-p138.lengz.ai',
  Production_OpenIM_WS: 'wss://im-ws-api-test-p138.lengz.ai',
} as const;
// Link: https://client-ui-p138-dev.meta-tech.dev/
// Link: https://client-ui-p138-dev.meta-tech.dev/download
// Link: https://admin-ui-p138-dev.meta-tech.dev/
// Link: https://admin-ui-p138-dev.meta-tech.dev/download
// Link: https://business-ui-p138-dev.meta-tech.dev/
// Link: https://business-ui-p138-dev.meta-tech.dev/download

// Link: https://admin-api-p138-dev.meta-tech.dev/
// Swagger: https://admin-api-p138-dev.meta-tech.dev/docs/index.html
// Link: https://customer-api-p138-dev.meta-tech.dev/
// Swagger: https://customer-api-p138-dev.meta-tech.dev/docs/index.html
// Link: https://business-api-p138-dev.meta-tech.dev/
// Swagger: https://business-api-p138-dev.meta-tech.dev/docs/index.html
// Link: wss://emqx-listeners-p138-dev.meta-tech.dev/mqtt
// Dashboard: https://emqx-dashboard.p138.dev.lengz.ai/

// 存储键名
export const STORAGE_KEYS = {
  TOKEN: '@p138/auth/token',
  REFRESH_TOKEN: '@p138/auth/refreshToken',
  USER_INFO: '@p138/auth/user',
  OAUTH_TOKEN: '@p138/auth/oAuthToken',
  CREDENTIALS: '@p138/auth/credentials',
  LOGIN_INFO: '@p138/auth/loginInfo',
  LOTTERY_TYPE: '@p138/lottery/type',
} as const;

// 默认图片
export const DEFAULT_IMAGE = '1948676346276929536/ossimg_default_header.png';
export const DEFAULT_Client_AVATAR =
  '1939986462562590720/ossimg_default_header.png';
