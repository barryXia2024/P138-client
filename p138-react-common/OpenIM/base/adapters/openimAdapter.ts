import OpenIMSDKRN, {OpenIMEmitter} from 'open-im-sdk-rn';
import {
  ConversationType,
  MessageType,
  MessageStatus,
  type Conversation,
  type Group,
  type GroupParams,
  type IIMAdapter,
} from '../types';
import RNFS from 'react-native-fs';
import {getApiUrl, getWsUrl} from '../config';
import {safeFileExists} from '@/utils/safeFileUtils';

// 导入准确的 RN SDK 类型
import type {
  InitOptions,
  LoginParams,
  SplitConversationParams,
  GetOneConversationParams,
  GetAdvancedHistoryMsgParams,
  SendMsgParams,
  CreateGroupParams,
  AddFriendParams,
  AccessFriendParams,
  OpreateMessageParams,
} from 'open-im-sdk-rn/src/types/params';

import type {
  ConversationItem,
  MessageItem,
  GroupItem,
  SelfUserInfo,
  FriendApplicationItem,
} from 'open-im-sdk-rn/src/types/entity';

import type {LoginStatus, ViewType} from 'open-im-sdk-rn/src/types/enum';
import {GroupMemberItem, PublicUserItem, UserOnlineState} from '@openim/client-sdk';

const DATA_DIR = RNFS.DocumentDirectoryPath + '/tmp';
RNFS.mkdir(DATA_DIR).catch(() => {});

