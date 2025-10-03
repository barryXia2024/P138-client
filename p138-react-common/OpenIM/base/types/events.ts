/**
 * 事件系统类型定义
 * 定义事件发射器和事件类型
 */

import type { MessageItem } from 'open-im-sdk-rn/src/types/entity';
import type { Conversation, Group, ConnectionState } from './core';
import type { LoginResult } from './core';

// ===========================
// 事件类型定义
// ===========================

export interface P138OpenIMEvents {
  // 登录事件
  loginSuccess: LoginResult;
  loginFailed: Error;
  logout: void;
  logoutFailed: Error;

  // 连接事件
  connectionStateChanged: ConnectionState;
  
  // 消息事件
  newMessage: MessageItem;
  messageSent: MessageItem;
  messageFailed: { message: MessageItem; error: Error };
  messageRevoked: string;

  // 会话事件
  conversationsChanged: Conversation[];
  conversationsRefreshed: Conversation[];
  conversationsRefreshFailed: Error;

  // 好友事件
  friendAdded: { userID: string };
  friendApplicationAccepted: string;
  friendApplicationRefused: string;

  // 群组事件
  groupCreated: Group;
}
