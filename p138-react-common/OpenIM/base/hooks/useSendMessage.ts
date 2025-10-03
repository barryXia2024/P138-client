/**
 * 消息发送业务逻辑 Hook
 *
 * 职责：
 * 1. 处理各种类型消息的发送
 * 2. 管理发送状态和错误处理
 * 3. 处理消息状态更新
 *
 * 设计原则：
 * - 与UI完全解耦
 * - 支持多种消息类型
 * - 统一的错误处理
 * - 类型安全
 */

import {useState, useCallback} from 'react';
import {MessageItem} from 'open-im-sdk-rn/src/types/entity';
import {P138OpenIM} from '../../index';
import type {
  UseSendMessageOptions,
  SendMessageState,
  SendMessageActions,
} from '../types';
import {SessionType as SDKSessionType} from 'open-im-sdk-rn/src/types/enum';

/**
 * 消息发送业务逻辑 Hook
 *
 * @param options 配置选项
 * @returns 发送状态和操作方法
 */
export function useSendMessage(
  options: UseSendMessageOptions,
): SendMessageState & SendMessageActions {
  const {conversationId} = options;

  // ===========================
  // 状态管理
  // ===========================

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSentMessageId, setLastSentMessageId] = useState<string | null>(
    null,
  );

  // ===========================
  // 通用发送逻辑
  // ===========================

  /**
   * 通用消息发送方法
   * @param sendFn 发送函数
   * @param messageType 消息类型（用于错误提示）
   */
  const sendMessage = useCallback(
    async <T>(sendFn: () => Promise<T>, messageType: string): Promise<T> => {
      if (!conversationId) {
        throw new Error('会话ID不能为空');
      }

      try {
        setSending(true);
        setError(null);

        const result = await sendFn();

        // 记录最后发送的消息ID
        if (result && typeof result === 'object' && 'clientMsgID' in result) {
          setLastSentMessageId((result as any).clientMsgID);
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : `发送${messageType}消息失败`;
        setError(errorMessage);
        throw err;
      } finally {
        setSending(false);
      }
    },
    [conversationId],
  );

  // ===========================
  // 各种消息类型发送方法
  // ===========================

  /**
   * 发送文本消息
   * @param content 消息内容
   */
  const sendTextMessage = useCallback(
    async (content: string): Promise<MessageItem> => {
      if (!content.trim()) {
        throw new Error('消息内容不能为空');
      }

      return sendMessage(async () => {
        // 1. 创建文本消息
        const messageItem = await P138OpenIM.createTextMessage(content.trim());

        // 2. 设置发送者和接收者信息
        const {selfInfo} = P138OpenIM.getState();
        const currentConversation = P138OpenIM.getCurrentConversation();

        if (!currentConversation) {
          throw new Error('当前会话不存在');
        }


        // 3. 根据会话类型设置 recvID 和 groupID
        let recvID = '';
        let groupID = '';

        if (currentConversation.conversationType === SDKSessionType.Single) {
          // 单聊
          recvID = currentConversation.userID || '';
        } else if (
          currentConversation.conversationType === SDKSessionType.Group
        ) {
          // 群聊
          groupID = currentConversation.groupID || '';
        }


        // 4. 构建完整的消息对象
        const messageToSend: MessageItem = {
          ...messageItem,
          sendID: selfInfo?.userID || '',
          recvID,
          groupID,
          status: 1, // sending
        };

        // 5. 先推送"发送中"的消息到UI
        P138OpenIM.pushNewMessage(messageToSend);

        // 6. 发送消息
        const result = await P138OpenIM.sendMessage({
          recvID,
          groupID,
          message: messageToSend,
        });

        // 7. 发送成功后，更新消息状态
        // 修复：正确提取消息数据
        let finalMessage = messageToSend;
        if (result && typeof result === 'object') {
          if (result.data && typeof result.data === 'object') {
            // 如果result.data是MessageItem
            finalMessage = result.data;
          } else if (result.event === 'SendMessage' && result.data) {
            // 如果result是事件格式
            finalMessage = result.data;
          }
        }

        // 确保finalMessage有clientMsgID
        if (!finalMessage.clientMsgID && messageToSend.clientMsgID) {
          finalMessage.clientMsgID = messageToSend.clientMsgID;
        }

        P138OpenIM.updateOneMessage(finalMessage);

        return finalMessage;
      }, '文本');
    },
    [sendMessage],
  );

  /**
   * 发送图片消息
   * @param imagePath 图片路径
   * @param width 图片宽度
   * @param height 图片高度
   */
  const sendImageMessage = useCallback(
    async (
      imagePath: string,
      width?: number,
      height?: number,
    ): Promise<MessageItem> => {
      if (!imagePath) throw new Error('图片路径不能为空');


      return sendMessage(async () => {
        // 1. 创建图片消息（OpenIM SDK会自动处理图片上传）
        const messageItem = await P138OpenIM.createImageMessage(
          imagePath,
          width,
          height,
        );

        // 2. 设置发送者和接收者信息
        const {selfInfo} = P138OpenIM.getState();
        const currentConversation = P138OpenIM.getCurrentConversation();
        if (!currentConversation) throw new Error('当前会话不存在');

        let recvID = '';
        let groupID = '';
        if (currentConversation.conversationType === SDKSessionType.Single) {
          recvID = currentConversation.userID || '';
        } else if (
          currentConversation.conversationType === SDKSessionType.Group
        ) {
          groupID = currentConversation.groupID || '';
        }

        const messageToSend: MessageItem = {
          ...messageItem,
          sendID: selfInfo?.userID || '',
          recvID,
          groupID,
          status: 1,
        };

        // 3. 推送到 UI
        P138OpenIM.pushNewMessage(messageToSend);

        // 4. 发送消息
        const result = await P138OpenIM.sendMessage({
          recvID,
          groupID,
          message: messageToSend,
        });

        // 5. 更新状态
        // 修复：正确提取消息数据
        let finalMessage = messageToSend;
        if (result && typeof result === 'object') {
          if (result.data && typeof result.data === 'object') {
            // 如果result.data是MessageItem
            finalMessage = result.data;
          } else if (result.event === 'SendMessage' && result.data) {
            // 如果result是事件格式
            finalMessage = result.data;
          }
        }

        // 确保finalMessage有clientMsgID
        if (!finalMessage.clientMsgID && messageToSend.clientMsgID) {
          finalMessage.clientMsgID = messageToSend.clientMsgID;
        }

        P138OpenIM.updateOneMessage(finalMessage);
        return finalMessage;
      }, '图片');
    },
    [sendMessage],
  );

  /**
   * 发送语音消息
   * @param voicePath 语音文件路径
   * @param duration 语音时长（秒）
   */
  const sendVoiceMessage = useCallback(
    async (_voicePath: string, _duration: number): Promise<MessageItem> => {
      return sendMessage(async () => {
        // TODO: 实现语音消息创建和发送逻辑
        throw new Error('语音消息功能暂未实现');
      }, '语音');
    },
    [sendMessage],
  );

  /**
   * 发送视频消息
   * @param videoPath 视频文件路径
   * @param duration 视频时长（秒）
   * @param width 视频宽度
   * @param height 视频高度
   * @param thumbnailPath 缩略图路径
   */
  const sendVideoMessage = useCallback(
    async (
      _videoPath: string,
      _duration?: number,
      _width?: number,
      _height?: number,
      _thumbnailPath?: string,
    ): Promise<MessageItem> => {
      return sendMessage(async () => {
        // TODO: 实现视频消息创建和发送逻辑
        throw new Error('视频消息功能暂未实现');
      }, '视频');
    },
    [sendMessage],
  );

  /**
   * 发送文件消息
   * @param filePath 文件路径
   * @param fileName 文件名
   */
  const sendFileMessage = useCallback(
    async (_filePath: string, _fileName: string): Promise<MessageItem> => {
      return sendMessage(async () => {
        // TODO: 实现文件消息创建和发送逻辑
        throw new Error('文件消息功能暂未实现');
      }, '文件');
    },
    [sendMessage],
  );

  /**
   * 清除错误
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ===========================
  // 返回状态和方法
  // ===========================

  return {
    // 状态
    sending,
    error,
    lastSentMessageId,

    // 方法
    sendTextMessage,
    sendImageMessage,
    sendVoiceMessage,
    sendVideoMessage,
    sendFileMessage,
    clearError,
  };
}
