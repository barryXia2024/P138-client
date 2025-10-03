/**
 * 消息项主组件
 * 根据用户类型分发到对应的用户消息组件
 */

import React from 'react';
import {useSelfInfo} from '@/p138-react-common/OpenIM';
import type {MessageItemProps} from './types';
import {CurrentUserMessage, OtherUserMessage} from './components';

const MessageItem: React.FC<MessageItemProps> = ({message}) => {
  const selfInfo = useSelfInfo();
  
  // 判断是否为当前用户发送的消息
  const isCurrentUser = message.senderId === selfInfo?.userID;

  // 根据用户类型分发到对应组件
  if (isCurrentUser) {
    return <CurrentUserMessage message={message} />;
  } else {
    return <OtherUserMessage message={message} />;
  }
};

export default MessageItem;