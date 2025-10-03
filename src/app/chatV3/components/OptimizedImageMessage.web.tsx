/**
 * Web端专用的图片消息组件
 * 处理web端的特殊逻辑和样式
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

interface WebImageMessageProps {
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

const WebImageMessage: React.FC<WebImageMessageProps> = ({
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

  // 🚨 Web端专用的图片数据解析逻辑
  const imageData = useMemo(() => {
    if (message.type !== MessageType.Image) return null;
    
    console.log('🌐 Web端解析图片数据:', {
      messageId: message.id,
      messageType: message.type,
      content: message.content,
      extras: message.extras,
    });
    
    // Web端通常使用blob URL或网络URL
    const extras = message.extras as any;
    const pictureElem = extras?.pictureElem;
    
    if (pictureElem) {
      const sourcePicture = pictureElem.sourcePicture;
      const snapshotPicture = pictureElem.snapshotPicture;
      
      const imageUrl = sourcePicture?.url || sourcePicture?.uri || snapshotPicture?.url || snapshotPicture?.uri;
      
      if (imageUrl) {
        console.log('🌐 Web端从pictureElem解析:', imageUrl);
        
        return {
          url: imageUrl,
          width: sourcePicture?.width || snapshotPicture?.width || 200,
          height: sourcePicture?.height || snapshotPicture?.height || 200,
          thumbnail: sourcePicture?.thumbnail || snapshotPicture?.thumbnail || imageUrl,
        };
      }
    }
    
    // Web端回退到content解析
    if (message.content) {
      try {
        const content = JSON.parse(message.content);
        const imageUrl = content.sourcePicture?.url || content.sourcePicture?.uri || content.url;
        
        if (imageUrl) {
          console.log('🌐 Web端从content解析:', imageUrl);
          
          return {
            url: imageUrl,
            width: content.sourcePicture?.width || content.width || 200,
            height: content.sourcePicture?.height || content.height || 200,
            thumbnail: content.sourcePicture?.thumbnail || content.thumbnail || imageUrl,
          };
        }
      } catch (error) {
        // 如果content就是URL
        if (message.content && (message.content.startsWith('http') || message.content.startsWith('blob:'))) {
          console.log('🌐 Web端直接使用content:', message.content);
          
          return {
            url: message.content,
            width: 200,
            height: 200,
            thumbnail: message.content,
          };
        }
      }
    }
    
    console.warn('🌐 Web端解析失败:', message);
    return null;
  }, [message]);

  // 计算图片显示尺寸
  const imageDimensions = useMemo(() => {
    if (!imageData) return { width: 0, height: 0 };

    const { width, height } = imageData;
    
    // Web端使用稍微不同的尺寸
    const maxWidth = customMaxWidth ?? Math.min(screenWidth * 0.5, 200);
    const maxHeight = customMaxHeight ?? Math.min(screenHeight * 0.4, 200);
    
    const aspectRatio = width / height;
    
    let displayWidth = width;
    let displayHeight = height;
    
    if (width > maxWidth) {
      displayWidth = maxWidth;
      displayHeight = maxWidth / aspectRatio;
    }
    
    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = maxHeight * aspectRatio;
    }
    
    return { width: displayWidth, height: displayHeight };
  }, [imageData, customMaxWidth, customMaxHeight]);

  // 获取消息状态
  const messageStatus = useMemo(() => {
    const isSending = message.status === 1;
    const isFailed = message.status === 4;
    return { isSending, isFailed };
  }, [message.status]);

  // 图片加载回调
  const handleImageLoadStart = useCallback(() => {
    setImageLoading(true);
    setImageError(false);
  }, []);

  const handleImageLoadEnd = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
    ToastService.show('图片加载失败');
  }, []);

  const handleImagePreviewError = useCallback(() => {
    ToastService.show('图片预览加载失败');
    setImagePreviewVisible(false);
  }, []);

  // 处理图片点击
  const handleImagePress = useCallback(() => {
    if (showPreview && imageData?.url) {
      setImagePreviewVisible(true);
    }
  }, [showPreview, imageData]);

  // 渲染图片内容
  const renderImageContent = useMemo(() => {
    if (!imageData) return null;

    const { url, thumbnail } = imageData;
    const { width, height } = imageDimensions;
    const { isSending, isFailed } = messageStatus;

    return (
      <TouchableOpacity onPress={handleImagePress} activeOpacity={0.8}>
        <View style={[
          {
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: '#f0f0f0',
            position: 'relative',
            // Web端特殊样式
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          },
          style,
        ]}>
          <Image
            key={`web-image-${message.id}-${url}`}
            source={{ uri: thumbnail || url }}
            style={{
              width,
              height,
              opacity: isSending ? 0.6 : 1,
            }}
            onLoadStart={handleImageLoadStart}
            onLoadEnd={handleImageLoadEnd}
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
              <ActivityIndicator size="small" color="#2D9DFE" />
            </View>
          )}
          
          {/* 发送状态 */}
          {showStatus && isSending && !imageLoading && (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}>
              <ActivityIndicator size="small" color="#2D9DFE" />
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
        </View>
      </TouchableOpacity>
    );
  }, [
    imageData,
    imageDimensions,
    messageStatus,
    handleImagePress,
    handleImageLoadStart,
    handleImageLoadEnd,
    handleImageError,
    imageLoading,
    showStatus,
    message.id,
    style,
    imageError,
  ]);

  // Web端图片预览（使用浏览器原生行为）
  const renderImagePreview = useMemo(() => {
    if (!showPreview || !imageData) return null;

    const { url } = imageData;

    return (
      <Modal
        visible={imagePreviewVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImagePreviewVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              zIndex: 2,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 20,
            }}
            onPress={() => setImagePreviewVisible(false)}
          >
            <RNText style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>✕</RNText>
          </TouchableOpacity>
          
          <Image
            key={`web-preview-${message.id}-${url}`}
            source={{ uri: url }}
            style={{
              width: screenWidth * 0.9,
              height: screenHeight * 0.8,
              resizeMode: 'contain',
            }}
            onError={handleImagePreviewError}
          />
        </View>
      </Modal>
    );
  }, [
    showPreview,
    imageData,
    imagePreviewVisible,
    message.id,
    handleImagePreviewError,
  ]);

  if (!imageData) {
    const isSending = message.status === 1;
    
    if (isSending) {
      return (
        <View style={[{
          width: customMaxWidth ?? 200,
          height: customMaxHeight ?? 200,
          backgroundColor: '#f0f0f0',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }, style]}>
          <ActivityIndicator size="small" color="#2D9DFE" />
          <RNText style={{ color: '#666', fontSize: 12, marginTop: 8 }}>发送中...</RNText>
        </View>
      );
    }
    
    return (
      <View style={[{
        width: customMaxWidth ?? 200,
        height: customMaxHeight ?? 200,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
      }, style]}>
        <RNText style={{ color: '#999', fontSize: 12 }}>图片加载中...</RNText>
      </View>
    );
  }

  return (
    <>
      {renderImageContent}
      {renderImagePreview}
    </>
  );
};

export default WebImageMessage;
