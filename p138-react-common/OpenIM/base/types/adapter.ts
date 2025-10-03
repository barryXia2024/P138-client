/**
 * 适配器层类型定义
 * 定义适配器接口和相关的数据结构
 */

import type { MessageItem, ConversationItem } from 'open-im-sdk-rn/src/types/entity';
import { GroupMemberItem, LoginStatus, PublicUserItem, SelfUserInfo, UserOnlineState } from "@openim/client-sdk";
import type { Group, GroupParams } from './core';

// ===========================
// 适配器接口
// ===========================

export interface IIMAdapter {
  // 核心功能
  login(userId: string, token: string): Promise<void>;
  logout(): Promise<void>;
  getLoginStatus(): Promise<LoginStatus>;

  // 会话管理
  getConversations(): Promise<import('./core').Conversation[]>;
  getOneConversation?(conversationId: string): Promise<ConversationItem>;
  markConversationAsRead?(conversationId: string): Promise<void>;
  getTotalUnreadCount?(): Promise<number>;
  onConversationsChange?(cb: (list: import('./core').Conversation[]) => void): void;
  // 已读回执（按消息）
  onMessageReadReceipt?(cb: (payload: { clientMsgID: string; conversationID?: string }) => void): void;
  // 撤回回执（按消息）
  onMessageRevoked?(cb: (payload: { clientMsgID: string; conversationID?: string }) => void): void;
  
  // 消息管理
  sendMessage?(params: {
    recvID: string;
    groupID: string;
    message: MessageItem;
  }): Promise<{ data: MessageItem }>;
  sendMessageDirectly?(params: { recvID: string; groupID: string; message: MessageItem }): Promise<void>;
  
  // 创建不同类型消息
  createTextMessage?(content: string): Promise<MessageItem>;
  createImageMessage?(imagePath: string, width?: number, height?: number): Promise<MessageItem>;
  createVoiceMessage?(voicePath: string, duration: number): Promise<MessageItem>;
  createVideoMessage?(videoPath: string, duration?: number, width?: number, height?: number, thumbnailPath?: string): Promise<MessageItem>;
  createFileMessage?(filePath: string, fileName: string): Promise<MessageItem>;
  
  getHistoryMessages?(conversationId: string, offset?: number, count?: number): Promise<MessageItem[]>;
  onMessage(cb: (msg: MessageItem) => void): void;
  revokeMessage?(msgId: string): Promise<void>;
  
  // 好友管理
  addFriend?(userInfo: { userID: string }, reqMsg?: string): Promise<void>;
  getFriendApplicationList?(): Promise<unknown[]>;
  acceptFriendApplication?(toUserId: string, handleMsg?: string): Promise<void>;
  refuseFriendApplication?(toUserId: string, handleMsg?: string): Promise<void>;
  
  // 群组管理
  createGroup(params: GroupParams): Promise<Group>;
  
  // 用户信息
  getSelfUserInfo?(): Promise<SelfUserInfo>;
  getUserInfo?(userId: string): Promise<PublicUserItem>;
  getUsersInfo?(userIdList: string[]): Promise<PublicUserItem[]>;
  isUserLoggedIn?(userId: string): Promise<boolean>;
  setSelfUserInfo(userInfo: SelfUserInfo): Promise<void>;
  // 用户在线状态管理
  subscribeUsersStatus?(userId: string): Promise<UserOnlineState[]>;
  unsubscribeUsersStatus?(userId: string): Promise<unknown>;
  getSubscribeUsersStatus?(): Promise<UserOnlineState[]>;
  onUserStatusChange?(cb: (list: UserOnlineState[]) => void): void;
  getSingleConversation?(conversationId: string): Promise<import('./core').Conversation>;
  getSingleConversationBySessionType?(conversationId: string, sessionType: number): Promise<import('./core').Conversation>;
  getGroupConversation?(groupID: string): Promise<import('./core').Conversation>;
  getGroupMemberList?(groupID: string): Promise<GroupMemberItem[]>;
  // 群资料/开关
  updateGroupName?(groupID: string, name: string): Promise<void>;
  updateGroupAnnouncement?(groupID: string, announcement: string): Promise<void>;
  setGroupMuteAll?(groupID: string, mute: boolean): Promise<void>;
  setConversationDoNotDisturb?(conversationId: string, enable: boolean): Promise<void>;
  // 占位方法
  muteUser(userId: string, duration?: number): Promise<void>;
}
