import {getSDK, CbEvents, LoginStatus} from '@openim/client-sdk';
import {MessageItem, UserOnlineState} from 'open-im-sdk-rn/src/types/entity';
import {
  ConversationType,
  MessageStatus,
  MessageType,
  type Conversation,
  type Group,
  type GroupParams,
  type IIMAdapter,
} from '../types';


// 导入准确的 Web SDK 类型（只导入使用的）
import type {
  LoginParams,
  OffsetParams,
  GetOneConversationParams,
  SendMsgParams,
  CreateGroupParams,
  AddFriendParams,
  AccessFriendParams,
  GetAdvancedHistoryMsgParams,
  OpreateMessageParams,
} from '@openim/client-sdk/lib/types/params';

import type {
  ConversationItem,
  GroupItem,
  SelfUserInfo,
  ApiResponse,
  FriendApplicationItem,
  GroupMemberItem,
} from '@openim/client-sdk/lib/types/entity';

import {PublicUserItem} from '@openim/client-sdk';
import { useP138OpenIMStore } from '../core/P138OpenIM';
import { env } from 'src/config/env';

const client = getSDK();

let synced = false;
let initialized = false;
const messageCallbacks: ((msg: MessageItem) => void)[] = [];
const conversationCallbacks: ((list: Conversation[]) => void)[] = [];
const messageReadReceiptCallbacks: ((payload: {clientMsgID: string; conversationID?: string}) => void)[] = [];
const messageRevokedCallbacks: ((payload: {clientMsgID: string; conversationID?: string}) => void)[] = [];
const userOnlineStatusCallbacks: ((list: UserOnlineState[]) => void)[] = [];

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
    id:
      c.conversationID ||
      `${isGroup ? 'group_' : 'single_'}${c.userID || c.groupID}`,
    type: isGroup ? ConversationType.Group : ConversationType.Single,
    participants: isGroup ? [c.groupID] : [c.userID],
    lastMessage: latestMsg
      ? {
          id: String(
            latestMsg.clientMsgID || latestMsg.serverMsgID || Date.now(),
          ),
          type:
            latestMsg.contentType === 101
              ? MessageType.Text
              : MessageType.System,
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

  // Web 端同步事件监听
  client.on(CbEvents.OnSyncServerStart, () => {
    console.log('🔄 Web端同步开始');
    synced = false;
  });

  client.on(CbEvents.OnSyncServerFinish, () => {
    console.log('✅ Web端同步完成');
    synced = true;
  });
  
  // 添加其他可能的同步事件监听
  client.on('onSyncServerProgress' as any, (data: any) => {
    console.log('📊 Web端同步进度:', data);
  });
  
  // 如果同步事件没有触发，设置一个默认的同步完成状态
  setTimeout(() => {
    if (!synced) {
      console.log('🌐 Web端同步事件未触发，设置为已同步状态');
      synced = true;
    }
  }, 2000); // 2秒后如果还没有同步完成，强制设置为已同步

  // 新消息监听
  client.on(CbEvents.OnRecvNewMessages, ({data}: {data: MessageItem[]}) => {
    // 🚨 关键修复：添加与RN端相同的消息过滤逻辑
    const filteredMessages = (data || []).filter((msg: MessageItem) => {
      const contentType = Number(msg.contentType);
      const content = String(msg.content || '').trim();
      
      // 只过滤系统通知消息（contentType 1501,10011,1519,1509）且内容为空的情况
      if ([1501, 10011, 1519, 1509].includes(contentType) && content.length === 0) {
        console.log('Web端过滤掉新收到的空通知消息:', contentType);
        return false; // 隐藏空的通知消息
      }
      
      // 其他所有消息都保留
      return true;
    });
    
    console.log('Web端新消息过滤结果:', {
      原始数量: data?.length || 0,
      过滤后数量: filteredMessages.length,
      过滤掉数量: (data?.length || 0) - filteredMessages.length
    });
    
    // 只处理过滤后的消息
    filteredMessages.forEach((msg: MessageItem) => {
      // 直接传递 MessageItem，不进行映射
      messageCallbacks.forEach(cb => cb(msg));
    });

    client.getTotalUnreadMsgCount().then((res: ApiResponse<number>) => {
      useP138OpenIMStore.setState(state => ({
        ...state,
        unreadCount: res.data || 0,
      }));
    });
  });

  // 已读回执（Web）
  client.on('onRecvC2CReadReceipt' as any, ({ data }: { data: any[] }) => {
    try {
      (data || []).forEach((r: any) => {
        if (r?.clientMsgID) {
          messageReadReceiptCallbacks.forEach(cb => cb({ clientMsgID: r.clientMsgID, conversationID: r.conversationID }));
        }
      });
    } catch {}
  });
  client.on('onRecvGroupReadReceipt' as any, ({ data }: { data: any[] }) => {
    try {
      (data || []).forEach((r: any) => {
        if (r?.clientMsgID) {
          messageReadReceiptCallbacks.forEach(cb => cb({ clientMsgID: r.clientMsgID, conversationID: r.conversationID }));
        }
      });
    } catch {}
  });
  // 撤回回执
  client.on('onRecvMessageRevoked' as any, ({ data }: { data: any[] }) => {
    try {
      (data || []).forEach((r: any) => {
        if (r?.clientMsgID) {
          messageRevokedCallbacks.forEach(cb => cb({ clientMsgID: r.clientMsgID, conversationID: r.conversationID }));
        }
      });
    } catch {}
  });

  // 会话变更监听
  client.on(
    CbEvents.OnConversationChanged,
    ({data}: {data: ConversationItem[]}) => {
      const mappedConversations = (data || []).map(mapConversation);
      conversationCallbacks.forEach(cb => cb(mappedConversations));
    },
  );
  client.on(CbEvents.OnUserStatusChanged, ({data}: {data: UserOnlineState[]}) => {
    userOnlineStatusCallbacks.forEach(cb => cb(data));
  });

  initialized = true;
}

