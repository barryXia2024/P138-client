/**
 * 通用聊天室组件
 * 整合消息列表和输入框，提供完整的聊天功能
 */

import React, {useCallback, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';


import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useMessageStore } from '@/p138-react-common/OpenIM/store';
import { imService } from '@/p138-react-common/OpenIM/imService';


interface ChatRoomProps {
  /** 会话ID */
  conversationId: string;
  /** 初始加载数量 */
  initialLoadCount?: number;
  /** 加载更多数量 */
  loadMoreCount?: number;
  /** 是否自动加载历史消息 */
  autoLoadHistory?: boolean;
  /** 是否自动处理状态 */
  autoHandleStatus?: boolean;
  /** 是否自动刷新消息列表 */
  autoRefresh?: boolean;
  /** 是否显示图片发送功能 */
  showImageOption?: boolean;
  /** 是否显示更多选项 */
  showMoreOptions?: boolean;
  /** 自定义选项 */
  customOptions?: Array<{
    icon: any;
    label: string;
    onPress: () => void;
  }>;
  /** 输入框占位符 */
  placeholder?: string;
  /** 最大输入长度 */
  maxLength?: number;
  /** 自定义消息渲染器 */
  renderMessage?: (message: any) => React.ReactElement;
  /** 是否自动滚动到底部 */
  autoScrollToBottom?: boolean;
  /** 聊天室样式 */
  style?: any;
  /** 消息列表样式 */
  messageListStyle?: any;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  conversationId,
  initialLoadCount = 200,
  loadMoreCount = 20,
  autoLoadHistory = true,
  autoHandleStatus = true,
  autoRefresh = false,
  showImageOption = true,
  showMoreOptions = false,
  customOptions = [],
  placeholder = '输入消息...',
  maxLength = 1000,
  renderMessage,
  style,
  messageListStyle,
}) => {
  const messages = useMessageStore((s) => s.messages[conversationId] || []);

  useEffect(() => {
    // 进入时可尝试拉取历史
    imService.loadHistory(conversationId, 20).catch(() => {});
  }, [conversationId]);





  // 处理发送文本
  const handleSendMessage = useCallback(
    async (content: string) => {
      try {
        await imService.sendTextMessage(conversationId, content);
      } catch (error) {
        console.error('发送文本消息失败:', error);
        Toast.show(
          `消息发送失败：${error instanceof Error ? error.message : '未知错误'}`,
        );
        throw error; // 重新抛出错误，让 ChatInput 处理
      }
    },
    [conversationId],
  );

  // 处理发送图片
  const handleSendImage = useCallback(
    async (uri: string, width?: number, height?: number) => {
      try {
        await imService.sendImageMessage(conversationId, uri, width, height);
        Toast.show('图片发送成功');
      } catch (error) {
        console.error('发送图片消息失败:', error);
        Toast.show(
          `图片发送失败：${error instanceof Error ? error.message : '未知错误'}`,
        );
        throw error; // 重新抛出错误，让 ChatInput 处理
      }
    },
    [conversationId],
  );

  const handleLoadMore = useCallback(async () => {
    const first = messages[0];
    const cursor = (first as any)?.clientMsgID || null;
    await imService.loadHistory(conversationId, 20, cursor);
  }, [messages, conversationId]);


  console.log(messages, '========messageList.messages========');

  return (
    <View style={[styles.container, style]}>
      <MessageList
        messages={messages}
        sending={false}
        onLoadMore={handleLoadMore}
        hasMoreHistory={messages.length > 20}
        renderMessage={renderMessage}
        style={messageListStyle}
      />
  
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendImage={handleSendImage}
          sending={false}
          showImageOption={showImageOption}
          showMoreOptions={showMoreOptions}
          customOptions={customOptions}
          placeholder={placeholder}
          maxLength={maxLength}
        />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default ChatRoom;
