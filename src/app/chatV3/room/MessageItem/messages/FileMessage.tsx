/**
 * 文件消息组件
 */

import React, {useCallback} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text as RNText} from 'react-native';
import type {FileMessageProps} from './types';

const FileMessage: React.FC<FileMessageProps> = ({
  message,
  isCurrentUser = false,
}) => {
  // TODO: 实现文件消息下载逻辑
  
  const handleFilePress = useCallback(() => {
    // 下载或打开文件
    console.log('下载文件');
  }, []);

  return (
    <TouchableOpacity 
      className={`flex-row items-center px-3 py-2 rounded-lg ${
        isCurrentUser ? 'bg-blue-400' : 'bg-gray-200'
      }`}
      onPress={handleFilePress}
      activeOpacity={0.8}
    >
      {/* 文件图标 */}
      <View className={`w-8 h-8 rounded items-center justify-center mr-3 ${
        isCurrentUser ? 'bg-white' : 'bg-blue-500'
      }`}>
        <RNText className={`text-lg ${isCurrentUser ? 'text-blue-500' : 'text-white'}`}>
          📄
        </RNText>
      </View>
      
      {/* 文件信息 */}
      <View className="flex-1">
        <RNText className={`text-sm font-medium ${
          isCurrentUser ? 'text-white' : 'text-gray-700'
        }`} numberOfLines={1}>
          文件名.pdf
        </RNText>
        <RNText className={`text-xs ${
          isCurrentUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          2.5 MB
        </RNText>
      </View>
      
      {/* 下载按钮 */}
      <View className={`w-6 h-6 rounded-full items-center justify-center ${
        isCurrentUser ? 'bg-white' : 'bg-blue-500'
      }`}>
        <RNText className={`text-xs ${isCurrentUser ? 'text-blue-500' : 'text-white'}`}>
          ↓
        </RNText>
      </View>
    </TouchableOpacity>
  );
};

export default FileMessage;
