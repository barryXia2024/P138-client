/**
 * 简化的图片消息组件 - 直接使用Demo方式
 * 绕过parseImageMessage函数，直接访问图片数据
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  NativeSyntheticEvent,
  ImageLoadEventData,
  Modal,
  Dimensions,
} from 'react-native';
import { Text as RNText } from 'react-native';
import { ToastService } from '@/p138-react-common/components/toast/ToastService';
import { MessageType } from '@/p138-react-common/OpenIM/base/types/core';
import type { WrappedMessage } from '@/p138-react-common/OpenIM/base/types/core';

// 获取屏幕尺寸
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SimpleImageMessageProps {
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

const SimpleImageMessage: React.FC<SimpleImageMessageProps> = ({
  message,
  showPreview = true,
  maxWidth: customMaxWidth,
  maxHeight: customMaxHeight,
  showStatus = true,
  style,
}) => {
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 🚨 直接使用Demo方式：从extras中获取图片数据
  const imageData = useMemo(() => {
    if (message.type !== MessageType.Image) return null;
    
    const extras = message.extras as any;
    const pictureElem = extras?.pictureElem;
    
    if (!pictureElem) {
      console.warn('⚠️ 消息中没有pictureElem:', message);
      return null;
    }
    
    const sourcePicture = pictureElem.sourcePicture;
    const snapshotPicture = pictureElem.snapshotPicture;
    
    console.log('🖼️ 直接解析图片数据:', {
      messageId: message.id,
      sourcePicture: sourcePicture,
      snapshotPicture: snapshotPicture,
      pictureElem: pictureElem,
    });
    
    // 尝试多个可能的URL字段
    const imageUrl = sourcePicture?.url || sourcePicture?.uri || snapshotPicture?.url || snapshotPicture?.uri;
    
    if (!imageUrl) {
      console.warn('⚠️ 未找到图片URL:', {
        sourcePicture: sourcePicture,
        snapshotPicture: snapshotPicture,
      });
      return null;
    }
    
    // 处理URL格式
    let finalUrl = imageUrl;
    if (imageUrl.startsWith('/') && !imageUrl.startsWith('file://')) {
      finalUrl = `file://${imageUrl}`;
    }
    
    return {
      url: finalUrl,
      width: sourcePicture?.width || snapshotPicture?.width || 200,
      height: sourcePicture?.height || snapshotPicture?.height || 200,
      thumbnail: sourcePicture?.thumbnail || snapshotPicture?.thumbnail || finalUrl,
    };
  }, [message]);

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
    console.log('✅ 图片加载成功:', { width: newWidth, height: newHeight });
  }, [maxWidth, maxHeight]);

  const handleImageLoadStart = useCallback(() => {
    setImageLoading(true);
    setImageError(false);
    console.log('🔄 开始加载图片:', imageData?.url);
  }, [imageData]);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
    console.error('❌ 图片加载失败:', imageData?.url);
    ToastService.show('图片加载失败');
  }, [imageData]);

  // 处理图片点击
  const handleImagePress = useCallback(() => {
    if (showPreview && imageData?.url) {
      console.log('🖼️ 点击图片预览:', imageData.url);
      // 这里可以添加图片预览功能
    }
  }, [showPreview, imageData]);

  // 获取消息状态
  const isSending = message.status === 1; // 发送中
  const isFailed = message.status === 4; // 发送失败

  if (!imageData) {
    return (
      <View style={[{
        width: maxWidth,
        height: maxHeight,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
      }, style]}>
        <RNText style={{ color: '#999', fontSize: 12 }}>图片数据解析失败</RNText>
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
          key={`simple-image-${message.id}`}
          source={{ uri: imageData.url }}
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

export default SimpleImageMessage;
