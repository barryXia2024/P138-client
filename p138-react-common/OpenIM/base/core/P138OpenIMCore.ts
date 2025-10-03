/**
 * P138OpenIM 核心类 - 简化版
 * 只使用 OpenIM 的 MessageItem 类型
 */

import {create} from 'zustand';
import {useMemo} from 'react';
import type {
  Conversation,
  LoginParams,
  P138OpenIMConfig,
  WrappedMessage,
  SendTextMessageParams,
} from '../types';
import {
  MessageStatus as CustomMessageStatus,
  MessageType,
  ConnectionState,
  ConversationType,
  MessageStatus,
} from '../types';
import type {MessageItem} from 'open-im-sdk-rn/src/types/entity';
import {getIMAdapter} from '../adapters';
import {EventEmitter} from '../utils/eventEmitter';
import {
  conversationSort,
  updateConversationsIncremental,
} from '../utils/openIMUtils';
import {setIMProfile, clearIMProfile} from '../utils/storage';
import {getChatUrl, setConfig} from '../config';
import {
  GroupMemberItem,
  LoginStatus,
  PublicUserItem,
  SelfUserInfo,
  UserOnlineState,
} from '@openim/client-sdk';



import {
  filterMessagesForConversation,
  getConversationType,
  extractIdFromConversationId,
  isMessageInConversation,
} from '../utils/conversationUtils';
import {ConversationItem} from 'open-im-sdk-rn/src/types/entity';
import {SessionType as SDKSessionType} from 'open-im-sdk-rn/src/types/enum';

import {useUserStore} from 'src/store';

import {Platform} from 'react-native';
import {appConfig} from 'src/config';
import {env} from 'src/config/env';
import { useP138OpenIMStore } from './P138OpenIM';
import { refreshOpenimTokenApi } from 'src/api/interface/users-auth';


const eventEmitter = new EventEmitter();

export default class  {
    private initialized = false;
    private eventEmitter = new EventEmitter();
    private currentUserId: string | null = null;
  
    // ===========================
    // 初始化与配置
    // ===========================
  
    /**
     * 初始化 P138OpenIM
     */
    init(config: P138OpenIMConfig) {
      useP138OpenIMStore.setState({config});
      setConfig(config);
      this.initialized = true;
    }
  
    /**
     * 检查是否已初始化
     */
    private ensureInitialized() {
      if (!this.initialized) {
        throw new Error('P138OpenIM 未初始化，请先调用 init() 方法');
      }
    }
  
    // ===========================
    // 登录登出
    // ===========================
  
    /**
     * 登录（业务登录 + IM 登录）
     */
    async loginWithPassword(params: LoginParams): Promise<void> {
      this.ensureInitialized();
      const {config} = useP138OpenIMStore.getState();
      if (!config) throw new Error('配置缺失');
  
      useP138OpenIMStore.setState({syncing: true});
  
      return this.businessLogin(params)
        .then(async authResponse => {
          const im = getIMAdapter();
          return im
            .login(authResponse.userID, authResponse.imToken)
            .then(async () => {
              if (authResponse.chatToken) {
                await setIMProfile({
                  userID: authResponse.userID,
                  imToken: authResponse.imToken,
                  chatToken: authResponse.chatToken,
                });
              }
  
              useP138OpenIMStore.setState({
                selfInfo: {userID: authResponse.userID},
                connectionState: ConnectionState.Connected,
                isInitialized: true, // 标记为已初始化
              });
  
              this.setupEventListeners();
              return this.refreshConversations();
            })
            .then(() => {
              useP138OpenIMStore.setState({syncing: false});
              eventEmitter.emit('loginSuccess', authResponse);
            });
        })
        .catch(error => {
          useP138OpenIMStore.setState({
            syncing: false,
            connectionState: ConnectionState.Failed,
          });
          eventEmitter.emit('loginFailed', error);
          throw error;
        });
    }
  
    /**
     * 直接登录（使用已有的 userID 和 token）
     */
    login(userId: string, token: string): Promise<void> {
      const im = getIMAdapter();
  
      // 设置用户信息
      useP138OpenIMStore.setState({
        selfInfo: {userID: userId},
        connectionState: ConnectionState.Connected,
        isInitialized: true, // 标记为已初始化
      });
  
      im.login(userId, token);
  
      this.setupEventListeners();
      return Promise.resolve();
    }
  
    /**
     * 设置用户信息
     */
    async setSelfUserInfo(userInfo: SelfUserInfo): Promise<unknown> {
      const im = getIMAdapter();
      if (typeof im.setSelfUserInfo === 'function') {
        const result = await im.setSelfUserInfo(userInfo);
  
        // 更新 store 中的 selfInfo
        useP138OpenIMStore.setState({
          selfInfo: {
            userID: userInfo.userID,
            nickname: userInfo.nickname,
            avatar: userInfo.faceURL,
          },
        });
  
        return result;
      }
      return Promise.resolve();
    }
  
    /**
     * 获取用户信息
     */
    async getSelfUserInfo(): Promise<SelfUserInfo> {
      const im = getIMAdapter();
      if (typeof im.getSelfUserInfo === 'function') {
        return await im.getSelfUserInfo();
      }
      return {} as SelfUserInfo;
    }
  
