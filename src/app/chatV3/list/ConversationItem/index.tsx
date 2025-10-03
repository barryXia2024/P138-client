/**
 * 会话项主组件
 * 根据会话类型渲染单聊或群聊组件
 */

import React from 'react';
import {type Conversation} from '@/p138-react-common/OpenIM';
import type {ConversationDisplayInfo} from '@/p138-react-common/OpenIM/base/types/hooks';
import SingleChatItem from './SingleChatItem';
import GroupChatItem from './GroupChatItem';

interface ConversationItemProps {
  conversation: Conversation;
  displayInfo: ConversationDisplayInfo;
  onPress: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  displayInfo,
  onPress,
}) => {
  // 根据会话ID判断是单聊还是群聊
  const isGroupChat = conversation.id.startsWith('sg_');
  const isSingleChat = conversation.id.startsWith('si_');


  // 渲染对应的组件
  if (isGroupChat) {
  
    return (
      <GroupChatItem
        conversation={conversation}
        displayInfo={displayInfo}
        onPress={onPress}
      />
    );
  }

  if (isSingleChat) {
    return (
      <SingleChatItem
        conversation={conversation}
        displayInfo={displayInfo}
        onPress={onPress}
      />
    );
  }

  // 默认情况，尝试根据会话类型判断
  if (conversation.type === 2) {
    // 群聊
    return (
      <GroupChatItem
        conversation={conversation}
        displayInfo={displayInfo}
        onPress={onPress}
      />
    );
  }

  // 默认单聊
  return (
    <SingleChatItem
      conversation={conversation}
      displayInfo={displayInfo}
      onPress={onPress}
    />
  );
};

export default ConversationItem;
