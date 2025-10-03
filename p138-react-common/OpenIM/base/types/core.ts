/**
 * 核心类型定义
 * 基础的数据结构和枚举
 */

import type { MessageItem, ConversationItem } from 'open-im-sdk-rn/src/types/entity';
 

// ===========================
// 基础枚举类型
// ===========================

export enum MessageType {
  Text = 101,
  Image = 102,
  Video = 104,
  Audio = 103,
  File = 105,
  RedPacket = 106,
  Transfer = 107,
  Relay = 108,
  Gift = 109,
  Card = 110,
  Coupon = 111,
  Announcement = 112,
  OrderForward = 113,
  ServiceAccount = 114,
  System = 1501,
}

export enum MessageStatus {
  Sending = 1,
  Sent = 2,
  Delivered = 3,
  Read = 4,
  Failed = 5,
  Recalled = 6,
}

export enum ConversationType {
  Single = 1,
  Group = 2,
}

export enum UserRole {
  User = 1,
  ShopOwner = 2,
  GroupOwner = 3,
  Admin = 4,
  SuperAdmin = 5,
  Service = 6,
  Robot = 7,
}

export enum ConnectionState {
  Disconnected = 0,    // 未连接
  Connecting = 1,       // 连接中
  Connected = 2,        // 已连接
  Reconnecting = 3,     // 重连中
  Failed = 4,           // 连接失败
}

// ===========================
// 核心数据结构
// ===========================

/**
 * 包装后的消息对象（用于UI层）
 */
export interface WrappedMessage {
  id: string;
  type: MessageType; // 使用 MessageType 枚举
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: number;
  status: MessageStatus; // 使用 MessageStatus 枚举
  extras: MessageItem; // 真实的 MessageItem 数据
}

/**
 * 会话对象
 */
export interface Conversation {
  id: string;
  type: ConversationType;
  participants: string[];
  lastMessage?: WrappedMessage;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  createdAt: number;
  updatedAt: number;
  extras?: ConversationItem;
}

/**
 * 群组对象
 */
export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  owner: string;
  admins: string[];
  members: string[];
  maxMembers: number;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
  extras?: Record<string, unknown>;
}

/**
 * 用户对象
 */
export interface User {
  id: string;
  nickname: string;
  avatar: string;
  role: UserRole;
}

// ===========================
// 配置和参数类型
// ===========================

export interface P138OpenIMConfig {
  /** API 服务地址 */
  apiUrl: string;
  /** WebSocket 地址 */
  wsUrl: string;
  /** 聊天服务地址 */
  chatUrl: string;
  /** 调试模式 */
  debug?: boolean;
}

export interface GroupParams {
  name: string;
  description?: string;
  avatar?: string;
  owner: string;
  members: string[];
  isPublic?: boolean;
}

// ===========================
// 登录相关
// ===========================

export interface LoginParams {
  /** 用户名（手机号） */
  username: string;
  /** 密码（md5 加密后） */
  password: string;
}

export interface LoginResult {
  /** 用户 ID */
  userID: string;
  /** IM Token */
  imToken: string;
  /** 聊天 Token */
  chatToken?: string;
}

// ===========================
// 消息相关
// ===========================

export interface SendMessageParams {
  /** 会话 ID */
  conversationId: string;
  /** 消息内容 */
  content: string;
  /** 消息类型 */
  type?: MessageType;
}

export interface SendTextMessageParams {
  /** 会话 ID */
  conversationId: string;
  /** 消息内容 */
  content: string;
}
