/**
 * 单聊会话项组件
 */

import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native';
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import {DEFAULT_IMAGE} from '@/p138-react-common/config';
import type {SingleChatItemProps} from './types';
import P138OpenIM, {useUserInfo} from '@/p138-react-common/OpenIM';
import { UserOnlineState } from '@openim/client-sdk';
import { useUserStore } from 'src/store';

const SingleChatItem: React.FC<SingleChatItemProps> = ({
  displayInfo,
  onPress,
  conversation,
}) => {
  const {shopInfo} = useUserStore();
  // 使用用户信息 hook
  const {userInfo} = useUserInfo({
    userId: conversation.extras?.userID,
    enabled: !!conversation.extras?.userID,
  });

  const [onlineStatus, setOnlineStatus] = useState<UserOnlineState>();
  console.log('userInfo', onlineStatus);
  const getUserOnlineStatus = async () => {
    const onlineStatus = await P138OpenIM.getSubscribeUsersStatus();
    const userOnlineStatus = onlineStatus.find(
      item => item.userID === conversation.extras?.userID,
    );
    setOnlineStatus(userOnlineStatus);
    console.log(onlineStatus, '========onlineStatus========');
  };
  const subscribeUsersStatus = async () => {
    console.log(
      conversation.extras?.userID,
      '========conversation.extras?.userID========',
    );
    if (conversation.extras?.userID) {
      const onlineStatus = await P138OpenIM.subscribeUsersStatus(
        conversation.extras?.userID ?? '',
      );
      console.log(onlineStatus, '========onlineStatus========');
      return onlineStatus;
    }
  };
  const handleStatusChanged = (data: UserOnlineState[]) => {
    const user = data.find(item => item.userID === conversation.extras?.userID);
    if (user) setOnlineStatus(user);
  };



  useEffect(() => {
    const onlineStatus = subscribeUsersStatus();
    P138OpenIM.onUserStatusChanged(handleStatusChanged);
    console.log(onlineStatus, '========subscribeUsersStatus========');
  }, [conversation.extras?.userID]);

  useEffect(() => {
    getUserOnlineStatus();
  }, [displayInfo.unreadCount]);
  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
      onPress={onPress}
      activeOpacity={0.8}>
      <View>
        <OSSImage
          source={{uri: userInfo?.faceURL ?? DEFAULT_IMAGE}}
          className="w-12 h-12 rounded-full"
        />
        {displayInfo.unreadCount > 0 && (
          <View className="absolute -right-1.5 -top-1.5 min-w-5 h-5 rounded-full bg-red-500 items-center justify-center px-1 border-2 border-white">
            <Text className="text-white text-xs font-semibold">
              {displayInfo.unreadCount > 99 ? '99+' : displayInfo.unreadCount}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-1 ml-3 h-12 justify-between">
        <View className="flex-row items-center justify-between">
          <Text
            className="flex-1 text-base text-gray-900 font-semibold"
            numberOfLines={1}>
            {shopInfo.shopName}（店主{shopInfo.shopCode}）
            {displayInfo.isPinned && (
              <Text className="text-xs text-blue-500"> 📌</Text>
            )}
          </Text>
          <Text className="text-xs text-gray-500 ml-2">
            {displayInfo.lastMessageTime}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 text-sm text-gray-600" numberOfLines={1}>
            {conversation.lastMessage?.extras.textElem?.content}
          </Text>
          {displayInfo.isMuted && <Text className="text-xs ml-2">🔕</Text>}
          <Text className="text-xs ml-2">
            {onlineStatus?.status === 1 ? '🟢在线' : '🔴离线'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SingleChatItem;
