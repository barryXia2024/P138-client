/**
 * 消息列表业务逻辑 Hook
 * 
 * 职责：
 * 1. 管理消息列表状态
 * 2. 处理消息过滤和排序
 * 3. 处理消息状态更新
 * 4. 提供消息操作功能
 * 
 * 设计原则：
 * - 与UI完全解耦
 * - 支持消息过滤和搜索
 * - 统一的错误处理
 * - 类型安全
 */

import { useState, useCallback, useMemo } from 'react';
import { P138OpenIM } from '../../index';
import { useMessages } from '../core/P138OpenIM';
import type {
  WrappedMessage,
  UseMessageListOptions,
  UseMessageListReturn,
  MessageListState,
  MessageListActions,
} from '../types';

/**
 * 消息列表业务逻辑 Hook
 * 
 * @param options 配置选项
 * @returns 消息列表状态和操作方法
 */
export function useMessageList(options: UseMessageListOptions): MessageListState & MessageListActions {
  const {
    conversationId,
  } = options;

  // ===========================
  // 状态管理
  // ===========================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 从全局状态获取消息列表
  const allMessages = useMessages(conversationId);
  
  // 将消息转换为 WrappedMessage 格式
  const messages = useMemo(() => {
    const mapped: WrappedMessage[] = allMessages.map((message: any) => {
      // 如果已经是 WrappedMessage 格式，直接返回
      if (message.extras && typeof message.extras === 'object' && message.extras.clientMsgID) {
        return message as WrappedMessage;
      }
      // 如果是原始 MessageItem，需要包装
      const messageItem = message.extras || message;
      return P138OpenIM.wrapMessageItem(messageItem);
    });

    // 只过滤空的系统通知消息
    return mapped.filter(m => {
      const extras: any = (m as any).extras || {};
      const contentType = Number(extras?.contentType);
      const content = String(extras?.content ?? m.content ?? '').trim();
      
      console.log(contentType,[1501,10011].includes(contentType), content.length,'========contentType========');
      // 只过滤系统通知消息（contentType 1509）且内容为空的情况
      if ([1501,10011,1519,1509].includes(contentType) && content.length === 0) {
        return false;
      }
      
      // 其他所有消息都保留
      return true;
    });
  }, [allMessages]);

  // ===========================
  // 消息过滤和搜索
  // ===========================

  /**
   * 过滤后的消息列表
   */
  const filteredMessages = useMemo(() => {
    if (!searchKeyword.trim()) {
      return messages;
    }

    const keyword = searchKeyword.toLowerCase();
    return messages.filter(message => {
      // 搜索消息内容
      if (message.content.toLowerCase().includes(keyword)) {
        return true;
      }
      
      // 搜索发送者昵称
      if (message.senderId.toLowerCase().includes(keyword)) {
        return true;
      }
      
      // 搜索特定消息类型
      if (message.type.toLowerCase().includes(keyword)) {
        return true;
      }
      
      return false;
    });
  }, [messages, searchKeyword]);

  // ===========================
  // 操作方法
  // ===========================

  /**
   * 刷新消息列表
   */
  const refresh = useCallback(async () => {
    if (!conversationId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // 重新加载历史消息
      await P138OpenIM.loadHistoryMessages(conversationId, 200);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '刷新消息列表失败';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  /**
   * 搜索消息
   * @param keyword 搜索关键词
   */
  const search = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
  }, []);

  /**
   * 清除搜索
   */
  const clearSearch = useCallback(() => {
    setSearchKeyword('');
  }, []);

  /**
   * 撤回消息
   * @param messageId 消息ID
   */
  const revokeMessage = useCallback(async (_messageId: string) => {
    try {
      setError(null);
      
      // TODO: 实现撤回消息逻辑
      throw new Error('撤回消息功能暂未实现');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '撤回消息失败';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * 重新发送消息
   * @param messageId 消息ID
   */
  const resendMessage = useCallback(async (messageId: string) => {
    try {
      setError(null);
      
      // 找到要重新发送的消息
      const message = messages.find(m => m.id === messageId);
      if (!message) {
        throw new Error('消息不存在');
      }
      
      // 更新消息状态为发送中
      const updatedMessage = {
        ...message.extras,
        status: 1, // sending
      };
      
      P138OpenIM.updateOneMessage(updatedMessage);
      
      // TODO: 实现重新发送逻辑
      // await P138OpenIM.resendMessage(messageId);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '重新发送消息失败';
      setError(errorMessage);
      throw err;
    }
  }, [messages]);

  /**
   * 清除错误
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ===========================
  // 返回状态和方法
  // ===========================

  return {
    // 状态
    messages,
    loading,
    error,
    searchKeyword,
    filteredMessages,
    
    // 方法
    refresh,
    search,
    clearSearch,
    revokeMessage,
    resendMessage,
    clearError,
  };
}
