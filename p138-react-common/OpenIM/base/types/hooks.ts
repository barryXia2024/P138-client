/**
 * Hooks 层类型定义
 * 定义各个 hooks 的接口和状态类型
 */

import type { MessageItem } from 'open-im-sdk-rn/src/types/entity';
import type { Conversation, WrappedMessage, ConnectionState } from './core';

// ===========================
// 会话列表相关
// ===========================

export interface UseConversationListOptions {
  /** 是否自动登录 */
  autoLogin?: boolean;
  /** 登录信息 */
  loginInfo?: {
    userID: string;
    openIMToken: {
      token: string;
    };
  };
  /** 用户信息 */
  userInfo?: {
    nickname?: string;
    faceURL?: string;
    avatar?: string; // 支持 avatar 字段
  };
}

export interface UseConversationListReturn {
  /** 会话列表 */
  conversations: Conversation[];
  /** 连接状态 */
  connectionState: ConnectionState;
  /** 未读消息总数 */
  unreadCount: number;
  /** 是否正在同步 */
  syncing: boolean;
  /** 是否正在初始化会话 */
  conversationIniting: boolean;
  /** 是否正在刷新 */
  refreshing: boolean;
  /** 登录状态 */
  loginStatus: number;
  /** 错误信息 */
  error: string | null;
  /** 刷新会话列表 */
  refreshConversations: () => Promise<void>;
  /** 清除错误 */
  clearError: () => void;
  /** 手动登录 */
  login: () => Promise<void>;
  /** 登出 */
  logout: () => Promise<void>;
}

// ===========================
// 会话显示相关
// ===========================

export interface ConversationDisplayInfo {
  /** 显示标题 */
  title: string;
  /** 头像URL */
  avatar: string;
  /** 最后消息内容 */
  lastMessageContent: string;
  /** 最后消息时间 */
  lastMessageTime: string;
  /** 未读数量 */
  unreadCount: number;
  /** 是否置顶 */
  isPinned: boolean;
  /** 是否静音 */
  isMuted: boolean;
}

export interface UseConversationDisplayOptions {
  /** 当前用户ID */
  selfUserId?: string;
  /** 时间格式化函数 */
  formatTime?: (timestamp: number) => string;
}

// ===========================
// 消息发送相关
// ===========================

export interface SendMessageState {
  /** 是否正在发送 */
  sending: boolean;
  /** 错误信息 */
  error: string | null;
  /** 最后发送的消息ID */
  lastSentMessageId: string | null;
}

export interface SendMessageActions {
  /** 发送文本消息 */
  sendTextMessage: (content: string) => Promise<MessageItem>;
  /** 发送图片消息 */
  sendImageMessage: (imagePath: string, width?: number, height?: number) => Promise<MessageItem>;
  /** 发送语音消息 */
  sendVoiceMessage: (voicePath: string, duration: number) => Promise<MessageItem>;
  /** 发送视频消息 */
  sendVideoMessage: (videoPath: string, duration?: number, width?: number, height?: number, thumbnailPath?: string) => Promise<MessageItem>;
  /** 发送文件消息 */
  sendFileMessage: (filePath: string, fileName: string) => Promise<MessageItem>;
  /** 清除错误 */
  clearError: () => void;
}

export interface UseSendMessageOptions {
  /** 会话ID */
  conversationId: string;
  /** 是否自动处理状态更新 */
  autoHandleStatus?: boolean;
}

export interface UseSendMessageReturn extends SendMessageState, SendMessageActions {}

// ===========================
// 消息列表相关
// ===========================

export interface MessageListState {
  /** 消息列表 */
  messages: WrappedMessage[];
  /** 是否正在加载 */
  loading: boolean;
  /** 是否正在加载更多 */
  loadingMore: boolean;
  /** 是否还有更多消息 */
  hasMore: boolean;
  /** 错误信息 */
  error: string | null;
}

export interface MessageListActions {
  /** 刷新消息列表 */
  refresh: () => Promise<void>;
  /** 加载更多消息 */
  loadMore: () => Promise<void>;
  /** 搜索消息 */
  search: (keyword: string) => Promise<void>;
  /** 撤回消息 */
  revokeMessage: (messageId: string) => Promise<void>;
  /** 重发消息 */
  resendMessage: (messageId: string) => Promise<void>;
  /** 清除错误 */
  clearError: () => void;
}

export interface UseMessageListOptions {
  /** 会话ID */
  conversationId: string;
  /** 是否自动刷新 */
  autoRefresh?: boolean;
  /** 刷新间隔（毫秒） */
  refreshInterval?: number;
}

export interface UseMessageListReturn extends MessageListState, MessageListActions {}

// ===========================
// 聊天室相关
// ===========================

export interface ChatRoomState {
  /** 消息列表（包装后的消息对象） */
  messages: WrappedMessage[];
  /** 是否正在加载历史消息 */
  loadingHistory: boolean;
  /** 是否正在发送消息 */
  sending: boolean;
  /** 错误信息 */
  error: string | null;
  /** 是否有更多历史消息可加载 */
  hasMoreHistory: boolean;
}

export interface ChatRoomActions {
  /** 发送文本消息 */
  sendTextMessage: (content: string) => Promise<void>;
  /** 加载更多历史消息 */
  loadMoreHistory: () => Promise<void>;
  /** 重新加载历史消息 */
  reloadHistory: () => Promise<void>;
  /** 清除错误 */
  clearError: () => void;
}

export interface UseChatRoomOptions {
  /** 会话ID */
  conversationId: string;
  /** 初始加载的消息数量 */
  initialLoadCount?: number;
  /** 每次加载更多消息的数量 */
  loadMoreCount?: number;
  /** 是否自动加载历史消息 */
  autoLoadHistory?: boolean;
}

export interface UseChatRoomReturn extends ChatRoomState, ChatRoomActions {}
