/**
 * 会话列表组件
 */

import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import type {Conversation} from '@/p138-react-common/OpenIM';
import type {ConversationDisplayInfo} from '@/p138-react-common/OpenIM/base/types/hooks';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  onConversationPress: (conversation: Conversation) => void;
  onRefresh: () => void;
  getDisplayInfo: (conversation: Conversation) => ConversationDisplayInfo;
  renderEmpty: () => React.ReactElement;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  loading,
  onConversationPress,
  onRefresh,
  getDisplayInfo,
  renderEmpty,
}) => {
  // 渲染会话项
  const renderConversation = ({item}: {item: Conversation}) => {
    const displayInfo = getDisplayInfo(item);

    return (
      <ConversationItem
        conversation={item}
        displayInfo={displayInfo}
        onPress={() => onConversationPress(item)}
      />
    );
  };

  return (
    <FlatList
      data={conversations}
      keyExtractor={item => item.id}
      renderItem={renderConversation}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          colors={['#2D9DFE']}
          tintColor="#2D9DFE"
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ConversationList;
