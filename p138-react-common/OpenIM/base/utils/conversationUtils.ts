/**
 * 会话工具函数 - 参考 demo 实现
 * 使用 OpenIM 标准的会话ID格式
 */

import type { MessageItem } from 'open-im-sdk-rn/src/types/entity';
import { SessionType as SDKSessionType } from 'open-im-sdk-rn/src/types/enum';
import { ConversationType } from '../types';

/**
 * 根据消息获取会话ID（与 demo 保持一致）
 */
export const getConversationIDByMsg = (message: MessageItem): string => {
  // 处理新创建的消息（sessionType = 0）或已发送的消息（sessionType = 1）
  if (message.sessionType === SDKSessionType.Single || message.sessionType === 0) {
    // 对于单聊，根据 recvID 和 groupID 判断
    if (message.recvID && !message.groupID) {
      const ids = [message.sendID, message.recvID].sort();
      return `si_${ids[0]}_${ids[1]}`;
    }
  }
  
  // 群聊：包括 Group(2) 和 WorkingGroup(3)
  if (message.sessionType === SDKSessionType.Group || 
      message.sessionType === SDKSessionType.WorkingGroup || 
      message.sessionType === 0) {
    // 对于群聊，根据 groupID 判断
    if (message.groupID) {
      return `sg_${message.groupID}`;
    }
  }
  
  if (message.sessionType === SDKSessionType.Notification) {
    return `sn_${message.sendID}_${message.recvID}`;
  }
  return "";
};

/**
 * 检查消息是否属于指定会话
 */
export const isMessageInConversation = (
  message: MessageItem, // 包装后的消息对象
  conversationId: string,
  _selfUserId?: string
): boolean => {
  // 获取真正的 MessageItem 数据（在 extras 字段中）
  const actualMessage = message.extras || message;
  
  // 使用 demo 的标准方法生成消息的会话ID
  const messageConversationId = getConversationIDByMsg(actualMessage);
 
  
  return messageConversationId === conversationId;
};

/**
 * 过滤属于指定会话的消息
 */
export const filterMessagesForConversation = (
  messages: MessageItem[], // 包装后的消息数组
  conversationId: string,
  selfUserId?: string,
): MessageItem[] => {
  
  const filtered = messages.filter(message => 
    isMessageInConversation(message, conversationId, selfUserId)
  );
 
  
  return filtered;
};

/**
 * 根据消息获取会话ID
 */
export const getConversationIdFromMessage = (message: MessageItem): string => {
  // 群聊消息
  if (message.groupID) {
    return message.groupID;
  }
  
  // 单聊消息：返回对方的ID
  // 这里需要知道当前用户ID才能确定对方是谁
  return message.recvID || message.sendID || '';
};

/**
 * 判断会话类型
 */
export const getConversationType = (conversationId: string): ConversationType => {
  // 按照 demo 的格式判断
  if (conversationId.startsWith('sg_')) {
    return ConversationType.Group;
  }
  if (conversationId.startsWith('si_')) {
    return ConversationType.Single;
  }
  
  // 兼容旧格式
  if (conversationId.includes('group')) {
    return ConversationType.Group;
  }
  
  return ConversationType.Single;
};

/**
 * 从标准会话ID中提取原始ID
 */
export const extractIdFromConversationId = (conversationId: string): string => {
  if (conversationId.startsWith('sg_')) {
    return conversationId.substring(3); // 移除 'sg_' 前缀
  }
  if (conversationId.startsWith('si_')) {
    return conversationId.substring(3); // 移除 'si_' 前缀
  }
  return conversationId; // 原始格式
};