    /**
     * 获取用户信息
     */
    async getUserInfo(userId: string): Promise<PublicUserItem> {
      const im = getIMAdapter();
      if (typeof im.getUserInfo === 'function') {
        return await im.getUserInfo(userId);
      }
      return {} as PublicUserItem;
    }
    /**
     * 获取用户信息列表
     */
    async getUsersInfo(userIdList: string[]): Promise<PublicUserItem[]> {
      const im = getIMAdapter();
      if (typeof im.getUsersInfo === 'function') {
        return await im.getUsersInfo(userIdList);
      }
      return Promise.resolve([]);
    }
  
    async logout(): Promise<void> {
      const im = getIMAdapter();
  
      return Promise.all([im.logout(), clearIMProfile()])
        .then(() => {
          useP138OpenIMStore.setState({
            conversations: [],
            messages: [],
            connectionState: ConnectionState.Disconnected,
            unreadCount: 0,
            selfInfo: {},
            syncing: false,
            conversationIniting: false,
            isInitialized: false, // 重置为未初始化
          });
  
          eventEmitter.emit('logout');
        })
        .catch(error => {
          eventEmitter.emit('logoutFailed', error);
          throw error;
        });
    }

    /**
     * 重新初始化 SDK（用于用户切换）
     */
    async reinitializeSDK(): Promise<void> {
      console.log('🔄 P138OpenIM 开始重新初始化...');
      
      try {
        const im = getIMAdapter();
        
        // 1. 重新初始化适配器
        if (typeof im.reinitializeSDK === 'function') {
          await im.reinitializeSDK();
        }
        
        // 2. 清理状态（安全处理）
        try {
          await clearIMProfile();
        } catch (storageError) {
          console.warn('⚠️ 清理存储状态失败，继续执行:', storageError);
        }
        
        // 3. 重置 Zustand 状态
        useP138OpenIMStore.setState({
          conversations: [],
          messages: [],
          connectionState: ConnectionState.Disconnected,
          unreadCount: 0,
          selfInfo: {},
          syncing: false,
          conversationIniting: false,
          isInitialized: false, // 重置为未初始化
        });
        
        // 4. 重置当前用户ID
        this.currentUserId = null;
        
        console.log('✅ P138OpenIM 重新初始化完成');
        eventEmitter.emit('reinitializeSuccess');
      } catch (error) {
        console.error('❌ P138OpenIM 重新初始化失败:', error);
        eventEmitter.emit('reinitializeFailed', error);
        throw error;
      }
    }

    /**
     * 监听用户切换并自动重新初始化
     */
    watchUserSwitch(): void {
      const { loginInfo, userInfo } = useUserStore.getState();
      
      // 检查是否切换了用户
      if (this.currentUserId && this.currentUserId !== loginInfo?.userID) {
        console.log('🔄 检测到用户切换:', {
          from: this.currentUserId,
          to: loginInfo?.userID
        });
        
        // 异步重新初始化
        this.reinitializeSDK().then(() => {
          // 重新初始化完成后，如果有新用户信息则自动登录
          if (loginInfo?.userID) {
            this.autoLogin(
              loginInfo?.openIMToken
                ? {
                    userID: loginInfo.userID,
                    openIMToken: {
                      token: loginInfo.openIMToken.token,
                    },
                  }
                : undefined,
              userInfo,
            ).catch(loginError => {
              console.error('❌ 用户切换后自动登录失败:', loginError);
            });
          }
        }).catch(error => {
          console.error('❌ 用户切换处理失败:', error);
          // 即使重新初始化失败，也要更新用户ID，避免重复处理
          this.currentUserId = loginInfo?.userID || null;
        });
      }
      
      // 更新当前用户ID
      this.currentUserId = loginInfo?.userID || null;
    }
  
    async getLoginStatus(): Promise<LoginStatus> {
      const im = getIMAdapter();
      if (typeof im.getLoginStatus === 'function') {
        return await im.getLoginStatus();
      }
      return 1;
    }
  
    // ===========================
    // 会话管理
    // ===========================
  
    async getConversations(): Promise<Conversation[]> {
      // 检查是否已完全初始化
      if (!this.isInitialized()) {
        console.warn('⚠️ OpenIM 未完全初始化，跳过获取会话列表');
        return [];
      }

      const im = getIMAdapter();
      return im.getConversations();
    }
  
    async refreshConversations(): Promise<void> {
      useP138OpenIMStore.setState({conversationIniting: true});
      return this.getConversations()
        .then(conversations => {
          console.log(conversations, '========refreshConversations========');
          useP138OpenIMStore.setState({
            conversations: conversationSort(conversations),
            conversationIniting: false,
          });
          eventEmitter.emit('conversationsRefreshed', conversations);
        })
        .catch(error => {
          useP138OpenIMStore.setState({conversationIniting: false});
          eventEmitter.emit('conversationsRefreshFailed', error);
          throw error;
        });
    }
  
