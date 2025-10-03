/**
 * 视频消息组件
 */

import React, {useState, useCallback} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {Text as RNText} from 'react-native';
import type {VideoMessageProps} from './types';

const VideoMessage: React.FC<VideoMessageProps> = ({
  message,
  isCurrentUser = false,
}) => {
  const [videoLoading, setVideoLoading] = useState(false);

  // TODO: 实现视频消息播放逻辑
  
  const handleVideoPress = useCallback(() => {
    // 播放视频
    console.log('播放视频');
  }, []);

  return (
    <TouchableOpacity 
      className="relative"
      onPress={handleVideoPress}
      activeOpacity={0.8}
    >
      {/* 视频缩略图 */}
      <View className="w-48 h-32 bg-gray-200 rounded-lg overflow-hidden">
        <Image
          source={{uri: 'https://via.placeholder.com/200x120?text=Video'}}
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* 播放按钮覆盖层 */}
        <View className="absolute inset-0 items-center justify-center bg-black bg-opacity-30">
          <View className="w-12 h-12 rounded-full bg-white bg-opacity-80 items-center justify-center">
            <RNText className="text-blue-500 text-lg">▶</RNText>
          </View>
        </View>
        
        {/* 视频时长 */}
        <View className="absolute bottom-2 right-2 bg-black bg-opacity-60 px-2 py-1 rounded">
          <RNText className="text-white text-xs">0:00</RNText>
        </View>
      </View>
      
      {/* 视频标题 */}
      <RNText className={`text-sm mt-1 ${
        isCurrentUser ? 'text-white' : 'text-gray-700'
      }`}>
        视频消息
      </RNText>
    </TouchableOpacity>
  );
};

export default VideoMessage;
