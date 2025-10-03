/**
 * 当前用户消息组件
 * 处理当前用户发送的消息显示逻辑
 */

import React, { memo } from 'react';
import {View, Image} from 'react-native';
import {Text as RNText} from 'react-native';
import {useSelfInfo} from '@/p138-react-common/OpenIM';
import type {MessageItemProps} from '../types';
import {renderMessageContent} from './MessageRenderer';
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import { DEFAULT_IMAGE } from '@/p138-react-common/config';

const CurrentUserMessage: React.FC<MessageItemProps> =  ({message}) => {
  const selfInfo = useSelfInfo();
 

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 获取已读状态文本
  const getReadStatusText = (status: number) => {
    if (status >= 3) {
      return '已读';
    } else if (status >= 2) {
      return '未读';
    }
    return '';
  };

  return (
    <View className="my-2 px-4 items-end">
      <View className="flex-row flex-row-reverse items-end">
        {/* 头像 */}
        <OSSImage
          source={{uri: selfInfo?.avatar ?? DEFAULT_IMAGE}}
          style={{width: 40, height: 40, borderRadius: 20, marginHorizontal: 8}}
        />

        {/* 气泡 + 状态 */}
        <View style={{maxWidth: '80%'}}>
          {/* 气泡与已读状态同一行显示 */}
          <View className="flex-row items-end justify-end">
            {/* <RNText className="text-xs text-gray-400 mr-2 mb-0.5">
              {getReadStatusText(message.status)}
            </RNText> */}
            <View className="px-4 py-3 rounded-2xl bg-blue-500 rounded-br-sm">
              {renderMessageContent(message, true)}
            </View>
          </View>

          {/* 时间放在下一行，靠右对齐 */}
          <View className="mt-1 items-end">
            <RNText className="text-xs text-gray-300">
              {formatTime(message.timestamp)}
            </RNText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(CurrentUserMessage);
