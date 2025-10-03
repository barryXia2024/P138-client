/**
 * 群聊会话项组件
 */

import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text as RNText} from 'react-native';
import {P138OpenIM, type Conversation} from '@/p138-react-common/OpenIM';
 
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import {DEFAULT_IMAGE} from '@/p138-react-common/config';
import type {GroupChatItemProps} from './types';
import {isEmpty} from '@/p138-react-common/utils';
 

const GroupChatItem: React.FC<GroupChatItemProps> = ({
  displayInfo,
  onPress,
  conversation,
}) => {
  const [avatars, setAvatars] = useState<string[]>([]);

  const getGroupInfo = async () => {
    try {
      const group = await P138OpenIM.getGroupMemberList(
        conversation.extras?.groupID as string,
      );
      // 获取前3个成员的头像，用于组合显示
      const avatars = group.map(item =>
        isEmpty(item.faceURL) ? DEFAULT_IMAGE : item.faceURL,
      );
      setAvatars(avatars);
    } catch (error) {
      console.error('获取群组信息失败:', error);
    }
  };

  useEffect(() => {
    if (conversation.extras?.groupID) {
      getGroupInfo();
    }
  }, [conversation.extras?.groupID]);

  // 渲染组合头像
  const renderCombinedAvatars = () => {
    if (avatars.length === 0) {
      // 如果没有头像数据，显示默认头像
      return (
        <View className="w-12 h-12 rounded-lg bg-blue-500 justify-center items-center">
          <RNText className="text-white text-lg font-bold">
            {displayInfo.title.charAt(0).toUpperCase()}
          </RNText>
        </View>
      );
    }

    // 平铺显示头像，一排最多3个
    return (
      <View className="w-12 h-12 rounded-lg  overflow-hidden flex-row flex-wrap justify-start items-start">
        {avatars.map((avatarUrl, index) => (
          <View
            key={index}
            className="w-4 h-4 rounded-sm overflow-hidden border border-white ">
            <OSSImage source={{uri: avatarUrl}} className="w-full h-full" />
          </View>
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
      onPress={onPress}
      activeOpacity={0.8}>
      <View>
        {renderCombinedAvatars()}
        {displayInfo.unreadCount > 0 && (
          <View className="absolute -right-1.5 -top-1.5 min-w-5 h-5 rounded-full bg-red-500 items-center justify-center px-1 border-2 border-white">
            <RNText className="text-white text-xs font-semibold">
              {displayInfo.unreadCount > 99 ? '99+' : displayInfo.unreadCount}
            </RNText>
          </View>
        )}
      </View>

      <View className="flex-1 ml-3 h-12 justify-between">
        <View className="flex-row items-center justify-between">
          <RNText
            className="flex-1 text-base text-gray-900 font-semibold"
            numberOfLines={1}>
            {displayInfo.title}
            {displayInfo.isPinned && (
              <RNText className="text-xs text-blue-500"> 📌</RNText>
            )}
          </RNText>
          <RNText className="text-xs text-gray-500 ml-2">
            {displayInfo.lastMessageTime}
          </RNText>
        </View>
        <View className="flex-row items-center justify-between">
          <RNText className="flex-1 text-sm text-gray-600" numberOfLines={1}>
            {displayInfo.lastMessageContent}
          </RNText>
          {displayInfo.isMuted && <RNText className="text-xs ml-2">🔕</RNText>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GroupChatItem;
