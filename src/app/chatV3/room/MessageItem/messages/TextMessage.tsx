/**
 * 文本消息组件
 */

import React from 'react';
import {Text as RNText} from 'react-native';
import {useMessageParser} from '@/p138-react-common/OpenIM';
import type {TextMessageProps} from './types';

const TextMessage: React.FC<TextMessageProps> = ({
  message,
  isCurrentUser = false,
}) => {
  const {parseTextMessage} = useMessageParser();

  // 获取文本信息
  const textInfo = React.useMemo(() => {
    return parseTextMessage(message);
  }, [message.content, message.type, parseTextMessage]);

  return (
    <RNText 
    style={{
     maxWidth: 200,
    }}
      className={`text-base leading-5 ${
        isCurrentUser ? 'text-white' : 'text-gray-800'
      }`}
    >
      {textInfo.content}
    </RNText>
  );
};

export default TextMessage;
