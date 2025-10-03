/**
 * 聊天室核心业务逻辑 Hook
 * 
 * 职责：
 * 1. 管理聊天室状态（消息列表、加载状态等）
 * 2. 处理消息发送逻辑
 * 3. 处理历史消息加载
 * 4. 处理消息状态更新
 * 
 * 设计原则：
 * - 与UI完全解耦，纯业务逻辑
 * - 多端可用（Web、RN、Electron）
 * - 类型安全，无any类型
 * - 清晰的错误处理
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { P138OpenIM } from '../../index';
import { useMessages } from '../core/P138OpenIM';
import type {
  WrappedMessage,
  UseChatRoomOptions,
  ChatRoomState,
  ChatRoomActions,
} from '../types';

/**
 * 聊天室核心业务逻辑 Hook
 * 
 * @param options 配置选项
 * @returns 聊天室状态和操作方法
 */
export function useChatRoom(options: UseChatRoomOptions): ChatRoomState& ChatRoomActions {
  const {
    conversationId,
    initialLoadCount = 200,
    loadMoreCount = 20,
    autoLoadHistory = true,
  } = options;

  // ===========================
  // 状态管理
  // ===========================
  
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);

  // 从全局状态获取消息列表
  const allMessages = useMessages(conversationId);
  
  // 将 MessageItem[] 转换为 WrappedMessage[]
  const messages = useMemo(() => {
    return allMessages.map((message: any) => {
      // 如果已经是 WrappedMessage 格式，直接返回
      if (message.extras && typeof message.extras === 'object' && message.extras.clientMsgID) {
        return message as WrappedMessage;
      }
      
      // 如果是原始 MessageItem，需要包装
      const messageItem = message.extras || message;
      return P138OpenIM.wrapMessageItem(messageItem);
    });
  }, [allMessages]);

  // ===========================
  // 历史消息加载逻辑
  // ===========================

  /**
   * 加载历史消息
   * @param count 加载数量
   */
  const loadHistoryMessages = useCallback(async (count: number) => {
    if (!conversationId) return;
    
    try {
      setLoadingHistory(true);
      setError(null);
      
      // 记录加载前的消息数量
      const beforeCount = allMessages.length;
      
      // 调用核心方法加载历史消息
      await P138OpenIM.loadHistoryMessages(conversationId, count);
      
      // 检查是否还有更多消息
      // 如果加载的消息数量少于请求的数量，说明没有更多历史消息了
      const afterCount = allMessages.length;
      const loadedCount = afterCount - beforeCount;
      
      if (loadedCount < count) {
        setHasMoreHistory(false);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载历史消息失败';
      setError(errorMessage);
    } finally {
      setLoadingHistory(false);
    }
  }, [conversationId, allMessages.length]);

  /**
   * 加载更多历史消息
   */
  const loadMoreHistory = useCallback(async () => {
    if (loadingHistory || !hasMoreHistory) return;
    await loadHistoryMessages(loadMoreCount);
  }, [loadHistoryMessages, loadMoreCount, loadingHistory, hasMoreHistory]);

  /**
   * 重新加载历史消息
   */
  const reloadHistory = useCallback(async () => {
    await loadHistoryMessages(initialLoadCount);
  }, [loadHistoryMessages, initialLoadCount]);

  // ===========================
  // 消息发送逻辑
  // ===========================

  /**
   * 发送文本消息
   * @param content 消息内容
   */
  const sendTextMessage = useCallback(async (content: string) => {
    if (!content.trim() || !conversationId) return;
    
    try {
      setSending(true);
      setError(null);
      
      // 调用核心方法发送消息
      await P138OpenIM.sendTextMessage({
        conversationId,
        content: content.trim(),
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发送消息失败';
      setError(errorMessage);
      throw err; // 重新抛出错误，让UI层处理
    } finally {
      setSending(false);
    }
  }, [conversationId]);

  /**
   * 清除错误
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ===========================
  // 设置当前会话和自动加载历史消息
  // ===========================

  useEffect(() => {
    if (conversationId) {
      // 设置当前会话
      P138OpenIM.setCurrentConversation(conversationId);
      
      // 自动加载历史消息
      if (autoLoadHistory && allMessages.length === 0) {
        loadHistoryMessages(initialLoadCount);
      }
    }
  }, [conversationId, autoLoadHistory, allMessages.length, loadHistoryMessages, initialLoadCount]);

  // ===========================
  // 返回状态和方法
  // ===========================

  return {
    // 状态
    messages,
    loadingHistory,
    sending,
    error,
    hasMoreHistory,
    
    // 方法
    sendTextMessage,
    loadMoreHistory,
    reloadHistory,
    clearError,
  };
}
