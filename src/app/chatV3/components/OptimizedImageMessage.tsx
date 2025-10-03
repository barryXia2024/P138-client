/**
 * 优化的图片消息组件
 * 基于原ImageMessage组件的样式和功能
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

interface OptimizedImageMessageProps {
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

const OptimizedImageMessage: React.FC<OptimizedImageMessageProps> = ({
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

  // 🚨 增强的图片数据解析逻辑 - 支持本地图片直接显示
  const imageData = useMemo(() => {
    if (message.type !== MessageType.Image) return null;
    
    const extras = message.extras as any;
    const pictureElem = extras?.pictureElem;
    
    console.log('🖼️ 开始解析图片数据:', {
      messageId: message.id,
      messageType: message.type,
      hasExtras: !!extras,
      hasPictureElem: !!pictureElem,
      extras: extras,
    });
    
    // 🚨 优先检查是否有本地图片路径（发送中的图片）
    const localImagePath = extras?.localImagePath || extras?.localPath;
    if (localImagePath) {
      console.log('✅ 发现本地图片路径:', localImagePath);
      
      return {
        url: localImagePath,
        width: extras?.width || 200,
        height: extras?.height || 200,
        thumbnail: localImagePath,
        isLocal: true,
      };
    }
    
    // 如果pictureElem存在，使用它
    if (pictureElem) {
      const sourcePicture = pictureElem.sourcePicture;
      const snapshotPicture = pictureElem.snapshotPicture;
      
      console.log('🖼️ 从pictureElem解析:', {
        sourcePicture: sourcePicture,
        snapshotPicture: snapshotPicture,
      });
      
      // 尝试多个可能的URL字段
      const imageUrl = sourcePicture?.url || sourcePicture?.uri || snapshotPicture?.url || snapshotPicture?.uri;
      
      if (imageUrl) {
        // 处理URL格式
        let finalUrl = imageUrl;
        if (imageUrl.startsWith('/') && !imageUrl.startsWith('file://')) {
          finalUrl = `file://${imageUrl}`;
        }
        
        console.log('✅ 成功从pictureElem解析图片:', finalUrl);
        
        return {
          url: finalUrl,
          width: sourcePicture?.width || snapshotPicture?.width || 200,
          height: sourcePicture?.height || snapshotPicture?.height || 200,
          thumbnail: sourcePicture?.thumbnail || snapshotPicture?.thumbnail || finalUrl,
          isLocal: finalUrl.startsWith('file://'),
        };
      }
    }
    
    // 如果pictureElem不存在或没有URL，尝试从content解析
    if (message.content) {
      try {
        const content = JSON.parse(message.content);
        console.log('🖼️ 尝试从content解析:', content);
        
        const imageUrl = content.sourcePicture?.url || content.sourcePicture?.uri || content.url;
        
        if (imageUrl) {
          console.log('✅ 成功从content解析图片:', imageUrl);
          
          return {
            url: imageUrl,
            width: content.sourcePicture?.width || content.width || 200,
            height: content.sourcePicture?.height || content.height || 200,
            thumbnail: content.sourcePicture?.thumbnail || content.thumbnail || imageUrl,
            isLocal: imageUrl.startsWith('file://'),
          };
        }
      } catch (error) {
        console.log('🖼️ content不是JSON格式，尝试直接使用:', message.content);
        
        // 如果content就是URL
        if (message.content && (message.content.startsWith('http') || message.content.startsWith('file://'))) {
          console.log('✅ 直接使用content作为图片URL:', message.content);
          
          return {
            url: message.content,
            width: 200,
            height: 200,
            thumbnail: message.content,
            isLocal: message.content.startsWith('file://'),
          };
        }
      }
    }
    
    console.warn('⚠️ 所有解析方式都失败:', {
      messageId: message.id,
      hasPictureElem: !!pictureElem,
      hasContent: !!message.content,
      content: message.content,
    });
    
    return null;
  }, [message]);

  // 计算图片显示尺寸（参考原组件）
  const imageDimensions = useMemo(() => {
    if (!imageData) return { width: 0, height: 0 };

    const { width, height } = imageData;
    
    // 使用自定义尺寸或默认尺寸（参考原组件的尺寸）
    const maxWidth = customMaxWidth ?? Math.min(screenWidth * 0.6, 150);
    const maxHeight = customMaxHeight ?? Math.min(screenHeight * 0.3, 150);
    
    // 计算宽高比
    const aspectRatio = width / height;
    
    let displayWidth = width;
    let displayHeight = height;
    
    // 如果图片宽度超过最大宽度，按宽度缩放
    if (width > maxWidth) {
      displayWidth = maxWidth;
      displayHeight = maxWidth / aspectRatio;
    }
    
    // 如果缩放后的高度超过最大高度，按高度缩放
    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = maxHeight * aspectRatio;
    }
    
    return { width: displayWidth, height: displayHeight };
  }, [imageData, customMaxWidth, customMaxHeight]);

  // 获取消息状态
  const messageStatus = useMemo(() => {
    const isSending = message.status === 1; // 发送中
    const isFailed = message.status === 4; // 发送失败
    return { isSending, isFailed };
  }, [message.status]);

  // 图片加载回调
  const handleImageLoadStart = useCallback(() => {
    setImageLoading(true);
    setImageError(false);
    console.log('🔄 开始加载图片:', imageData?.url);
  }, [imageData]);

  const handleImageLoadEnd = useCallback(() => {
    setImageLoading(false);
    console.log('✅ 图片加载成功');
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
    console.error('❌ 图片加载失败:', imageData?.url);
    ToastService.show('图片加载失败');
  }, [imageData]);

  const handleImagePreviewError = useCallback(() => {
    ToastService.show('图片预览加载失败');
    setImagePreviewVisible(false);
  }, []);

  // 处理图片点击
  const handleImagePress = useCallback(() => {
    if (showPreview && imageData?.url) {
      console.log('🖼️ 点击图片预览:', imageData.url);
      setImagePreviewVisible(true);
    }
  }, [showPreview, imageData]);

  // 渲染图片消息
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
          },
          style,
        ]}>
          <Image
            key={`image-${message.id}-${url}`}
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
          
          {/* 发送中状态 */}
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

          {/* 发送失败状态 */}
          {showStatus && isFailed && (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255,0,0,0.3)',
            }}>
              <RNText style={{
                color: 'white',
                fontSize: 12,
                textAlign: 'center',
              }}>发送失败{'\n'}点击重试</RNText>
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

  // 渲染图片预览模态框
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
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.9)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPress={() => setImagePreviewVisible(false)}
        >
          {/* 关闭按钮 */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 50,
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
          
          {/* 图片容器，阻止点击事件冒泡 */}
          <TouchableOpacity
            style={{
              width: screenWidth * 0.9,
              height: screenHeight * 0.8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Image
              key={`preview-${message.id}-${url}`}
              source={{ uri: url }}
              style={{
                width: screenWidth * 0.9,
                height: screenHeight * 0.8,
                resizeMode: 'contain',
              }}
              onError={handleImagePreviewError}
            />
          </TouchableOpacity>
        </TouchableOpacity>
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
    // 🚨 改进：发送中的图片不显示解析失败，而是显示加载状态
    const isSending = message.status === 1;
    
    if (isSending) {
      return (
        <View style={[{
          width: customMaxWidth ?? 150,
          height: customMaxHeight ?? 150,
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
        width: customMaxWidth ?? 150,
        height: customMaxHeight ?? 150,
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

export default OptimizedImageMessage;