const opid = () => `op_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

let synced = false;
let initialized = false;
const messageCallbacks: ((msg: MessageItem) => void)[] = [];
const conversationCallbacks: ((list: Conversation[]) => void)[] = [];
const userOnlineStatusCallbacks: ((list: UserOnlineState[]) => void)[] = [];
const markConversationAsReadCallbacks: ((conversationId: string) => void)[] = [];
const messageReadReceiptCallbacks: ((payload: {clientMsgID: string; conversationID?: string}) => void)[] = [];
const messageRevokedCallbacks: ((payload: {clientMsgID: string; conversationID?: string}) => void)[] = [];

// 映射会话数据
function mapConversation(c: ConversationItem): Conversation {
  const isGroup = !!c.groupID;
  // 解析 latestMsg（可能是字符串或对象）
  let latestMsg: MessageItem | null = null;
  if (c.latestMsg) {
    if (typeof c.latestMsg === 'string') {
      try {
        latestMsg = JSON.parse(c.latestMsg);
      } catch {
        latestMsg = null;
      }
    } else {
      latestMsg = c.latestMsg as MessageItem;
    }
  }

  return {
    id: c.conversationID || `${isGroup ? 'group_' : 'single_'}${c.userID || c.groupID}`,
    type: isGroup ? ConversationType.Group : ConversationType.Single,
    participants: isGroup ? [c.groupID] : [c.userID],
    lastMessage: latestMsg
      ? {
          id: String(
            latestMsg.clientMsgID || latestMsg.serverMsgID || Date.now(),
          ),
          type: latestMsg.contentType === 101 ? MessageType.Text : MessageType.System,
          content: latestMsg.content || '',
          senderId: latestMsg.sendID || '',
          receiverId: latestMsg.recvID || latestMsg.groupID || '',
          timestamp: Number(latestMsg.sendTime || Date.now()),
          status: MessageStatus.Delivered,
          extras: latestMsg,
        }
      : undefined,
    unreadCount: Number(c.unreadCount || 0),
    isPinned: !!c.isPinned,
    isMuted: c.recvMsgOpt !== 0,
    createdAt: Date.now(),
    updatedAt: Number(latestMsg?.sendTime || Date.now()),
    extras: c,
  };
}



// 初始化事件监听
function initEvents() {
  if (initialized) return;

  // 同步开始
  OpenIMEmitter.addListener('onSyncServerStart', () => {
    console.log('🔄 同步开始');
    synced = false;
  });

  // 同步完成
  OpenIMEmitter.addListener('onSyncServerFinish', () => {
    console.log('✅ 同步完成');
    synced = true;
  });
  
  // 添加其他可能的同步事件监听
  OpenIMEmitter.addListener('onSyncServerProgress', (data) => {
    console.log('📊 同步进度:', data);
  });

  // 新消息监听
  OpenIMEmitter.addListener('onRecvNewMessages', (data: MessageItem[]) => {
    // 🚨 关键修复：添加与Web端相同的消息过滤逻辑
    const filteredMessages = (data || []).filter((msg: MessageItem) => {
      const contentType = Number(msg.contentType);
      const content = String(msg.content || '').trim();
      
      // 只过滤系统通知消息（contentType 1501,10011,1519,1509）且内容为空的情况
      if ([1501, 10011, 1519, 1509].includes(contentType) && content.length === 0) {
        console.log('RN端过滤掉新收到的空通知消息:', contentType);
        return false; // 隐藏空的通知消息
      }
      
      // 其他所有消息都保留
      return true;
    });
    
    console.log('RN端新消息过滤结果:', {
      原始数量: data?.length || 0,
      过滤后数量: filteredMessages.length,
      过滤掉数量: (data?.length || 0) - filteredMessages.length
    });
    
    // 只处理过滤后的消息
    filteredMessages.forEach((msg: MessageItem) => {
      messageCallbacks.forEach(cb => cb(msg));
    });
  });

  // 会话变更监听
  OpenIMEmitter.addListener(
    'onConversationChanged',
    (data: ConversationItem[]) => {
      const mappedConversations = (data || []).map(mapConversation);
      conversationCallbacks.forEach(cb => cb(mappedConversations));
    },
  );
  OpenIMEmitter.addListener('onUserStatusChanged', (data: UserOnlineState[]) => {
    userOnlineStatusCallbacks.forEach(cb => cb(data));
  });
  OpenIMEmitter.addListener('onMarkConversationAsRead', (data: string) => {
    markConversationAsReadCallbacks.forEach(cb => cb(data));
  });
  // 单条消息已读回执（RN SDK 事件名可能为 onRecvC2CReadReceipt / onRecvGroupReadReceipt，不同版本有差异）
  OpenIMEmitter.addListener('onRecvC2CReadReceipt', (arr: any[]) => {
    try {
      (arr || []).forEach((r: any) => {
        if (r?.clientMsgID) {
          messageReadReceiptCallbacks.forEach(cb => cb({ clientMsgID: r.clientMsgID, conversationID: r.conversationID }));
        }
      });
    } catch {}
  });
  OpenIMEmitter.addListener('onRecvGroupReadReceipt', (arr: any[]) => {
    try {
      (arr || []).forEach((r: any) => {
        if (r?.clientMsgID) {
          messageReadReceiptCallbacks.forEach(cb => cb({ clientMsgID: r.clientMsgID, conversationID: r.conversationID }));
        }
      });
    } catch {}
  });
  // 撤回回执
  OpenIMEmitter.addListener('onRecvMessageRevoked', (arr: any[]) => {
    try {
      (arr || []).forEach((r: any) => {
        if (r?.clientMsgID) {
          messageRevokedCallbacks.forEach(cb => cb({ clientMsgID: r.clientMsgID, conversationID: r.conversationID }));
        }
      });
    } catch {}
  });
  initialized = true;
}

// 等待同步完成（添加超时机制）
async function waitForSync(timeout = 10000): Promise<void> {
  if (synced) return;
  
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const checkSync = () => {
      if (synced) {
        console.log('✅ 同步完成，继续执行');
        resolve();
        return;
      }
      
      // 检查是否超时
      if (Date.now() - startTime > timeout) {
        console.warn('⚠️ 等待同步超时，强制继续执行');
        synced = true; // 强制设置为已同步
        resolve();
        return;
      }
      
      setTimeout(checkSync, 100);
    };
    
    checkSync();
  });
}

/**
 * React Native SDK 适配器
 * 只实现两端都支持的核心功能，确保类型安全
 */
class OpenIMAdapter implements IIMAdapter {
  // === 核心登录登出 ===

  async login(userId: string, token: string): Promise<void> {
    // 初始化 SDK
    if (!initialized) {
      const initOptions: InitOptions = {
        apiAddr: getApiUrl(),
        wsAddr: getWsUrl(),
        dataDir: DATA_DIR,
        logLevel: 5,
        isLogStandardOutput: true,
      };

      await OpenIMSDKRN.initSDK(initOptions, opid());
      initialized = true;
    }

    initEvents();

    const loginParams: LoginParams = {userID: userId, token};
    await OpenIMSDKRN.login(loginParams, opid());
  }

  async getLoginStatus(): Promise<LoginStatus> {
    const res = await OpenIMSDKRN.getLoginStatus(opid());
    console.log(res, '===========222===========');
    return res ;
  }

  async logout(): Promise<void> {
    await OpenIMSDKRN.logout(opid());
    synced = false;
    initialized = false;
  }

  /**
   * 重新初始化 SDK（用于用户切换）
   */
  async reinitializeSDK(): Promise<void> {
    console.log('🔄 开始重新初始化 OpenIM SDK...');
    
    try {
      // 1. 先登出并清理当前状态
      if (initialized) {
        console.log('📤 登出当前用户...');
        await OpenIMSDKRN.logout(opid());
      }
      
      // 2. 反初始化 SDK
      console.log('🧹 反初始化 SDK...');
      await OpenIMSDKRN.unInitSDK(opid());
      
      // 3. 重置初始化状态
      initialized = false;
      synced = false;
      
      console.log('✅ OpenIM SDK 重新初始化完成');
    } catch (error) {
      console.error('❌ OpenIM SDK 重新初始化失败:', error);
      // 即使失败也要重置状态，确保下次可以重新初始化
      initialized = false;
      synced = false;
      throw error;
    }
  }

  // === 会话管理 ===

  async getConversations(): Promise<Conversation[]> {
    console.log('===========开始获取会话列表===========');
    
    // 检查 SDK 是否已初始化
    if (!initialized) {
      console.warn('⚠️ SDK 未初始化，跳过获取会话列表');
      return [];
    }
    
    try {
      await waitForSync(5000); // 5秒超时
    } catch (error) {
      console.warn('同步等待超时，继续执行:', error);
    }
    
    console.log('===========同步完成，开始获取会话===========');
    const params: SplitConversationParams = {offset: 0, count: 20};
    const result: ConversationItem[] =
      await OpenIMSDKRN.getConversationListSplit(params, opid());
    console.log(result, '===========获取到会话数据===========');
    return (result || []).map(mapConversation);
  }

  async getOneConversation(conversationId: string): Promise<ConversationItem> {
    const params: GetOneConversationParams = {
      sourceID: conversationId,
      sessionType: 1,
    };
    return await OpenIMSDKRN.getOneConversation(params, opid());
  }

  async markConversationAsRead(conversationId: string): Promise<void> {
    await OpenIMSDKRN.markConversationMessageAsRead(conversationId, opid());
  }

  async getTotalUnreadCount(): Promise<number> {
    return await OpenIMSDKRN.getTotalUnreadMsgCount(opid());
  }

  onConversationsChange(cb: (list: Conversation[]) => void): void {
    conversationCallbacks.push(cb);
  }

  onUserStatusChange(cb: (list: UserOnlineState[]) => void): void {
    userOnlineStatusCallbacks.push(cb);
  }

  onMarkConversationAsRead(cb: (conversationId: string) => void): void {
    markConversationAsReadCallbacks.push(cb);
  }
  onMessageReadReceipt(cb: (payload: {clientMsgID: string; conversationID?: string}) => void): void {
    messageReadReceiptCallbacks.push(cb);
  }
  onMessageRevoked(cb: (payload: {clientMsgID: string; conversationID?: string}) => void): void {
    messageRevokedCallbacks.push(cb);
  }

  // === 消息管理 ===

  async sendMessage(params: {
    recvID: string;
    groupID: string;
    message: MessageItem;
  }): Promise<{ data: MessageItem }> {
    // 检查 SDK 是否已初始化
    if (!initialized) {
      console.warn('⚠️ SDK 未初始化，跳过发送消息');
      throw new Error('SDK 未初始化');
    }
    
    const sendParams: SendMsgParams = {
      recvID: params.recvID,
      groupID: params.groupID,
      message: params.message,
    };
    const result = await OpenIMSDKRN.sendMessage(sendParams, opid());
    return { data: result };
  }

  async createTextMessage(content: string): Promise<MessageItem> {
    return await OpenIMSDKRN.createTextMessage(content, opid());
  }

  async createImageMessage(imagePath: string, _width?: number, _height?: number): Promise<MessageItem> {
    try {
      console.log('🔍 RN端开始创建图片消息:', { 
        imagePath: imagePath.substring(0, 50) + '...', 
        width: _width, 
        height: _height 
      });
      
      // 检查参数
      if (!imagePath) {
        throw new Error('图片路径不能为空');
      }
      
      // 🚨 关键修复：使用Demo的方式处理文件路径
      let processedPath = imagePath;
      
      // 去掉file://前缀（如果存在）
      if (processedPath.startsWith('file://')) {
        processedPath = processedPath.substring(7);
        console.log('🔧 去掉file://前缀:', processedPath.substring(0, 50) + '...');
      }
      
      // 检查文件是否存在
      const fileExists = await safeFileExists(processedPath);
      if (!fileExists) {
        console.warn('⚠️ 处理后的文件路径不存在，尝试使用原始路径');
        processedPath = imagePath; // 回退到原始路径
      }
      
      console.log('📋 最终使用的文件路径:', processedPath.substring(0, 50) + '...');
      
      // 🚨 使用Demo的方式：createImageMessageFromFullPath
      console.log('🚀 开始调用 OpenIMSDKRN.createImageMessageFromFullPath...');
      const result = await OpenIMSDKRN.createImageMessageFromFullPath(processedPath, opid());
      
      // 🚨 保存本地图片路径到extras，用于立即显示
      if (result && result.extras) {
        const extras = result.extras as any;
        extras.localImagePath = imagePath; // 保存原始路径
        extras.localPath = processedPath; // 保存处理后的路径
        extras.width = _width;
        extras.height = _height;
        
        console.log('💾 已保存本地图片路径到extras:', {
          localImagePath: imagePath.substring(0, 50) + '...',
          localPath: processedPath.substring(0, 50) + '...',
          width: _width,
          height: _height,
        });
      }
      
      console.log('✅ RN端图片消息创建成功:', result);
      
      return result;
    } catch (error) {
      console.error('❌ RN端createImageMessage错误:', error);
      console.error('❌ 错误详情:', {
        图片路径: imagePath,
        错误类型: error instanceof Error ? error.constructor.name : 'Unknown',
        错误消息: error instanceof Error ? error.message : String(error),
        错误堆栈: error instanceof Error ? error.stack : undefined,
      });
      
      // 提供更详细的错误信息
      let errorMessage = '未知错误';
      if (error instanceof Error) {
        if (error.message.includes('no such file or directory')) {
          errorMessage = '图片文件不存在或已被删除，请重新选择图片';
        } else if (error.message.includes('permission')) {
          errorMessage = '没有文件访问权限，请检查应用权限设置';
        } else {
          errorMessage = error.message;
        }
      }
      
      throw new Error(`创建图片消息失败：${errorMessage}`);
    }
  }

  // 检查文件是否存在
  private async checkFileExists(filePath: string): Promise<boolean> {
    try {
      console.log('🔍 检查文件存在性:', filePath);
      
      // 使用 react-native-fs 检查文件是否存在
      const RNFS = require('react-native-fs');
      const fileExists = await RNFS.exists(filePath);
      
      if (fileExists) {
        try {
          const fileStats = await RNFS.stat(filePath);
          console.log('📄 文件信息:', {
            路径: filePath,
            存在: fileExists,
            大小: fileStats.size,
            类型: fileStats.isDirectory() ? '目录' : '文件',
          });
        } catch (statError) {
          console.warn('⚠️ 获取文件统计信息失败:', statError);
          // 即使stat失败，如果exists返回true，仍然认为文件存在
        }
      } else {
        console.log('📄 文件不存在:', filePath);
      }
      
      return fileExists;
    } catch (error) {
      console.warn('❌ 检查文件存在性失败:', error);
      console.warn('❌ 错误详情:', {
        路径: filePath,
        错误类型: error instanceof Error ? error.constructor.name : 'Unknown',
        错误消息: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  async createVoiceMessage(voicePath: string, duration: number): Promise<MessageItem> {
    try {
      console.log('🔍 RN端开始创建语音消息:', { 
        voicePath: voicePath.substring(0, 50) + '...', 
        duration 
      });
      
      // 检查参数
      if (!voicePath) {
        throw new Error('语音路径不能为空');
      }
      
      // 尝试使用 RN SDK 的语音消息创建方法
      // 注意：RN SDK 可能使用不同的方法名，需要根据实际 SDK 文档调整
      const params = {
        uuid: Date.now().toString(),
        soundPath: voicePath,
        sourceUrl: voicePath,
        dataSize: 0,
        duration: duration,
      };
      const result = await OpenIMSDKRN.createSoundMessageByURL(params, opid());
      
      return result;
    } catch (error) {
      console.error('RN端createVoiceMessage错误:', error);
      throw new Error(`创建语音消息失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  async createVideoMessage(videoPath: string, _duration?: number, _width?: number, _height?: number, _thumbnailPath?: string): Promise<MessageItem> {
    // RN SDK 的 createVideoMessageByURL 需要完整的 VideoMsgParams 对象
    const params = {
      videoPath: videoPath,
      videoUrl: videoPath,
      duration: _duration || 0,
      videoType: 'mp4',
      snapshotPath: _thumbnailPath || '',
      snapshotUrl: _thumbnailPath || '',
      snapshotUUID: Date.now().toString(),
      snapshotSize: 0,
      snapshotWidth: _width || 0,
      snapshotHeight: _height || 0,
      videoUUID: Date.now().toString(),
      videoSize: 0,
      videoWidth: _width || 0,
      videoHeight: _height || 0,
    };
    return await OpenIMSDKRN.createVideoMessageByURL(params, opid());
  }

  async createFileMessage(filePath: string, _fileName: string): Promise<MessageItem> {
    // RN SDK 的 createFileMessageByURL 需要完整的 FileMsgParams 对象
    const params = {
      filePath: filePath,
      fileName: _fileName,
      uuid: Date.now().toString(),
      sourceUrl: filePath,
      fileSize: 0,
    };
    return await OpenIMSDKRN.createFileMessageByURL(params, opid());
  }

  async sendMessageDirectly(params: {
    recvID: string;
    groupID: string;
    message: MessageItem;
  }): Promise<void> {
    // 检查 SDK 是否已初始化
    if (!initialized) {
      console.warn('⚠️ SDK 未初始化，跳过发送消息');
      throw new Error('SDK 未初始化');
    }
    
    const sendParams: SendMsgParams = {
      recvID: params.recvID,
      groupID: params.groupID,
      message: params.message,
    };
    await OpenIMSDKRN.sendMessage(sendParams, opid());
  }

  async getHistoryMessages(
    conversationId: string,
    count = 20,
  ): Promise<MessageItem[]> {
    console.log('===========RN端开始获取历史消息===========');
    
    // 检查 SDK 是否已初始化
    if (!initialized) {
      console.warn('⚠️ SDK 未初始化，跳过获取历史消息');
      return [];
    }
    
    try {
      await waitForSync(5000); // 5秒超时
    } catch (error) {
      console.warn('RN端历史消息同步等待超时，继续执行:', error);
    }

    try {
      const params: GetAdvancedHistoryMsgParams = {
        conversationID: conversationId,
        startClientMsgID: '',
        count,
        viewType: 0 as ViewType, // ViewType.History
      };

      const result = await OpenIMSDKRN.getAdvancedHistoryMessageList(
        params,
        opid(),
      );
      
      console.log('===========RN端获取到历史消息===========', result?.messageList?.length || 0);
      
      // 🚨 关键修复：添加与Web端相同的消息过滤逻辑
      const rawMessages = result?.messageList || [];
      const filteredMessages = rawMessages.filter((message: MessageItem) => {
        const contentType = Number(message.contentType);
        const content = String(message.content || '').trim();
        
        console.log('RN端消息过滤:', {
          contentType,
          content: content.substring(0, 50) + '...',
          contentLength: content.length,
          shouldFilter: [1501, 10011, 1519, 1509].includes(contentType) && content.length === 0
        });
        
        // 只过滤系统通知消息（contentType 1501,10011,1519,1509）且内容为空的情况
        if ([1501, 10011, 1519, 1509].includes(contentType) && content.length === 0) {
          console.log('RN端过滤掉空的通知消息:', contentType);
          return false; // 隐藏空的通知消息
        }
        
        // 其他所有消息都保留
        return true;
      });
      
      console.log('RN端消息过滤结果:', {
        原始数量: rawMessages.length,
        过滤后数量: filteredMessages.length,
        过滤掉数量: rawMessages.length - filteredMessages.length
      });
      
      return filteredMessages;
    } catch (error) {
      console.error('RN端获取历史消息失败:', error);
      return [];
    }
  }

  onMessage(cb: (msg: MessageItem) => void): void {
    messageCallbacks.push(cb);
  }

  async revokeMessage(msgId: string): Promise<void> {
    const params: OpreateMessageParams = {
      conversationID: '',
      clientMsgID: msgId,
    };
    await OpenIMSDKRN.revokeMessage(params, opid());
  }

  // === 好友管理（核心功能）===

  async addFriend(userInfo: {userID: string}, reqMsg = ''): Promise<void> {
    const params: AddFriendParams = {toUserID: userInfo.userID, reqMsg};
    await OpenIMSDKRN.addFriend(params, opid());
  }

  async getFriendApplicationList(): Promise<FriendApplicationItem[]> {
    const received: FriendApplicationItem[] =
      await OpenIMSDKRN.getFriendApplicationListAsRecipient(opid());
    const sent: FriendApplicationItem[] =
      await OpenIMSDKRN.getFriendApplicationListAsApplicant(opid());
    return [...received, ...sent];
  }

  async acceptFriendApplication(
    toUserId: string,
    handleMsg = '',
  ): Promise<void> {
    const params: AccessFriendParams = {toUserID: toUserId, handleMsg};
    await OpenIMSDKRN.acceptFriendApplication(params, opid());
  }

  async refuseFriendApplication(
    toUserId: string,
    handleMsg = '',
  ): Promise<void> {
    const params: AccessFriendParams = {toUserID: toUserId, handleMsg};
    await OpenIMSDKRN.refuseFriendApplication(params, opid());
  }

  // === 群组管理（核心功能）===

  async createGroup(params: GroupParams): Promise<Group> {
    const createParams: CreateGroupParams = {
      groupInfo: {
        groupName: params.name,
        introduction: params.description || '',
        faceURL: params.avatar || '',
      },
      memberUserIDs: params.members,
    };

    const result: GroupItem = await OpenIMSDKRN.createGroup(
      createParams,
      opid(),
    );

    return {
      id: result.groupID,
      name: params.name,
      description: params.description,
      avatar: params.avatar,
      owner: params.owner,
      admins: [],
      members: params.members,
      maxMembers: 500,
      isPublic: !!params.isPublic,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      extras: result,
    };
  }

  // 添加缺失的群组信息获取方法
  async getGroupInfo(_groupID: string): Promise<GroupItem> {
    try {
      // RN SDK 可能没有直接的 getGroupInfo 方法，暂时抛出错误
      throw new Error('RN SDK 暂不支持 getGroupInfo 方法');
    } catch (error) {
      console.error('RN端获取群组信息失败:', error);
      throw new Error(`获取群组信息失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  // === 用户信息管理 ===

  async getSelfUserInfo(): Promise<SelfUserInfo> {
    return await OpenIMSDKRN.getSelfUserInfo(opid());
  }
  async getUserInfo(userId: string): Promise<PublicUserItem> {
    const result = await OpenIMSDKRN.getUsersInfo([userId], opid());
    return result.length > 0 ? result[0] : {} as PublicUserItem;
  }
 
  async setSelfUserInfo(userInfo: SelfUserInfo): Promise<any> {
    const result = await OpenIMSDKRN.setSelfInfo(userInfo,opid());
    return result;
  }
  async getUsersInfo(userIdList: string[]): Promise<PublicUserItem[]> {
    return await OpenIMSDKRN.getUsersInfo(userIdList, opid());
  }

   // === 用户在线状态管理 ===
   async subscribeUsersStatus(userId: string): Promise<UserOnlineState[]> {
    const result: UserOnlineState[] = await OpenIMSDKRN.subscribeUsersStatus([userId], opid());
    return result;
  }
  async unsubscribeUsersStatus(userId: string): Promise<unknown> {
    return await OpenIMSDKRN.unsubscribeUsersStatus([userId], opid());
  }

  async getSubscribeUsersStatus(): Promise<UserOnlineState[]> {
    const result: UserOnlineState[] = await OpenIMSDKRN.getSubscribeUsersStatus(opid());
    return result;
  }

  async getSingleConversation(conversationId: string): Promise<Conversation> {
    console.log(conversationId, '========conversationId========');
    const result: ConversationItem = await OpenIMSDKRN.getOneConversation({
      sourceID: conversationId,
      sessionType: 1,
    }, opid());
    console.log(result, '========result========');
    return mapConversation(result);
  }
  async getSingleConversationBySessionType( conversationId: string, sessionType: number): Promise<Conversation> {
    const result: ConversationItem = await OpenIMSDKRN.getOneConversation({
      sourceID: conversationId,
      sessionType: sessionType,
    }, opid());
    return mapConversation(result);
  }
  async getGroupConversation(groupID: string): Promise<Conversation> {
    const result: ConversationItem = await OpenIMSDKRN.getOneConversation({
      sourceID: groupID,
      sessionType: 2,
    }, opid());
    return mapConversation(result);
  }
  async getGroupMemberList(groupID: string): Promise<GroupMemberItem[]> {
    const result: GroupMemberItem[] = await OpenIMSDKRN.getGroupMemberList({
      groupID: groupID,
      filter: 0,
      offset: 0,
      count: 300,
    }, opid());
    return result;
  }

  // 删除 getGroupInfo（暂不暴露）

  // === 占位实现（避免接口报错）===

  async muteUser(): Promise<void> {
    // 占位实现
  }

  // === 群资料/开关 ===
  async updateGroupName(groupID: string, name: string): Promise<void> {
    await OpenIMSDKRN.setGroupInfo({ groupID, groupName: name } as any, opid());
  }
  async updateGroupAnnouncement(groupID: string, announcement: string): Promise<void> {
    await OpenIMSDKRN.setGroupInfo({ groupID, notification: announcement } as any, opid());
  }
  async setGroupMuteAll(groupID: string, mute: boolean): Promise<void> {
    if (mute) {
      await OpenIMSDKRN.changeGroupMute({ groupID, isMute: true } as any, opid());
    } else {
      await OpenIMSDKRN.changeGroupMute({ groupID, isMute: false } as any, opid());
    }
  }
  async setConversationDoNotDisturb(conversationId: string, enable: boolean): Promise<void> {
    await OpenIMSDKRN.setConversationRecvMessageOpt({
      conversationID: conversationId,
      opt: enable ? 2 : 0,
    }, opid());
  }
}

export default OpenIMAdapter;
