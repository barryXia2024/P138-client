/**
 * P138OpenIM 库专用工具函数
 * 独立实现，不依赖外部
 */

import { Conversation } from '../types';

// ===========================
// 会话排序与处理
// ===========================

/**
 * 会话排序（置顶优先 + 时间倒序）
 */
export const conversationSort = (conversations: Conversation[]): Conversation[] => {
  return [...conversations].sort((a, b) => {
    // 置顶优先
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    // 按最后更新时间倒序
    return b.updatedAt - a.updatedAt;
  });
};

/**
 * 增量更新会话列表
 * 只更新变更的会话，保持其他会话不变
 */
export const updateConversationsIncremental = (
  currentConversations: Conversation[],
  changedConversations: Conversation[]
): Conversation[] => {
  // 创建当前会话的映射，便于快速查找
  const conversationMap = new Map<string, Conversation>();
  currentConversations.forEach(conv => {
    conversationMap.set(conv.id, conv);
  });

  // 更新变更的会话
  changedConversations.forEach(changedConv => {
    conversationMap.set(changedConv.id, changedConv);
  });

  // 转换回数组并排序
  const updatedConversations = Array.from(conversationMap.values());
  return conversationSort(updatedConversations);
};

/**
 * 判断是否群聊会话
 */
export const isGroupSession = (type: string | number): boolean => {
  return type === 'group' || type === 2 || type === 3;
};

/**
 * 获取会话内容预览
 */
export const getConversationContent = (message: any): string => {
  if (!message) return '';
  
  const { content, type, contentType } = message;
  const msgType = type || (contentType === 101 ? 'text' : 'system');
  
  switch (msgType) {
    case 'text':
      return content || '';
    case 'image':
      return '[图片]';
    case 'audio':
      return '[语音]';
    case 'video':
      return '[视频]';
    case 'file':
      return '[文件]';
    default:
      return '[消息]';
  }
};

// ===========================
// 时间格式化
// ===========================

/**
 * 格式化时间（智能显示）
 */
export const formatTime = (timestamp: number): string => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (msgDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
  
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
};

/**
 * 格式化会话时间
 */
export const formatConversionTime = (timestamp: number): string => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 今天
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (msgDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }
  
  // 昨天
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  if (msgDate.getTime() === yesterday.getTime()) {
    return '昨天';
  }
  
  // 一周内
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  }
  
  // 更早
  return date.toLocaleDateString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit' 
  });
};

// ===========================
// 用户反馈
// ===========================

/**
 * 统一的 Toast 提示
 */
export const feedbackToast = ({ msg, error }: { msg?: string; error?: any }) => {
  const message = msg || (typeof error === 'string' ? error : '操作失败');
  
  // 优先使用全局 Toast
  if (typeof globalThis !== 'undefined' && (globalThis as any).Toast) {
    (globalThis as any).Toast.show(message);
  } else if (typeof window !== 'undefined' && (window as any).Toast) {
    (window as any).Toast.show(message);
  } else {
    // 降级到 console
    console.warn('Toast:', message, error);
  }
};

// ===========================
// 操作 ID 生成
// ===========================

/**
 * 生成操作 ID
 */
export const generateOperationID = (): string => {
  return `op_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

// ===========================
// 平台检测
// ===========================

/**
 * 获取平台 ID
 */
export const getPlatformID = (): number => {
  if (typeof window !== 'undefined') return 5; // Web
  // RN 环境下检测平台
  try {
    // 使用动态导入避免 require 错误
    const Platform = eval('require("react-native").Platform');
    return Platform.OS === 'ios' ? 1 : 2;
  } catch {
    return 2; // 默认 Android
  }
};

/**
 * 检查是否为 Web 环境
 */
export const isWeb = (): boolean => {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
};

/**
 * 检查是否为 RN 环境
 */
export const isReactNative = (): boolean => {
  return !isWeb();
};