    /**
     * 进入会话时标记该会话为已读，并本地置零未读数
     */
    async markConversationAsRead(conversationId: string): Promise<void> {
      const im = getIMAdapter();
      if (typeof im.markConversationAsRead === 'function') {
        try {
          await im.markConversationAsRead(conversationId);
        } catch (e) {
          // 忽略 SDK 异常，仍然进行本地置零，保证 UI 体验
          console.warn('markConversationAsRead failed:', e);
        }
      }
  
      // 本地置零未读数，立即反馈到 UI
      useP138OpenIMStore.setState(state => ({
        conversations: state.conversations.map(c =>
          c.id === conversationId ? {...c, unreadCount: 0} : c,
        ),
        unreadCount: 0,
      }));
    }
  
    /**
     * 获取单个会话
     */
    getSingleConversation(conversationId: string): Promise<Conversation> {
      const im = getIMAdapter();
      if (typeof im.getSingleConversation === 'function') {
        console.log(conversationId, '========conversationId========');
        return im.getSingleConversation(conversationId);
      }
      throw new Error('getSingleConversation 方法不支持');
    }
    getSingleConversationBySessionType(
      conversationId: string,
      sessionType: number,
    ): Promise<Conversation> {
      const im = getIMAdapter();
      if (typeof im.getSingleConversationBySessionType === 'function') {
        return im.getSingleConversationBySessionType(conversationId, sessionType);
      }
      throw new Error('getSingleConversationBySessionType 方法不支持');
    }
  
    getGroupConversation(groupID: string): Promise<Conversation> {
      const im = getIMAdapter();
      if (typeof im.getGroupConversation === 'function') {
        return im.getGroupConversation(groupID);
      }
      throw new Error('getGroupConversation 方法不支持');
    }
    // 用户在线状态管理
    subscribeUsersStatus(userId: string): Promise<UserOnlineState[]> {
      const im = getIMAdapter();
      if (typeof im.subscribeUsersStatus === 'function') {
        return im.subscribeUsersStatus(userId);
      }
      return Promise.resolve([]);
    }
    unsubscribeUsersStatus(userId: string): Promise<unknown> {
      const im = getIMAdapter();
      if (typeof im.unsubscribeUsersStatus === 'function') {
        return im.unsubscribeUsersStatus(userId);
      }
      return Promise.resolve();
    }
    getSubscribeUsersStatus(): Promise<UserOnlineState[]> {
      const im = getIMAdapter();
      if (typeof im.getSubscribeUsersStatus === 'function') {
        return im.getSubscribeUsersStatus();
      }
      return Promise.resolve([]);
    }
  
    // ===========================
    // 消息管理
    // ===========================
  
    /**
     * 发送文本消息
     */
    async sendTextMessage(params: SendTextMessageParams): Promise<void> {
      const {selfInfo} = useP138OpenIMStore.getState();
      if (!selfInfo?.userID) throw new Error('用户未登录');
      console.log(params, '========发送消息========');
  
      const im = getIMAdapter();
  
      try {
        // 1. 创建消息 - 参考Demo的实现
        const messageItem = await im.createTextMessage?.(params.content);
        if (!messageItem) {
          throw new Error('创建文本消息失败');
        }
  
        // 2. 自动判断会话类型和提取原始ID
        const conversationType = getConversationType(params.conversationId);
        const originalId = extractIdFromConversationId(params.conversationId);
  
        // 3. 设置消息的发送者和接收者信息
        const messageToSend = {
          ...messageItem,
          sendID: selfInfo.userID,
          recvID: conversationType === ConversationType.Single ? originalId : '',
          groupID: conversationType === ConversationType.Group ? originalId : '',
          status: 1, // sending
        } as MessageItem;
  
        // 4. 使用新的发送流程
        await this.sendMessage({
          recvID: conversationType === ConversationType.Single ? originalId : '',
          groupID: conversationType === ConversationType.Group ? originalId : '',
          message: messageToSend,
        });
      } catch (error) {
        console.error('发送消息失败:', error);
        throw error;
      }
    }
  
    /**
     * 获取历史消息
     */
    async getHistoryMessages(
      conversationId: string,
      count = 20,
    ): Promise<MessageItem[]> {
      // 检查是否已完全初始化
      if (!this.isInitialized()) {
        console.warn('⚠️ OpenIM 未完全初始化，跳过获取历史消息');
        return [];
      }

      const im = getIMAdapter();
      if (typeof im.getHistoryMessages === 'function') {
        return await im.getHistoryMessages(conversationId, count);
      }
      return [];
    }
  
