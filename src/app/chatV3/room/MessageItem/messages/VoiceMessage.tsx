/**
 * 语音消息组件
 */

import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text as RNText} from 'react-native';
import type {VoiceMessageProps} from './types';

const VoiceMessage: React.FC<VoiceMessageProps> = ({
  isCurrentUser = false,
}) => {
  // TODO: 实现语音消息播放逻辑
  
  return (
    <TouchableOpacity 
      className={`flex-row items-center px-3 py-2 rounded-lg ${
        isCurrentUser ? 'bg-blue-400' : 'bg-gray-200'
      }`}
      activeOpacity={0.8}
    >
      {/* 播放按钮 */}
      <View className={`w-6 h-6 rounded-full items-center justify-center mr-2 ${
        isCurrentUser ? 'bg-white' : 'bg-blue-500'
      }`}>
        <RNText className={`text-xs ${isCurrentUser ? 'text-blue-500' : 'text-white'}`}>
          ▶
        </RNText>
      </View>
      
      {/* 语音时长 */}
      <RNText className={`text-sm ${
        isCurrentUser ? 'text-white' : 'text-gray-700'
      }`}>
        0:00
      </RNText>
      
      {/* 波形图占位 */}
      <View className="flex-1 ml-2 flex-row items-center">
        <View className="w-1 h-2 bg-gray-400 rounded-full mx-0.5" />
        <View className="w-1 h-3 bg-gray-500 rounded-full mx-0.5" />
        <View className="w-1 h-2 bg-gray-400 rounded-full mx-0.5" />
        <View className="w-1 h-4 bg-gray-600 rounded-full mx-0.5" />
        <View className="w-1 h-2 bg-gray-400 rounded-full mx-0.5" />
      </View>
    </TouchableOpacity>
  );
};

export default VoiceMessage;
