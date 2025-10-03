import {useCallback, useEffect, useState} from 'react';
import {P138OpenIM} from '../../index';
 
import type {
  UseConversationListOptions,
  UseConversationListReturn,
} from '../types';
import { defaultConfig } from '../config';
import { useP138OpenIMStore } from '../core/P138OpenIMCore';

// 全局状态管理 - 真正的单例
let globalLoginStatus = 0;
let globalInitialized = false;
let globalLoginPromise: Promise<void> | null = null;
let globalRefreshing = false;
let globalError: string | null = null;

// 全局状态更新回调
let globalStateUpdateCallbacks: Set<() => void> = new Set();

/**
 * 通知所有组件状态更新
 */
function notifyStateUpdate() {
  globalStateUpdateCallbacks.forEach(callback => callback());
}

/**
 * 全局 OpenIM 管理器 Hook - 真正的单例
 * 确保整个应用只有一个 OpenIM 实例在管理状态
 */
export function useOpenIMManager(
  options: UseConversationListOptions = {},
): UseConversationListReturn {
  const {
    autoLogin = true,
    loginInfo,
    userInfo,
  } = options;

  // 本地状态 - 只是全局状态的镜像
  const [refreshing, setRefreshing] = useState(globalRefreshing);
  const [error, setError] = useState(globalError);
  const [loginStatus, setLoginStatus] = useState(globalLoginStatus);
  const {conversations, connectionState, unreadCount, syncing, conversationIniting} = useP138OpenIMStore();


  // // 从 P138OpenIM 获取状态（这些是真正的全局状态）
  // const conversations = useConversations();
  // const connectionState = useConnectionState();
  // const unreadCount = useUnreadCount();
  // const syncing = useSyncing();
  // const conversationIniting = useConversationIniting();

  // 使用全局配置
  const config = defaultConfig;

  // 注册状态更新回调
  useEffect(() => {
    const updateCallback = () => {
      setRefreshing(globalRefreshing);
      setError(globalError);
      setLoginStatus(globalLoginStatus);
    };
    
    globalStateUpdateCallbacks.add(updateCallback);
    
    return () => {
      globalStateUpdateCallbacks.delete(updateCallback);
    };
  }, []);

  /**
   * 清除错误
   */
  const clearError = useCallback(() => {
    globalError = null;
    notifyStateUpdate();
  }, []);

  /**
   * 刷新会话列表
   */
  const refreshConversations = useCallback(async () => {
    if (globalRefreshing) return; // 如果已经在刷新，直接返回
    
    try {
      globalRefreshing = true;
      globalError = null;
      notifyStateUpdate();
      
      await P138OpenIM.refreshConversations();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '刷新失败';
      globalError = errorMessage;
      notifyStateUpdate();
    } finally {
      globalRefreshing = false;
      notifyStateUpdate();
    }
  }, []);

  /**
   * 检查登录状态并执行登录（全局单例）
   */
  const checkLogin = useCallback(async () => {
    // 如果已经有登录进行中，等待它完成
    if (globalLoginPromise) {
      await globalLoginPromise;
      return;
    }

    // 如果已经初始化过，直接返回当前状态
    if (globalInitialized) {
      return;
    }

    try {
      const status = await P138OpenIM.getLoginStatus();
      globalLoginStatus = status;
      notifyStateUpdate();

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
          globalLoginPromise = P138OpenIM.login(loginInfo.userID, loginInfo.openIMToken.token);
          
          await globalLoginPromise;
          
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
        
        globalInitialized = true;
        globalLoginStatus = 1;
        notifyStateUpdate();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登录失败';
      globalError = errorMessage;
      globalLoginStatus = 0;
      notifyStateUpdate();
    } finally {
      globalLoginPromise = null;
    }
  }, [loginInfo, userInfo, config, refreshConversations]);

  /**
   * 手动登录
   */
  const login = useCallback(async () => {
    await checkLogin();
  }, [checkLogin]);

  /**
   * 登出（全局）
   */
  const logout = useCallback(async () => {
    try {
      await P138OpenIM.logout();
      globalError = null;
      globalLoginStatus = 0;
      globalInitialized = false;
      notifyStateUpdate();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登出失败';
      globalError = errorMessage;
      notifyStateUpdate();
    }
  }, []);

  /**
   * 自动登录（只在第一个组件中执行）
   */
  useEffect(() => {
    if (autoLogin && loginInfo?.userID && loginInfo?.openIMToken?.token && !globalInitialized) {
      checkLogin();
    }
  }, [autoLogin, loginInfo?.userID, loginInfo?.openIMToken?.token, checkLogin]);

  return {
    conversations,
    connectionState,
    unreadCount,
    syncing,
    conversationIniting,
    refreshing,
    error,
    loginStatus,
    clearError,
    refreshConversations,
    login,
    logout,
  };
}
