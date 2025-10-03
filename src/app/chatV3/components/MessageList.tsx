/**
 * 通用消息列表组件 (inverted 版本)
 * 支持消息显示、加载更多、发送状态等
 */

import React, {useRef, useCallback} from 'react';
import {FlatList, View, ActivityIndicator} from 'react-native';
import {Text as RNText} from 'react-native';
import type {WrappedMessage} from '@/p138-react-common/OpenIM/base/types/core';
import MessageItem from '../room/MessageItem';


interface MessageListProps {
  /** 消息列表 */
  messages: WrappedMessage[];
  /** 是否正在发送 */
  sending?: boolean;
  /** 加载更多回调 */
  onLoadMore?: () => void;
  /** 是否还有更多历史消息 */
  hasMoreHistory?: boolean;
  /** 自定义消息渲染器 */
  renderMessage?: (message: WrappedMessage) => React.ReactElement;
  /** 列表样式 */
  style?: any;
  /** 内容容器样式 */
  contentContainerStyle?: any;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  sending = false,
  onLoadMore,
  hasMoreHistory = false,
  renderMessage,
  style,
  contentContainerStyle,
}) => {
  const flatListRef = useRef<FlatList>(null);

  // 渲染消息项
  const renderMessageItem = useCallback(
    ({item}: {item: WrappedMessage}) => {
      
      if (renderMessage) {
        return renderMessage(item);
      }
      return <MessageItem message={item} />;
    },
    [renderMessage],
  );

  // 渲染加载更多指示器（inverted 后要放在 Footer）
  const renderLoadMore = useCallback(() => {
    if (!hasMoreHistory) return null;

    return (
      <View className="flex-row items-center justify-center py-2.5">
        <ActivityIndicator size="small" color="#2D9DFE" />
        <RNText className="ml-2 text-xs text-gray-600">加载更多消息...</RNText>
      </View>
    );
  }, [hasMoreHistory]);

  // 渲染发送中指示器（inverted 后要放在 Header）
  const renderSending = useCallback(() => {
    if (!sending) return null;

    return (
      <View className="flex-row items-center justify-center py-2.5">
        <ActivityIndicator size="small" color="#2D9DFE" />
        <RNText className="ml-2 text-xs text-gray-600">发送中...</RNText>
      </View>
    );
  }, [sending]);

  // 处理加载更多
  const handleLoadMore = useCallback(() => {
    if (onLoadMore && hasMoreHistory) {
      onLoadMore();
    }
  }, [onLoadMore, hasMoreHistory]);

  return (
    <View className="flex-1 bg-[#F5F5F5]" style={style}>
      <FlatList
        ref={flatListRef}
        data={[...messages].reverse()}
        inverted
        keyExtractor={item => item.id}
        renderItem={renderMessageItem}
        ListFooterComponent={renderLoadMore}   // 历史消息加载更多
        ListHeaderComponent={renderSending}   // 发送中提示
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        contentContainerStyle={[
          { flexGrow: 1, justifyContent: messages.length === 0 ? 'center' : 'flex-start', paddingVertical: 8 },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
      
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
      />
    </View>
  );
};

export default MessageList;
