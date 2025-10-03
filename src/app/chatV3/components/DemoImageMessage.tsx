/**
 * 简化的图片消息组件
 * 完全按照OpenIM Demo的方式实现
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  NativeSyntheticEvent,
  ImageLoadEventData,
} from 'react-native';
import { Text as RNText } from 'react-native';
import { ToastService } from '@/p138-react-common/components/toast/ToastService';
import { MessageType } from '@/p138-react-common/OpenIM/base/types/core';
import type { WrappedMessage } from '@/p138-react-common/OpenIM/base/types/core';

interface DemoImageMessageProps {
  /** 消息对象 */
  message: WrappedMessage;
  /** 是否显示预览功能 */
  showPreview?: boolean;
  /** 自定义最大宽度 */
  maxWidth?: number;
  /** 自定义最大高度 */
  maxHeight?: number;
  /** 是否显示发送状态 */
  showStatus?: boolean;
  /** 自定义样式 */
  style?: any;
}

const DemoImageMessage: React.FC<DemoImageMessageProps> = ({
  message,
  showPreview = true,
  maxWidth = 240,
  maxHeight = 240,
  showStatus = true,
  style,
}) => {
  const [imageSize, setImageSize] = useState({ width: maxWidth, height: maxHeight });
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 🚨 Demo方式：从extras中获取图片URL
  const extras = message.extras as any;
  const imageUrl = extras?.pictureElem?.sourcePicture?.url;
  
  console.log('🖼️ Demo图片消息:', {
    messageId: message.id,
    imageUrl: imageUrl?.substring(0, 50) + '...',
    pictureElem: extras?.pictureElem,
    sourcePicture: extras?.pictureElem?.sourcePicture,
  });

  // 图片加载回调
  const handleImageLoad = useCallback((event: NativeSyntheticEvent<ImageLoadEventData>) => {
    const { width, height } = event.nativeEvent.source;
    const aspectRatio = width / height;

    let newWidth = maxWidth;
    let newHeight = maxWidth / aspectRatio;

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = maxHeight * aspectRatio;
    }

    setImageSize({ width: newWidth, height: newHeight });
    setImageLoading(false);
  }, [maxWidth, maxHeight]);

  const handleImageLoadStart = useCallback(() => {
    setImageLoading(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
    console.error('❌ 图片加载失败:', imageUrl);
  }, [imageUrl]);

  // 处理图片点击
  const handleImagePress = useCallback(() => {
    if (showPreview && imageUrl) {
      // 这里可以添加图片预览功能
      console.log('🖼️ 点击图片预览:', imageUrl);
    }
  }, [showPreview, imageUrl]);

  // 获取消息状态
  const isSending = message.status === 1; // 发送中
  const isFailed = message.status === 4; // 发送失败

  if (!imageUrl) {
    return (
      <View style={[{
        width: maxWidth,
        height: maxHeight,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
      }, style]}>
        <RNText style={{ color: '#999', fontSize: 12 }}>图片加载失败</RNText>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={handleImagePress} activeOpacity={0.8}>
      <View style={[{
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        position: 'relative',
        opacity: isSending ? 0.6 : 1,
      }, style]}>
        <Image
          key={`demo-image-${message.id}`}
          source={{ uri: imageUrl }}
          style={{
            width: imageSize.width,
            height: imageSize.height,
          }}
          resizeMode="contain"
          onLoad={handleImageLoad}
          onLoadStart={handleImageLoadStart}
          onError={handleImageError}
        />
        
        {/* 加载状态 */}
        {imageLoading && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}>
            <ActivityIndicator size="small" color="#666" />
          </View>
        )}

        {/* 错误状态 */}
        {imageError && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}>
            <RNText style={{ color: '#999', fontSize: 12 }}>加载失败</RNText>
          </View>
        )}

        {/* 发送状态 */}
        {showStatus && isSending && (
          <View style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 4,
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}>
            <RNText style={{ color: 'white', fontSize: 10 }}>发送中</RNText>
          </View>
        )}

        {showStatus && isFailed && (
          <View style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255,0,0,0.6)',
            borderRadius: 4,
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}>
            <RNText style={{ color: 'white', fontSize: 10 }}>发送失败</RNText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default DemoImageMessage;
