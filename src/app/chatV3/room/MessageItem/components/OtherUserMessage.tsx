/**
 * 其他用户消息组件
 * 处理其他用户发送的消息显示逻辑
 */

import React, { memo } from 'react';
import {View, Image} from 'react-native';
import {Text as RNText} from 'react-native';
import {useUserInfo} from '@/p138-react-common/OpenIM';
import type {MessageItemProps} from '../types';
import {renderMessageContent} from './MessageRenderer';
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import { DEFAULT_IMAGE } from '@/p138-react-common/config';

const OtherUserMessage: React.FC<MessageItemProps> = ({message}) =>   {
  // 使用用户信息 hook
  const {userInfo} = useUserInfo({
    userId: message.senderId,
    enabled: !!message.senderId,
  });

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 头像地址（优先使用获取到的用户信息）
  const avatarUrl = React.useMemo(() => {
    // 优先使用获取到的用户信息
    if (userInfo?.faceURL) {
      return userInfo.faceURL;
    }
    
    // 回退到从extras中获取头像信息
    const extras = message.extras as any;
    return extras?.senderFaceUrl || extras?.faceURL || extras?.senderAvatar || undefined;
  }, [userInfo?.faceURL, message.extras]);
  
  // 获取发送者昵称（优先使用获取到的用户信息）
  const senderNickname = React.useMemo(() => {
    // 优先使用获取到的用户信息
    if (userInfo?.nickname) {
      return userInfo.nickname;
    }
    
    // 回退到从extras中获取昵称信息
    const extras = message.extras as any;
    return extras?.senderNickname || extras?.nickname || extras?.senderName || '用户';
  }, [userInfo?.nickname, message.extras]);

  return (
    <View className="my-2 px-4 items-start">
      <View className="flex-row items-end">
        {/* 头像 */}
        <OSSImage
          source={{uri: avatarUrl ?? DEFAULT_IMAGE}}
          style={{width: 40, height: 40, borderRadius: 20, marginHorizontal: 8}}
        />

        {/* 气泡 + 昵称 */}
        <View style={{maxWidth: '80%'}}>
          {/* 显示昵称 */}
          <RNText className="text-xs text-gray-500 mb-1 ml-1">
            {senderNickname}
          </RNText>
          
          {/* 气泡 */}
          <View className="flex-row items-end justify-start">
            <View className="px-4 py-3 rounded-2xl bg-white rounded-bl-sm border border-gray-200">
              {renderMessageContent(message, false)}
            </View>
          </View>

          {/* 时间放在下一行，靠左对齐 */}
          <View className="mt-1 items-start">
            <RNText className="text-xs text-gray-500">
              {formatTime(message.timestamp)}
            </RNText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(OtherUserMessage);
