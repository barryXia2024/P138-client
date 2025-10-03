/**
 * P138OpenIM 核心类 - 简化版
 * 只使用 OpenIM 的 MessageItem 类型
 */

import {create} from 'zustand';
import {useMemo} from 'react';
import type {
  Conversation,
 
  P138OpenIMConfig,
  WrappedMessage,
 
} from '../types';
import {
  
 
  ConnectionState,
 
} from '../types';


// 状态管理
interface P138OpenIMState {
  // 基础状态
  conversations: Conversation[];
  messages: WrappedMessage[]; // 包装后的消息对象，真实 MessageItem 在 extras 字段中
  connectionState: ConnectionState;
  unreadCount: number;
  selfInfo: {userID?: string; nickname?: string; avatar?: string};
  currentConversation: ConversationItem | null;

  // 状态标识
  syncing: boolean;
  conversationIniting: boolean;
  isInitialized: boolean; // 新增：OpenIM SDK 是否已完全初始化

  // 配置
  config: P138OpenIMConfig | null;
}

export const useP138OpenIMStore = create<P138OpenIMState>(() => ({
  conversations: [],
  messages: [],
  connectionState: ConnectionState.Disconnected,
  unreadCount: 0,
  selfInfo: {},
  syncing: false,
  conversationIniting: false,
  isInitialized: false, // 初始状态为未初始化
  config: null,
  currentConversation: null,
}));

import {
  filterMessagesForConversation,
 
} from '../utils/conversationUtils';
import {ConversationItem} from 'open-im-sdk-rn/src/types/entity';
 



// 导出 hooks 供外部使用
export const useConversations = () =>
  useP138OpenIMStore(state => state.conversations);

export const useMessages = (conversationId: string) => {
  const messages = useP138OpenIMStore(state => state.messages);
  const selfUserId = useP138OpenIMStore(state => state.selfInfo.userID);

  console.log(messages, '========messages=======');

  return useMemo(
    () => filterMessagesForConversation(messages, conversationId, selfUserId),
    [messages, conversationId, selfUserId],
  );
};

export const useConnectionState = () =>
  useP138OpenIMStore(state => state.connectionState);

export const useUnreadCount = () =>
  useP138OpenIMStore(state => state.unreadCount);

export const useSyncing = () => useP138OpenIMStore(state => state.syncing);

export const useConversationIniting = () =>
  useP138OpenIMStore(state => state.conversationIniting);

export const useSelfInfo = () => useP138OpenIMStore(state => state.selfInfo);

// 事件发射器