// 等待同步完成（添加超时机制）
async function waitForSync(timeout = 10000): Promise<void> {
  if (synced) return;
  
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkSync = () => {
      if (synced) {
        console.log('✅ Web端同步完成，继续执行');
        resolve();
        return;
      }
      
      // 检查是否超时
      if (Date.now() - startTime > timeout) {
        console.warn('⚠️ Web端等待同步超时，强制继续执行');
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
 * Web SDK 适配器
 * 封装 @openim/client-sdk 的核心功能，类型安全
 */
class OpenIMAdapter implements IIMAdapter {
  // === 核心登录登出 ===

  async login(userId: string, token: string): Promise<void> {
    initEvents();

    // 登录参数

    const loginParams: LoginParams = {
      userID: userId,
      token,
      wsAddr:env.OpenIM_WS_URL,
      apiAddr: env.OpenIM_API_URL,
      platformID: 5,
      logLevel:1
    };

    // 执行登录

    await client.login(loginParams);
  }

  async getLoginStatus(): Promise<LoginStatus> {
    const res = await client.getLoginStatus();
    // 登录状态
    return res.data;
  }

  async logout(): Promise<void> {
    await client.logout();
    synced = false;
    initialized = false;
  }

  // === 会话管理 ===

  async getConversations(): Promise<Conversation[]> {
    console.log('===========Web端开始获取会话列表===========');
    
    // 检查是否已初始化
    if (!initialized) {
      console.warn('⚠️ Web端 SDK 未初始化，跳过获取会话列表');
      return [];
    }
    
    try {
      await waitForSync(5000); // 5秒超时
    } catch (error) {
      console.warn('Web端同步等待超时，继续执行:', error);
    }

    const params: OffsetParams = {offset: 0, count: 20};
    const result: ApiResponse<ConversationItem[]> =
      await client.getConversationListSplit(params);
    console.log(result, '===========Web端获取到会话数据===========');
    return (result.data || []).map(mapConversation);
  }

  async getOneConversation(
    conversationId: string,
  
  ): Promise<ConversationItem> {
    const params: GetOneConversationParams = {
      sourceID: conversationId,
      sessionType: 1,
    };
    const result = await client.getOneConversation(params);
    return result.data;
  }

  async markConversationAsRead(conversationId: string): Promise<void> {
    await client.markConversationMessageAsRead(conversationId);
  }

  async getTotalUnreadCount(): Promise<number> {
    const result: ApiResponse<number> = await client.getTotalUnreadMsgCount();
    return result.data || 0;
  }

  onConversationsChange(cb: (list: Conversation[]) => void): void {
    conversationCallbacks.push(cb);
  }

  // 添加缺失的回调注册方法
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
  }): Promise<{data: MessageItem}> {
    const sendParams: SendMsgParams = {
      recvID: params.recvID,
      groupID: params.groupID,
      message: params.message,
    };
    const result = await client.sendMessage(sendParams);
    // Web SDK 的 sendMessage 直接返回 MessageItem，不需要提取 data
    return {data: result as unknown as MessageItem};
  }

  async createTextMessage(content: string): Promise<MessageItem> {
    const response = await client.createTextMessage(content);
    // Web SDK 返回的是 { data: MessageItem } 格式
    return response.data as unknown as MessageItem;
  }

  async createVoiceMessage(voicePath: string, duration: number): Promise<MessageItem> {
    try {
      console.log('🔍 开始创建语音消息:', { voicePath: voicePath.substring(0, 50) + '...', duration });
      
      // 检查参数
      if (!voicePath) {
        throw new Error('语音路径不能为空');
      }
      
      // 尝试使用 Web SDK 的语音消息创建方法
      // 注意：Web SDK 可能没有直接的 createVoiceMessage，需要根据实际 SDK 文档调整
      const response = await client.createSoundMessageByURL({
        soundPath: voicePath,
        duration: duration,
      });
      
      return response.data as unknown as MessageItem;
    } catch (error) {
      console.error('createVoiceMessage错误:', error);
      throw new Error(`创建语音消息失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  async createVideoMessage(videoPath: string, duration?: number, width?: number, height?: number, thumbnailPath?: string): Promise<MessageItem> {
    try {
      console.log('🔍 开始创建视频消息:', { 
        videoPath: videoPath.substring(0, 50) + '...', 
        duration, 
        width, 
        height,
        thumbnailPath: thumbnailPath?.substring(0, 50) + '...'
      });
      
      // 检查参数
      if (!videoPath) {
        throw new Error('视频路径不能为空');
      }
      
      // 尝试使用 Web SDK 的视频消息创建方法
      const response = await client.createVideoMessageByURL({
        videoPath: videoPath,
        duration: duration || 0,
        width: width || 0,
        height: height || 0,
        thumbnailPath: thumbnailPath || '',
      });
      
      return response.data as unknown as MessageItem;
    } catch (error) {
      console.error('createVideoMessage错误:', error);
      throw new Error(`创建视频消息失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  async createFileMessage(filePath: string, fileName: string): Promise<MessageItem> {
    try {
      console.log('🔍 开始创建文件消息:', { 
        filePath: filePath.substring(0, 50) + '...', 
        fileName 
      });
      
      // 检查参数
      if (!filePath || !fileName) {
        throw new Error('文件路径和文件名不能为空');
      }
      
      // 尝试使用 Web SDK 的文件消息创建方法
      const response = await client.createFileMessageByURL({
        filePath: filePath,
        fileName: fileName,
      });
      
      return response.data as unknown as MessageItem;
    } catch (error) {
      console.error('createFileMessage错误:', error);
      throw new Error(`创建文件消息失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  // 获取图片真实尺寸的辅助函数（参考Demo实现）
  private async getPicInfo(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const _URL = window.URL || window.webkitURL;
      const img = new Image();
      img.onload = function () {
        resolve(img);
      };
      img.onerror = function () {
        reject(new Error('Failed to load image'));
      };
      img.src = _URL.createObjectURL(file);
    });
  }

  async createImageMessage(imagePath: string, width?: number, height?: number): Promise<MessageItem> {
    try {
      console.log('🔍 开始创建图片消息:', { imagePath: imagePath.substring(0, 50) + '...', width, height });
      
      // 检查参数
      if (!imagePath) {
        throw new Error('图片路径不能为空');
      }
      
      // 尝试使用createImageMessageByFile方法
      // 首先需要将URL转换为File对象
      let response;
      
      try {
        // 方法1: 尝试使用createImageMessageByFile
        const fetchResponse = await fetch(imagePath);
        const blob = await fetchResponse.blob();
        
        // 生成唯一的UUID（包含文件名，与Demo保持一致）
        const uniqueId = Date.now();
        const fileName = `image_${uniqueId}.${blob.type.split('/')[1] || 'jpg'}`;
        const uuidWithFileName = `${uniqueId}/${fileName}`;
        
        console.log('📁 生成唯一UUID（包含文件名）:', uuidWithFileName);
        
        // 创建blob URL用于本地预览
        const blobUrl = URL.createObjectURL(blob);
        
        // 创建File对象（使用生成的文件名）
        const file = new File([blob], fileName, { type: blob.type });
        
        // 获取真实的图片尺寸（参考Demo实现）
        const img = await this.getPicInfo(file);
        const { width, height } = { width: img.naturalWidth, height: img.naturalHeight };
        const baseInfo = {
          uuid: uuidWithFileName, // 使用包含文件名的UUID
          type: blob.type,
          size: blob.size,
          width,
          height,
          url: blobUrl, // 使用blob URL作为本地预览
        };
        
        // 深拷贝baseInfo，避免SDK修改原始数据
        const sourcePicture = JSON.parse(JSON.stringify(baseInfo));
        const bigPicture = JSON.parse(JSON.stringify(baseInfo));
        const snapshotPicture = JSON.parse(JSON.stringify(baseInfo));
        
        const options = {
          sourcePicture,
          bigPicture,
          snapshotPicture,
          sourcePath: "",
          file, // 使用原始File对象
        };
        
        response = await client.createImageMessageByFile(options);
      } catch (fileError) {
        
        // 方法2: 回退到createImageMessageByURL
        // 重新获取blob
        const fetchResponse = await fetch(imagePath);
        const blob = await fetchResponse.blob();
        
        // 生成唯一的UUID（包含文件名，与Demo保持一致）
        const uniqueId = Date.now();
        const fileName = `image_${Date.now()}.${blob.type.split('/')[1] || 'jpg'}`;
        const uuidWithFileName = `${uniqueId}/${fileName}`;
        
        
        // 创建blob URL用于本地预览
        const blobUrl = URL.createObjectURL(blob);
        
        // 创建File对象用于获取尺寸
        const file = new File([blob], fileName, { type: blob.type });
        
        // 获取真实的图片尺寸（参考Demo实现）
        const img = await this.getPicInfo(file);
        const { width, height } = { width: img.naturalWidth, height: img.naturalHeight };
        
        const baseInfo = {
          uuid: uuidWithFileName, // 使用包含文件名的UUID
          type: blob.type,
          size: blob.size,
          width,
          height,
          url: blobUrl, // 使用blob URL作为本地预览
        };
        
        // 深拷贝baseInfo，避免SDK修改原始数据
        const sourcePicture = JSON.parse(JSON.stringify(baseInfo));
        const bigPicture = JSON.parse(JSON.stringify(baseInfo));
        const snapshotPicture = JSON.parse(JSON.stringify(baseInfo));
        
        const imageParams = {
          sourcePicture,
          bigPicture,
          snapshotPicture,
          sourcePath: "",
        };
        
        response = await client.createImageMessageByURL(imageParams);
      }
      
      // Web SDK 返回的是 { data: MessageItem } 格式
      const messageItem = response.data as unknown as MessageItem;
      
      if (!messageItem) {
        throw new Error('创建图片消息失败：返回数据为空');
      }
      
      
      return messageItem;
    } catch (error) {
      console.error('createImageMessage错误:', error);
      throw new Error(`创建图片消息失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  async sendMessageDirectly(params: {
    recvID: string;
    groupID: string;
    message: MessageItem;
  }): Promise<void> {
    const sendParams: SendMsgParams = {
      recvID: params.recvID,
      groupID: params.groupID,
      message: params.message,
    };
    await client.sendMessage(sendParams);
  }

  async getHistoryMessages(
    conversationId: string,
    count = 20,
  ): Promise<MessageItem[]> {
    console.log('===========Web端开始获取历史消息===========');
    
    // 检查是否已初始化
    if (!initialized) {
      console.warn('⚠️ Web端 SDK 未初始化，跳过获取历史消息');
      return [];
    }
    
    try {
      await waitForSync(5000); // 5秒超时
    } catch (error) {
      console.warn('Web端历史消息同步等待超时，继续执行:', error);
    }

    try {
      const params: GetAdvancedHistoryMsgParams = {
        conversationID: conversationId,
        startClientMsgID: '',
        count,
      };

      const result: ApiResponse<{messageList: MessageItem[]}> =
        await client.getAdvancedHistoryMessageList(params);
      console.log('===========Web端获取到历史消息===========', result.data?.messageList?.length || 0);
      
      // 🚨 关键修复：添加与RN端相同的消息过滤逻辑
      const rawMessages = result.data?.messageList || [];
      const filteredMessages = rawMessages.filter((message: MessageItem) => {
        const contentType = Number(message.contentType);
        const content = String(message.content || '').trim();
        
        console.log('Web端消息过滤:', {
          contentType,
          content: content.substring(0, 50) + '...',
          contentLength: content.length,
          shouldFilter: [1501, 10011, 1519, 1509].includes(contentType) && content.length === 0
        });
        
        // 只过滤系统通知消息（contentType 1501,10011,1519,1509）且内容为空的情况
        if ([1501, 10011, 1519, 1509].includes(contentType) && content.length === 0) {
          console.log('Web端过滤掉空的通知消息:', contentType);
          return false; // 隐藏空的通知消息
        }
        
        // 其他所有消息都保留
        return true;
      });
      
      console.log('Web端消息过滤结果:', {
        原始数量: rawMessages.length,
        过滤后数量: filteredMessages.length,
        过滤掉数量: rawMessages.length - filteredMessages.length
      });
      
      return filteredMessages;
    } catch (error) {
      console.error('Web端获取历史消息失败:', error);
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
    await client.revokeMessage(params);
  }

  // === 好友管理（核心功能）===

  async addFriend(userInfo: {userID: string}, reqMsg = ''): Promise<void> {
    const params: AddFriendParams = {toUserID: userInfo.userID, reqMsg};
    await client.addFriend(params);
  }

  async getFriendApplicationList(): Promise<FriendApplicationItem[]> {
    const offsetParams: OffsetParams = {offset: 0, count: 1000};
    const received: ApiResponse<FriendApplicationItem[]> =
      await client.getFriendApplicationListAsRecipient(offsetParams);
    const sent: ApiResponse<FriendApplicationItem[]> =
      await client.getFriendApplicationListAsApplicant(offsetParams);
    return [...(received.data || []), ...(sent.data || [])];
  }

  async acceptFriendApplication(
    toUserId: string,
    handleMsg = '',
  ): Promise<void> {
    const params: AccessFriendParams = {toUserID: toUserId, handleMsg};
    await client.acceptFriendApplication(params);
  }

  async refuseFriendApplication(
    toUserId: string,
    handleMsg = '',
  ): Promise<void> {
    const params: AccessFriendParams = {toUserID: toUserId, handleMsg};
    await client.refuseFriendApplication(params);
  }

  // === 用户在线状态管理 ===
  async subscribeUsersStatus(userId: string): Promise<UserOnlineState[]> {
    const result: ApiResponse<UserOnlineState[]> = await client.subscribeUsersStatus([userId]);
    return result.data;
  }
  async unsubscribeUsersStatus(userId: string): Promise<unknown> {
    return await client.unsubscribeUsersStatus([userId]);
  }

  async getSubscribeUsersStatus(): Promise<UserOnlineState[]> {
    const result: ApiResponse<UserOnlineState[]> = await client.getSubscribeUsersStatus();
    return result.data;
  }

  onUserStatusChange(cb: (list: UserOnlineState[]) => void): void {
    userOnlineStatusCallbacks.push(cb);
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

    const result: ApiResponse<GroupItem> =
      await client.createGroup(createParams);

    return {
      id: result.data.groupID,
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
      extras: result.data,
    };
  }

  // 添加缺失的群组信息获取方法
  async getGroupInfo(groupID: string): Promise<GroupItem> {
    try {
      const result: ApiResponse<GroupItem> = await client.getGroupsInfo([groupID]);
      return result.data[0];
    } catch (error) {
      console.error('获取群组信息失败:', error);
      throw new Error(`获取群组信息失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  // === 用户信息管理 ===

  async getSelfUserInfo(): Promise<SelfUserInfo> {
    const result: ApiResponse<SelfUserInfo> = await client.getSelfUserInfo();
    return result.data;
  }
  async getUserInfo(userId: string): Promise<PublicUserItem> {
    const result: ApiResponse<PublicUserItem[]> = await client.getUsersInfo([
      userId,
    ]);
    return result.data.length > 0 ? result.data[0] : ({} as PublicUserItem);
  }
  async setSelfUserInfo(userInfo: SelfUserInfo): Promise<void> {
    await client.setSelfInfo(userInfo);
  }

  async getUsersInfo(userIdList: string[]): Promise<PublicUserItem[]> {
    const result: ApiResponse<PublicUserItem[]> =
      await client.getUsersInfo(userIdList);
    return result.data || [];
  }
 

  async getSingleConversation(conversationId: string): Promise<Conversation> {
    // 获取单个会话
    const result: ApiResponse<ConversationItem> =
      await client.getOneConversation({
        sourceID: conversationId,
        sessionType: 1,
      });
    return mapConversation(result.data);
  }
  async getSingleConversationBySessionType(
    conversationId: string,
    sessionType: number,
  ): Promise<Conversation> {
    const result: ApiResponse<ConversationItem> =
      await client.getOneConversation({
        sourceID: conversationId,
        sessionType: sessionType,
      });
    return mapConversation(result.data);
  }
  // === 占位实现（避免接口报错）===
  async getGroupMemberList(groupID: string): Promise<GroupMemberItem[]> {
    const result: ApiResponse<GroupMemberItem[]> =
      await client.getGroupMemberList({
        groupID: groupID,
        filter: 0,
        offset: 0,
        count: 300,
      });
    return result.data;
  }
  // 删除 getGroupInfo（暂不暴露）

  // === 群资料/开关 ===
  async updateGroupName(groupID: string, name: string): Promise<void> {
    await client.setGroupInfo({ groupID, groupName: name } as any);
  }
  async updateGroupAnnouncement(groupID: string, announcement: string): Promise<void> {
    await client.setGroupInfo({ groupID, notification: announcement } as any);
  }
  async setGroupMuteAll(groupID: string, mute: boolean): Promise<void> {
    await client.changeGroupMute({ groupID, isMute: mute } as any);
  }
  async setConversationDoNotDisturb(conversationId: string, enable: boolean): Promise<void> {
    const payload = {
      conversationIDList: [conversationId],
      opt: enable ? 2 : 0,
    };

    // SDK 版本兼容：存在 setConversationRecvMessageOpt 或 setConversationRecvMsgOpt
    type RecvOptAPI = {
      setConversationRecvMessageOpt?: (p: typeof payload) => Promise<unknown>;
      setConversationRecvMsgOpt?: (p: typeof payload) => Promise<unknown>;
    };
    const compat = client as unknown as RecvOptAPI;

    if (compat.setConversationRecvMessageOpt) {
      await compat.setConversationRecvMessageOpt(payload);
      return;
    }
    if (compat.setConversationRecvMsgOpt) {
      await compat.setConversationRecvMsgOpt(payload);
      return;
    }
    throw new Error('当前 Web SDK 未提供会话免打扰设置方法');
  }
  async muteUser(): Promise<void> {
    // 占位实现
  }
  async getGroupConversation(groupID: string): Promise<Conversation> {
    const result: ApiResponse<ConversationItem> =
      await client.getOneConversation({
        sourceID: groupID,
        sessionType: 2,
      });
    return mapConversation(result.data);
  }
}

export default OpenIMAdapter;