    /**
     * 获取历史消息并添加到状态中
     */
    async loadHistoryMessages(conversationId: string, count = 20): Promise<void> {
      try {
        const historyMessages = await this.getHistoryMessages(
          conversationId,
          count,
        );
        console.log(historyMessages, '========historyMessages========');
  
        if (historyMessages.length > 0) {
          const currentMessages = useP138OpenIMStore.getState().messages;
          console.log(currentMessages, '========currentMessages========');
  
          // 过滤掉已存在的消息（根据消息ID去重）
          const existingMessageIds = new Set(
            currentMessages.map(m => {
              const actualMsg = m.extras || m;
              return actualMsg.clientMsgID || actualMsg.serverMsgID;
            }),
          );
          const newMessages = historyMessages.filter(
            m =>
              !existingMessageIds.has(m.clientMsgID || '') &&
              !existingMessageIds.has(m.serverMsgID || ''),
          );
  
          if (newMessages.length > 0) {
            // 将新的历史消息添加到消息列表前面（历史消息通常在前面）
            const newMessagesSorted = [
              ...newMessages.sort(
                (a, b) => (a.sendTime || 0) - (b.sendTime || 0),
              ),
              ...currentMessages,
            ];
            console.log(newMessagesSorted, '========newMessagesSorted========');
            useP138OpenIMStore.setState(state => ({
              messages: newMessagesSorted as WrappedMessage[],
            }));
  
            console.log(`加载了 ${newMessages.length} 条历史消息`);
          }
        }
      } catch (error) {
        console.error('加载历史消息失败:', error);
        throw error;
      }
    }
  
    // ===========================
    // 内部方法
    // ===========================
  
