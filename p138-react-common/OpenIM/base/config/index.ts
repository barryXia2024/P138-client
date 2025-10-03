/**
 * OpenIM 配置文件
 * 用于管理 OpenIM 相关的配置信息
 */

import { env } from "src/config/env";

export interface OpenIMConfig {
  /** API 服务器地址 */
  apiUrl: string;
  /** WebSocket 服务器地址 */
  wsUrl: string;
  /** 聊天服务器地址 */
  chatUrl: string;
  /** 是否开启调试模式 */
  debug?: boolean;
}

export interface LoginInfo {
  /** 用户ID */
  userID: string;
  /** OpenIM Token */
  openIMToken: {
    token: string;
  };
}

export interface UserInfo {
  /** 用户昵称 */
  nickname?: string;
  /** 用户头像 */
  faceURL?: string;
}

/**
 * 默认配置
 * 可以根据环境变量或业务需求进行覆盖
 */
export const defaultConfig: OpenIMConfig = {
  apiUrl: process.env.REACT_APP_OPENIM_API_URL || env.OpenIM_API_URL,
  wsUrl: process.env.REACT_APP_OPENIM_WS_URL || env.OpenIM_WS_URL,
  chatUrl: process.env.REACT_APP_OPENIM_CHAT_URL || 'http://47.107.143.93:10008',
  debug: process.env.NODE_ENV === 'development',
};

// 全局配置存储
let globalConfig: OpenIMConfig = defaultConfig;

/**
 * 获取配置
 * @param overrides 覆盖默认配置的选项
 */
export const getConfig = (overrides?: Partial<OpenIMConfig>): OpenIMConfig => {
  return {
    ...defaultConfig,
    ...overrides,
  };
};

/**
 * 设置全局配置
 * @param config 配置对象
 */
export const setConfig = (config: OpenIMConfig): void => {
  globalConfig = config;
};

/**
 * 获取聊天服务器URL
 * @returns 聊天服务器URL
 */
export const getChatUrl = (): string => {
  return globalConfig.chatUrl;
};

/**
 * 获取API服务器URL
 * @returns API服务器URL
 */
export const getApiUrl = (): string => {
  return globalConfig.apiUrl;
};

/**
 * 获取WebSocket服务器URL
 * @returns WebSocket服务器URL
 */
export const getWsUrl = (): string => {
  return globalConfig.wsUrl;
};