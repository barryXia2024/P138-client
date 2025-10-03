import { useCallback } from 'react';
import {P138OpenIM} from '@/p138-react-common/OpenIM';
import { MessageItem } from 'open-im-sdk-rn/src/types/entity';
import { useP138OpenIMStore } from '@/p138-react-common/OpenIM/base/core/P138OpenIM';

export type SendMessageParams = {
  message: MessageItem;
  needPush?: boolean;
};

export function useSendMessage() {
  const sendMessage = useCallback(
    async ({ message, needPush = true }: SendMessageParams) => {
      const currentConversation = useP138OpenIMStore.getState().currentConversation;
      
      // 检查是否属于当前会话
      const inCurrentConversation = currentConversation && (
        // 单聊：检查 recvID 是否匹配
        (currentConversation.conversationType === 1 && 
         (currentConversation.userID === message.recvID || currentConversation.userID === message.sendID)) ||
        // 群聊：检查 groupID 是否匹配
        (currentConversation.conversationType === 3 && currentConversation.groupID === message.groupID) ||
        // 兜底：如果没有 recvID 和 groupID
        (!message.recvID && !message.groupID)
      );
      
      const shouldPush = needPush && inCurrentConversation;
      
      console.log('发送消息检查:', {
        currentConversation: currentConversation ? {
          conversationID: currentConversation.conversationID,
          conversationType: currentConversation.conversationType,
          userID: currentConversation.userID,
          groupID: currentConversation.groupID
        } : null,
        message: {
          sendID: message.sendID,
          recvID: message.recvID,
          groupID: message.groupID
        },
        inCurrentConversation,
        shouldPush
      });

      if (shouldPush) {
        // 立即推送消息到UI
        P138OpenIM.pushNewMessage(message);
        // 触发滚动到底部事件
        P138OpenIM.emit('CHAT_LIST_SCROLL_TO_BOTTOM');
      }

      try {
        // 发送消息
        const result = await P138OpenIM.sendMessage({
          recvID: message.recvID || '',
          groupID: message.groupID || '',
          message,
        });
        
        // 更新消息状态
        console.log('更新消息状态:', {
          originalMessage: message,
          resultData: result.data,
          finalMessage: result.data || message
        });
        P138OpenIM.updateOneMessage(result.data || message);
      } catch (error) {
        // 发送失败，更新消息状态
        P138OpenIM.updateOneMessage({
          ...message,
          status: 5, // Failed status (5 = failed)
        } as unknown as MessageItem);
        throw error;
      }
    },
    [],
  );

  return {
    sendMessage,
  };
}