    /**
     * 业务登录
     */
    private async businessLogin(params: LoginParams): Promise<{
      userID: string;
      imToken: string;
      chatToken?: string;
    }> {
      const response = await fetch(`${getChatUrl()}/account/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          operationID: this.generateOperationID(),
        },
        body: JSON.stringify({
          areaCode: '+86',
          phoneNumber: params.username,
          password: params.password,
          platform: typeof window !== 'undefined' ? 5 : 2,
        }),
      });
  
      if (!response.ok) throw new Error('业务登录失败');
  
      const resp = await response.json();
      const raw = resp?.data ?? resp;
      let base = raw;
      if (
        base &&
        typeof base === 'object' &&
        'data' in base &&
        typeof base.data === 'object'
      ) {
        base = base.data;
      }
      if (
        base &&
        typeof base === 'object' &&
        'errCode' in base &&
        base.errCode !== 0
      ) {
        throw new Error(base.errMsg || '登录失败');
      }
      const payload =
        (base && typeof base === 'object' && 'data' in base ? base.data : base) ||
        {};
  
      return {
        userID: payload?.userID || payload?.userId || payload?.imUserId,
        imToken: payload?.imToken || payload?.token,
        chatToken: payload?.chatToken,
      };
    }
  
    /**
     * 设置事件监听
     */
    private setupEventListeners() {
      const im = getIMAdapter();
  
      // 消息监听
      im.onMessage(message => {
        console.log('收到新消息:', message);
  
        // 检查消息是否属于当前会话
        const currentConversationId =
          useP138OpenIMStore.getState().currentConversation?.conversationID;
        if (
          currentConversationId &&
          this.isMessageInConversation(message, currentConversationId)
        ) {
          // 检查是否已存在相同消息（去重）
          const messages = useP138OpenIMStore.getState().messages;
          const exists = messages.some(m => {
            const actualMsg = m.extras || m;
            return (
              actualMsg.clientMsgID === message.clientMsgID ||
              actualMsg.serverMsgID === message.serverMsgID
            );
          });
  
          if (!exists) {
            this.addMessageItem(message as unknown as WrappedMessage);
            eventEmitter.emit('newMessage', message);
          }
        }
      });
  
      // 会话变更监听
      if (typeof im.onConversationsChange === 'function') {
        im.onConversationsChange(changedConversations => {
          // 使用增量更新，只更新变更的会话
          useP138OpenIMStore.setState(state => ({
            conversations: updateConversationsIncremental(
              state.conversations,
              changedConversations,
            ),
          }));
          eventEmitter.emit('conversationsChanged', changedConversations);
        });
      }
      if (typeof im.onUserStatusChange === 'function') {
        im.onUserStatusChange(userStatus => {
          eventEmitter.emit('userStatusChanged', userStatus);
        });
      }
  
      if (typeof im.onMarkConversationAsRead === 'function') {
        im.onMarkConversationAsRead(conversationId => {
          eventEmitter.emit('markConversationAsRead', conversationId);
        });
      }
  
      // 监听消息已读回执，使用统一入口更新消息状态
      if (typeof im.onMessageReadReceipt === 'function') {
        im.onMessageReadReceipt(({clientMsgID}) => {
          try {
            this.updateMessageItemStatus(clientMsgID, MessageStatus.Read);
          } catch {}
        });
      }
    }
  
    /**
     * 添加消息到本地
     */
    private addMessageItem(message: WrappedMessage) {
      useP138OpenIMStore.setState(state => ({
        messages: [...state.messages, message],
      }));
    }
  
    /**
     * 检查消息是否属于指定会话
     */
    private isMessageInConversation(
      message: any,
      conversationId: string,
    ): boolean {
      // 如果消息是包装后的格式，提取实际消息
      const actualMessage = message.extras || message;
      return isMessageInConversation(actualMessage, conversationId);
    }
  
    /**
     * 更新消息状态
     */
    private updateMessageItemStatus(msgId: string, status: number) {
      useP138OpenIMStore.setState(state => ({
        messages: state.messages.map(m => {
          const actualMsg = m.extras || m;
          if (
            actualMsg.clientMsgID === msgId ||
            actualMsg.serverMsgID === msgId
          ) {
            // 更新消息状态
            const updatedMsg = {...actualMsg, status};
            return {
              ...m,
              extras: updatedMsg,
            };
          }
          return m;
        }),
      }));
    }
  
    /**
     * 生成操作 ID
     */
    private generateOperationID(): string {
      return `op_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }
  
    // ===========================
    // 事件监听
    // ===========================
  
    onMessage(callback: (message: MessageItem) => void) {
      return eventEmitter.on('newMessage', callback);
    }
  
    onConversationChanged(callback: (conversations: Conversation[]) => void) {
      return eventEmitter.on('conversationsChanged', callback);
    }
  
    onConnectionStateChanged(callback: (state: ConnectionState) => void) {
      return eventEmitter.on('connectionStateChanged', callback);
    }
  
    onLoginSuccess(callback: (userInfo: unknown) => void) {
      return eventEmitter.on('loginSuccess', callback);
    }
  
    onLoginFailed(callback: (error: unknown) => void) {
      return eventEmitter.on('loginFailed', callback);
    }
  
    onMessageSent(callback: (message: MessageItem) => void) {
      return eventEmitter.on('messageSent', callback);
    }
  
    onMessageFailed(
      callback: (data: {message: MessageItem; error: unknown}) => void,
    ) {
      return eventEmitter.on('messageFailed', callback);
    }
    onUserStatusChanged(callback: (state: UserOnlineState[]) => void) {
      return eventEmitter.on('userStatusChanged', callback);
    }
  
    off(event: string, callback: (data: unknown) => void) {
      return eventEmitter.off(event, callback);
    }
  
    /**
     * 设置当前会话
     */
    setCurrentConversation(conversationId: string): void {
      // 从会话列表中查找对应的会话
      const conversation = useP138OpenIMStore
        .getState()
        .conversations.find(c => c.id === conversationId);
  
      if (conversation) {
        console.log('设置当前会话:', {
          conversationId,
          conversationType: conversation.type,
          participants: conversation.participants,
          selfUserId: useP138OpenIMStore.getState().selfInfo?.userID,
        });
  
        // 根据会话ID判断类型，而不是依赖 conversation.type
        const isSingleChat = conversationId.startsWith('si_');
        const isGroupChat = conversationId.startsWith('sg_');
  
        console.log('会话类型判断:', {
          conversationId,
          isSingleChat,
          isGroupChat,
          originalType: conversation.type,
        });
  
        // 将 Conversation 转换为 ConversationItem
        const conversationItem: ConversationItem = {
          conversationID: conversation.id,
          conversationType: isSingleChat
            ? SDKSessionType.Single
            : SDKSessionType.Group,
          userID: isSingleChat
            ? conversation.participants.find(
                p => p !== useP138OpenIMStore.getState().selfInfo?.userID,
              ) || ''
            : '',
          groupID: isGroupChat ? conversation.id.replace('sg_', '') : '',
          showName: conversation.participants.join(', '),
          faceURL: '',
          recvMsgOpt: 0,
          unreadCount: 0,
          groupAtType: 0,
          latestMsg: '',
          latestMsgSendTime: 0,
          draftText: '',
          draftTextTime: 0,
          burnDuration: 0,
          msgDestructTime: 0,
          isPinned: false,
          isNotInGroup: false,
          isPrivateChat: false,
          isMsgDestruct: false,
          attachedInfo: '',
        };
  
        useP138OpenIMStore.setState({
          currentConversation: conversationItem,
        });
      } else {
        // 会话不存在，创建一个临时的会话对象
        console.log('会话不存在，创建临时会话:', {
          conversationId,
          selfUserId: useP138OpenIMStore.getState().selfInfo?.userID,
        });
  
        const isSingleChat = conversationId.startsWith('si_');
        const isGroupChat = conversationId.startsWith('sg_');
  
        // 从会话ID中提取用户ID
        let otherUserId = '';
        if (isSingleChat) {
          // si_user1_user2 格式，找到不是当前用户的ID
          const parts = conversationId.split('_');
          const selfUserId = useP138OpenIMStore.getState().selfInfo?.userID;
          otherUserId =
            parts.find(part => part !== selfUserId && part !== 'si') || '';
        }
  
        const conversationItem: ConversationItem = {
          conversationID: conversationId,
          conversationType: isSingleChat
            ? SDKSessionType.Single
            : SDKSessionType.Group,
          userID: otherUserId,
          groupID: isGroupChat ? conversationId.replace('sg_', '') : '',
          showName: otherUserId || '未知用户',
          faceURL: '',
          recvMsgOpt: 0,
          unreadCount: 0,
          groupAtType: 0,
          latestMsg: '',
          latestMsgSendTime: 0,
          draftText: '',
          draftTextTime: 0,
          burnDuration: 0,
          msgDestructTime: 0,
          isPinned: false,
          isNotInGroup: false,
          isPrivateChat: false,
          isMsgDestruct: false,
          attachedInfo: '',
        };
  
        useP138OpenIMStore.setState({
          currentConversation: conversationItem,
        });
      }
    }
  
    /**
     * 获取当前会话
     */
    getCurrentConversation(): ConversationItem | null {
      return useP138OpenIMStore.getState().currentConversation;
    }
  
    /**
     * 推送新消息到UI（参考Demo的pushNewMessage）
     */
    pushNewMessage(message: MessageItem): void {
      // 检查是否已存在相同消息（去重）
      const messages = useP138OpenIMStore.getState().messages;
      const exists = messages.some(m => {
        const actualMsg = m.extras || m;
        return actualMsg.clientMsgID === message.clientMsgID;
      });
  
      if (!exists) {
        // 将 MessageItem 包装成 WrappedMessage
        const wrappedMessage: WrappedMessage = {
          id: message.clientMsgID || message.serverMsgID || '',
          type: (message.contentType ||
            MessageType.Text) as unknown as MessageType,
          content: this.getMessageContent(message),
          senderId: message.sendID || '',
          receiverId: message.recvID || message.groupID || '',
          timestamp: message.sendTime || message.createTime || Date.now(),
          status: (message.status ||
            CustomMessageStatus.Sent) as unknown as CustomMessageStatus,
          extras: message,
        };
  
        this.addMessageItem(wrappedMessage);
      }
    }
  
    /**
     * 获取消息内容
     */
    private getMessageContent(message: MessageItem): string {
      if (message.textElem?.content) {
        return message.textElem.content;
      }
      if (message.pictureElem?.sourcePicture?.url) {
        return '[图片]';
      }
      if (message.soundElem?.sourceUrl) {
        return '[语音]';
      }
      if (message.videoElem?.videoUrl) {
        return '[视频]';
      }
      if (message.fileElem?.fileName) {
        return `[文件] ${message.fileElem.fileName}`;
      }
      if (message.locationElem?.description) {
        return `[位置] ${message.locationElem.description}`;
      }
      if (message.customElem?.data) {
        return '[自定义消息]';
      }
      if (message.notificationElem?.detail) {
        return '[系统通知]';
      }
      return '';
    }
  
    /**
     * 解析图片消息
     * @param message 包装后的消息对象
     * @returns 图片信息对象
     */
    parseImageMessage(message: WrappedMessage): {
      url: string;
      width: number;
      height: number;
      thumbnail: string;
    } | null {
      if (message.type !== MessageType.Image) return null;
  

      const extras = message.extras as any;
      if (extras?.pictureElem) {
        const sourcePicture = extras.pictureElem.sourcePicture;
        const snapshotPicture = extras.pictureElem.snapshotPicture;
        
        console.log('🖼️ 从extras.pictureElem解析图片:', {
          sourcePicture: sourcePicture?.url?.substring(0, 50) + '...',
          snapshotPicture: snapshotPicture?.url?.substring(0, 50) + '...',
          width: sourcePicture?.width,
          height: sourcePicture?.height,
          fullSourceUrl: sourcePicture?.url,
          fullSnapshotUrl: snapshotPicture?.url,
        });
  

        let imageUrl = sourcePicture?.url || sourcePicture?.uri || snapshotPicture?.url || snapshotPicture?.uri;
        
        if (imageUrl) {
          console.log('🖼️ 找到图片URL:', imageUrl);
          
          //处理不同类型的图片URL
          let finalUrl = imageUrl;
          
          // 如果是本地文件路径，添加file://前缀
          if (imageUrl.startsWith('/') && !imageUrl.startsWith('file://')) {
            finalUrl = `file://${imageUrl}`;
            console.log('🔧 添加file://前缀:', finalUrl);
          }
          
          // 如果是相对路径，尝试转换为绝对路径
          if (!imageUrl.startsWith('http') && !imageUrl.startsWith('file://') && !imageUrl.startsWith('/')) {
            finalUrl = `file://${imageUrl}`;
            console.log('🔧 转换相对路径为绝对路径:', finalUrl);
          }
          
          // 处理HTTP/HTTPS协议问题
          if (imageUrl.startsWith('http://')) {
            // 如果是HTTP，尝试转换为HTTPS（如果服务器支持）
            const httpsUrl = imageUrl.replace('http://', 'https://');
            console.log('🔧 尝试转换HTTP为HTTPS:', httpsUrl);
            finalUrl = httpsUrl;
          }
          
          console.log('🖼️ 最终图片URL:', finalUrl);
          
          return {
            url: finalUrl,
            width: sourcePicture?.width || snapshotPicture?.width || 200,
            height: sourcePicture?.height || snapshotPicture?.height || 200,
            thumbnail: sourcePicture?.thumbnail || snapshotPicture?.thumbnail || finalUrl,
          };
        } else {
          console.warn('⚠️ 未找到有效的图片URL:', {
            sourcePicture: sourcePicture,
            snapshotPicture: snapshotPicture,
          });
          // 不返回null，继续尝试其他方式解析
        }
      }
  
      try {
        // 尝试解析JSON格式
        const content = JSON.parse(message.content);
        return {
          url:
            content.sourcePicture?.url ||
            content.sourcePicture?.uri ||
            content.url,
          width: content.sourcePicture?.width || content.width || 200,
          height: content.sourcePicture?.height || content.height || 200,
          thumbnail: content.sourcePicture?.thumbnail || content.thumbnail,
        };
      } catch {
        // 如果内容就是URL
        if (message.content && message.content.startsWith('http')) {
          return {
            url: message.content,
            width: 200,
            height: 200,
            thumbnail: message.content,
          };
        }
  
        // 默认情况
        return {
          url: message.content,
          width: 200,
          height: 200,
          thumbnail: message.content,
        };
      }
    }
  
    /**
     * 解析文本消息
     * @param message 包装后的消息对象
     * @returns 文本信息对象
     */
    parseTextMessage(message: WrappedMessage): {
      content: string;
      isSystemMessage: boolean;
    } {
      return {
        content: message.content,
        isSystemMessage: message.type === MessageType.System,
      };
    }
  
    /**
     * 将 MessageItem 包装成 WrappedMessage
     * 这是一个公共方法，供 hooks 使用
     *
     * @param messageItem SDK 原始消息对象
     * @returns 包装后的消息对象
     */
    wrapMessageItem(messageItem: MessageItem): WrappedMessage {
      return {
        id: messageItem.clientMsgID || messageItem.serverMsgID || '',
        type: (messageItem.contentType ||
          MessageType.Text) as unknown as MessageType,
        content: this.getMessageContent(messageItem),
        senderId: messageItem.sendID || '',
        receiverId: messageItem.recvID || messageItem.groupID || '',
        timestamp: messageItem.sendTime || messageItem.createTime || Date.now(),
        status: (messageItem.status ||
          CustomMessageStatus.Sent) as unknown as CustomMessageStatus,
        extras: messageItem, // 保存原始 MessageItem 数据
      };
    }
  
    /**
     * 更新单个消息（参考Demo的updateOneMessage）
     */
    updateOneMessage(message: MessageItem): void {
      console.log('updateOneMessage 被调用:', {
        messageClientMsgID: message.clientMsgID,
        messageStatus: message.status,
        totalMessages: useP138OpenIMStore.getState().messages.length,
      });
  
      useP138OpenIMStore.setState(state => ({
        messages: state.messages.map(m => {
          const actualMsg = m.extras || m;
          if (actualMsg.clientMsgID === message.clientMsgID) {
            console.log('找到匹配的消息，更新状态:', {
              oldStatus: actualMsg.status,
              newStatus: message.status,
              clientMsgID: actualMsg.clientMsgID,
            });
            return {
              ...m,
              extras: {...actualMsg, ...message},
              status: (message.status ||
                CustomMessageStatus.Sent) as unknown as CustomMessageStatus,
            };
          }
          return m;
        }),
      }));
    }
  
    /**
     * 发送消息（参考Demo的sendMessage）
     */
    async sendMessage(params: {
      recvID: string;
      groupID: string;
      message: MessageItem;
    }): Promise<{data: MessageItem}> {
      const im = getIMAdapter();
      if (!im.sendMessage) {
        throw new Error('sendMessage 方法不支持');
      }
      const result = await im.sendMessage(params);
      if (!result) {
        throw new Error('发送消息失败：适配器返回空结果');
      }
      return result;
    }
  
    /**
     * 创建文本消息
     */
    async createTextMessage(content: string): Promise<MessageItem> {
      const im = getIMAdapter();
      return (await im.createTextMessage?.(content)) || ({} as MessageItem);
    }
  
    /**
     * 创建图片消息
     */
    async createImageMessage(
      imagePath: string,
      width?: number,
      height?: number,
    ): Promise<MessageItem> {
      const im = getIMAdapter() as any;
      return (
        (await im.createImageMessage?.(imagePath, width, height)) ||
        ({} as MessageItem)
      );
    }
  
    /**
     * 触发事件
     */
    emit(event: string, data?: any): void {
      eventEmitter.emit(event, data);
    }
  
    // ===========================
    // 获取状态快照
    // ===========================
  
    getState() {
      return useP138OpenIMStore.getState();
    }
  
    /**
     * 获取指定会话的消息（非响应式）
     */
    getMessagesForConversation(conversationId: string): any[] {
      const {messages, selfInfo} = useP138OpenIMStore.getState();
      return filterMessagesForConversation(
        messages,
        conversationId,
        selfInfo.userID,
      );
    }
    getGroupMemberList(groupID: string): Promise<GroupMemberItem[]> {
      const im = getIMAdapter();
      if (typeof im.getGroupMemberList === 'function') {
        return im.getGroupMemberList(groupID);
      }
      throw new Error('getGroupMemberList 方法不支持');
    }
  
    // 群资料开关封装
    async updateGroupName(groupID: string, name: string): Promise<void> {
      const im = getIMAdapter();
      if (typeof im.updateGroupName === 'function') {
        await im.updateGroupName(groupID, name);
      } else {
        throw new Error('updateGroupName 方法不支持');
      }
    }
    async updateGroupAnnouncement(
      groupID: string,
      announcement: string,
    ): Promise<void> {
      const im = getIMAdapter();
      if (typeof im.updateGroupAnnouncement === 'function') {
        await im.updateGroupAnnouncement(groupID, announcement);
      } else {
        throw new Error('updateGroupAnnouncement 方法不支持');
      }
    }
    async setGroupMuteAll(groupID: string, mute: boolean): Promise<void> {
      const im = getIMAdapter();
      if (typeof im.setGroupMuteAll === 'function') {
        await im.setGroupMuteAll(groupID, mute);
      } else {
        throw new Error('setGroupMuteAll 方法不支持');
      }
    }
    async setConversationDoNotDisturb(
      conversationId: string,
      enable: boolean,
    ): Promise<void> {
      const im = getIMAdapter();
      if (typeof im.setConversationDoNotDisturb === 'function') {
        await im.setConversationDoNotDisturb(conversationId, enable);
      } else {
        throw new Error('setConversationDoNotDisturb 方法不支持');
      }
    }
  
    // 暂不提供 getGroupInfo（不同端类型差异较大）
  
    // ===========================
    // 全局状态管理方法
    // ===========================
  
    /**
     * 自动登录管理
     */
    async autoLogin(
      loginInfo?: {userID: string; openIMToken: {token: string}},
      userInfo?: {nickname?: string; faceURL?: string; avatar?: string},
    ): Promise<void> {
      // 先检查用户切换
      this.watchUserSwitch();
      
      const state = useP138OpenIMStore.getState();
  
      // 如果已经登录，直接返回
      if (state.selfInfo.userID) {
        console.log('已经登录，直接返回');
        return;
      }
  
      // 如果没有登录信息，返回
      if (!loginInfo?.userID || !loginInfo?.openIMToken?.token) {
        console.log('如果没有登录信息，返回');
        return;
      }
  
      try {
        // 初始化配置
        if (!state.config) {
          this.init({
            apiUrl:env.OpenIM_API_URL,
            wsUrl: env.OpenIM_WS_URL,
            chatUrl:
              process.env.REACT_APP_OPENIM_CHAT_URL ||
              'http://47.107.143.93:10008',
            debug: process.env.NODE_ENV === 'development',
          });
        }
  
        console.log('loginInfo', loginInfo);
        // 执行登录
  
        await this.login(loginInfo.userID, loginInfo.openIMToken.token);
  
        // 设置用户信息
        if (userInfo?.nickname) {
          const selfInfo = await this.getSelfUserInfo();
          if (selfInfo) {
            await this.setSelfUserInfo({
              ...selfInfo,
              nickname: userInfo.nickname,
              faceURL: userInfo.avatar || (selfInfo as any).faceURL,
            } as any);
          }
        }
  
        // 刷新会话列表
        await this.refreshConversations();
      } catch (e: any) {
        console.error('自动登录失败:', e);
        const errMsg = e?.errMsg || e?.message || '';
        const errCode = e?.errCode ?? e?.code;
        console.log('errMsg', errMsg);
        console.log('errCode', errCode);
  
        const isTokenKicked =
          errCode === 10006 || /TokenKickedError/i.test(String(errMsg));
        if (!isTokenKicked) throw e;
  
        // 刷新 openIM token 并重试
  
        const storeState = useUserStore.getState();
        const currentUserId = loginInfo.userID;
        const currentUserType = storeState.userInfo?.userType;
        console.log('appConfig.platform', appConfig.platform == 'business');
        // 通过统一封装的动态导入，兼容部分项目缺少其中一个模块的情况
  
        const resp = await refreshOpenimTokenApi({
          userType: (currentUserType ?? 0) as any,
          userID: currentUserId,
          platform: (Platform.OS === 'web'
            ? 'pc'
            : Platform.OS) as BasicTypes.Platform,
        });
        const newToken = resp.data?.token;
        if (!newToken) {
          console.error('newToken', newToken);
          return;
        }
  
        // 更新 store 与内存中的 token
        const newLoginInfo = {
          ...storeState.loginInfo,
          openIMToken: {
            ...(storeState.loginInfo?.openIMToken || {}),
            token: newToken,
          },
        } as ServerCoreAuth.UserSignInResult;
        storeState.setLoginInfo?.(newLoginInfo);
        loginInfo.openIMToken.token = newToken;
  
        // 使用新 token 重试登录
        await this.login(currentUserId, newToken);
        throw e;
      }
    }
  
    /**
     * 获取登录状态（同步）
     */
    getLoginStatusSync(): number {
      const state = useP138OpenIMStore.getState();
      return state.selfInfo.userID ? 1 : 0;
    }
  
    /**
     * 检查是否已登录
     */
    isLoggedIn(): boolean {
      return this.getLoginStatusSync() === 1;
    }

    /**
     * 检查是否已完全初始化
     */
    isInitialized(): boolean {
      const state = useP138OpenIMStore.getState();
      return state.isInitialized && state.connectionState === ConnectionState.Connected;
    }
  
    /**
     * 获取当前状态（用于调试）
     */
    getCurrentState() {
      return useP138OpenIMStore.getState();
    }
  }
   