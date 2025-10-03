/**
 * 文本消息组件
 * 处理文本消息的显示和格式化
 */

import React, {useMemo} from 'react';
import {Text as RNText} from 'react-native';
import {useMessageParser} from '@/p138-react-common/OpenIM';
import type {WrappedMessage} from '@/p138-react-common/OpenIM/base/types/core';

interface TextMessageProps {
  /** 消息对象 */
  message: WrappedMessage;
  /** 是否为当前用户发送的消息 */
  isCurrentUser?: boolean;
  /** 自定义样式 */
  style?: any;
  /** 自定义文本样式 */
  textStyle?: any;
}

const TextMessage: React.FC<TextMessageProps> = ({
  message,
  isCurrentUser = false,
  style,
  textStyle,
}) => {
  const {parseTextMessage} = useMessageParser();

  // 获取文本信息
  const textInfo = useMemo(() => {
    return parseTextMessage(message);
  }, [message.content, message.type, parseTextMessage]);

  return (
    <RNText 
      style={[
        {
          fontSize: 16,
          lineHeight: 20,
          color: isCurrentUser ? '#fff' : '#333',
        },
        textStyle,
      ]}
      className={style}
    >
      {textInfo.content}
    </RNText>
  );
};

export default TextMessage;
