/**
 * 图片消息组件
 * 处理图片消息的显示、预览、加载状态等
 */

import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import {Text as RNText} from 'react-native';
import {ToastService} from '@/p138-react-common/components/toast/ToastService';
import {useMessageParser} from '@/p138-react-common/OpenIM';
import {MessageType} from '@/p138-react-common/OpenIM/base/types/core';
import type {WrappedMessage} from '@/p138-react-common/OpenIM/base/types/core';

// 获取屏幕尺寸
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

interface ImageMessageProps {
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

const ImageMessage: React.FC<ImageMessageProps> = ({
  message,
  showPreview = true,
  maxWidth: customMaxWidth,
  maxHeight: customMaxHeight,
  showStatus = true,
  style,
}) => {
  const {parseImageMessage} = useMessageParser();
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // 获取图片信息
  const imageInfo = useMemo(() => {
    if (message.type !== MessageType.Image) return null;
    return parseImageMessage(message);
  }, [message.type, message.content, message.extras, message.id, message.senderId, parseImageMessage]);

  // 处理图片点击
  const handleImagePress = useCallback(() => {
    if (showPreview) {
      setImagePreviewVisible(true);
    }
  }, [showPreview]);

  // 图片加载回调
  const handleImageLoadStart = useCallback(() => {
    setImageLoading(true);
  }, []);

  const handleImageLoadEnd = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImagePreviewError = useCallback(() => {
    ToastService.show('图片加载失败');
    setImagePreviewVisible(false);
  }, []);

  // 🚨 关键修复：监听消息状态变化，当发送失败时清除 loading 状态
  useEffect(() => {
    const messageStatus = message.status;
    if (messageStatus === 5) { // MessageStatus.Failed
      console.log('🔄 消息发送失败，清除图片 loading 状态');
      setImageLoading(false);
    }
  }, [message.status]);

  // 计算图片显示尺寸
  const imageDimensions = useMemo(() => {
    if (!imageInfo) return {width: 0, height: 0};

    const {width, height} = imageInfo;
    
    // 使用自定义尺寸或默认尺寸
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
    
    return {width: displayWidth, height: displayHeight};
  }, [imageInfo, customMaxWidth, customMaxHeight]);

  // 获取消息状态
  const messageStatus = useMemo(() => {
    const isSending = message.status === 1; // 发送中
    const isFailed = message.status === 4; // 发送失败
    return {isSending, isFailed};
  }, [message.status]);

  // 渲染图片消息
  const renderImageContent = useMemo(() => {
    if (!imageInfo) return null;

    const {url, thumbnail} = imageInfo;
    const {width, height} = imageDimensions;
    const {isSending, isFailed} = messageStatus;

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
            source={{uri: thumbnail || url}}
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
              <RNText style={{
                color: 'white',
                fontSize: 12,
                marginTop: 4,
              }}>发送中...</RNText>
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
        </View>
      </TouchableOpacity>
    );
  }, [
    imageInfo,
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
  ]);

  // 渲染图片预览模态框
  const renderImagePreview = useMemo(() => {
    if (!showPreview || !imageInfo) return null;

    const {url} = imageInfo;

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
              top: 50,
              right: 20,
              zIndex: 1,
            }}
            onPress={() => setImagePreviewVisible(false)}
          >
            <RNText style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>✕</RNText>
          </TouchableOpacity>
          
          <Image
            key={`preview-${message.id}-${url}`}
            source={{uri: url}}
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
    imageInfo,
    imagePreviewVisible,
    message.id,
    handleImagePreviewError,
  ]);

  if (!imageInfo) return null;

  return (
    <>
      {renderImageContent}
      {renderImagePreview}
    </>
  );
};

export default ImageMessage;
