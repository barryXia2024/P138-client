import {useCallback, useEffect, useState} from 'react';
import {P138OpenIM} from '../../index';
import {
  useConversations,
  useConnectionState,
  useUnreadCount,
  useSyncing,
  useConversationIniting,
} from '../core/P138OpenIM';
import type {
  UseConversationListOptions,
  UseConversationListReturn,
} from '../types';
import { getConfig } from '../config';

/**
 * 会话列表管理 Hook
 * 
 * @param options 配置选项
 * @returns 会话列表相关的状态和方法
 */
export function useConversationList(
  options: UseConversationListOptions = {},
): UseConversationListReturn {
  const {
    autoLogin = true,
    loginInfo,
    userInfo,
  } = options;

  // 状态管理
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginStatus, setLoginStatus] = useState(0);

  // 从 P138OpenIM 获取状态
  const conversations = useConversations();
  const connectionState = useConnectionState();
  const unreadCount = useUnreadCount();
  const syncing = useSyncing();
  const conversationIniting = useConversationIniting();

  // 获取配置
  const config = getConfig();

  /**
   * 清除错误
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 刷新会话列表
   */
  const refreshConversations = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      await P138OpenIM.refreshConversations();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '刷新失败';
      setError(errorMessage);
    } finally {
      setRefreshing(false);
    }
  }, []);

  /**
   * 检查登录状态并执行登录
   */
  const checkLogin = useCallback(async () => {
    try {
      const status = await P138OpenIM.getLoginStatus();
      setLoginStatus(status);

      if (status === 1) {
        // 初始化 P138OpenIM
        P138OpenIM.init({
          apiUrl: config.apiUrl,
          wsUrl: config.wsUrl,
          chatUrl: config.chatUrl,
          debug: config.debug,
        });

        // 执行登录
        if (loginInfo?.userID && loginInfo?.openIMToken?.token) {
          await P138OpenIM.login(loginInfo.userID, loginInfo.openIMToken.token);
          
          // 可选：设置用户信息
          if (userInfo?.nickname) {
            const selfInfo = await P138OpenIM.getSelfUserInfo();
            if (selfInfo) {
              await P138OpenIM.setSelfUserInfo({
                ...selfInfo,
                nickname: userInfo.nickname,
                faceURL: userInfo.avatar || (selfInfo as any).faceURL,
              } as any);
            }
          }

          // 登录成功后刷新会话列表
          await refreshConversations();
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登录失败';
      setError(errorMessage);
    }
  }, [loginInfo, userInfo, config, refreshConversations]);

  /**
   * 手动登录
   */
  const login = useCallback(async () => {
    await checkLogin();
  }, [checkLogin]);

  /**
   * 登出
   */
  const logout = useCallback(async () => {
    try {
      await P138OpenIM.logout();
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登出失败';
      setError(errorMessage);
    }
  }, []);

  /**
   * 自动登录
   */
  useEffect(() => {
    if (autoLogin && loginInfo?.userID && loginInfo?.openIMToken?.token) {
      checkLogin();
    }
  }, [autoLogin, loginInfo?.userID, loginInfo?.openIMToken?.token, checkLogin]);

  /**
   * 组件卸载时登出
   */
  useEffect(() => {
    return () => {
      P138OpenIM.logout();
    };
  }, []);

  return {
    conversations,
    connectionState,
    unreadCount,
    syncing,
    conversationIniting,
    refreshing,
    loginStatus,
    error,
    refreshConversations,
    clearError,
    login,
    logout,
  };
}
