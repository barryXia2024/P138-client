/**
 * 图片消息组件
 */

import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Text as RNText} from 'react-native';
import {MessageType} from '@/p138-react-common/OpenIM/base/types/core';
import {useMessageParser} from '@/p138-react-common/OpenIM';
import {ToastService} from '@/p138-react-common/components/toast/ToastService';

// 定义接口
interface ImageMessageProps {
  message: any;
  isCurrentUser?: boolean;
  showPreview?: boolean;
  showStatus?: boolean;
}

// 获取屏幕尺寸
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const ImageMessage: React.FC<ImageMessageProps> = ({
  message,
  isCurrentUser: _isCurrentUser = false,
  showPreview = true,
  showStatus = true,
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
    ToastService.show('图片加载失败');
  }, []);

  const handleImagePreviewError = useCallback(() => {
    ToastService.show('图片预览加载失败');
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
    if (!imageInfo) {
      return {displayWidth: 0, displayHeight: 0, imageUrl: ''};
    }

    const {url, width, height, thumbnail} = imageInfo;

    // 根据屏幕尺寸动态设置最大尺寸
    const maxWidth = Math.min(screenWidth * 0.6, 150);
    const maxHeight = Math.min(screenHeight * 0.3, 150);

    // 计算宽高比
    const aspectRatio = width / height;

    let currentDisplayWidth = width;
    let currentDisplayHeight = height;

    // 如果图片宽度超过最大宽度，按宽度缩放
    if (width > maxWidth) {
      currentDisplayWidth = maxWidth;
      currentDisplayHeight = maxWidth / aspectRatio;
    }

    // 如果缩放后的高度超过最大高度，按高度缩放
    if (currentDisplayHeight > maxHeight) {
      currentDisplayHeight = maxHeight;
      currentDisplayWidth = maxHeight * aspectRatio;
    }

    return {
      displayWidth: currentDisplayWidth,
      displayHeight: currentDisplayHeight,
      imageUrl: thumbnail || url,
    };
  }, [imageInfo]);

  // 判断消息状态
  const isSending = message.status === 1; // 发送中
  const isFailed = message.status === 4; // 发送失败

  if (!imageInfo) {
    return null;
  }

  return (
    <>
      <TouchableOpacity onPress={handleImagePress} activeOpacity={0.8}>
        <View
          style={[
            styles.imageContainer,
            {width: imageDimensions.displayWidth, height: imageDimensions.displayHeight},
          ]}>
          <Image
            key={`image-${message.id}-${imageDimensions.imageUrl}`}
            source={{uri: imageDimensions.imageUrl}}
            style={styles.image}
            onLoadStart={handleImageLoadStart}
            onLoadEnd={handleImageLoadEnd}
            onError={handleImageError}
          />

          {/* 加载状态 */}
          {imageLoading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="small" color="#2D9DFE" />
            </View>
          )}

          {/* 发送中状态 */}
          {showStatus && isSending && !imageLoading && (
            <View style={[styles.overlay, styles.sendingOverlay]}>
              <ActivityIndicator size="small" color="#fff" />
              <RNText style={styles.sendingText}>发送中...</RNText>
            </View>
          )}

          {/* 发送失败状态 */}
          {showStatus && isFailed && (
            <View style={[styles.overlay, styles.failedOverlay]}>
              <RNText style={styles.failedText}>
                发送失败{'\n'}点击重试
              </RNText>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* 图片预览模态框 */}
      {showPreview && (
        <Modal
          visible={imagePreviewVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setImagePreviewVisible(false)}>
          <View style={styles.previewContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setImagePreviewVisible(false)}>
              <RNText style={styles.closeButtonText}>✕</RNText>
            </TouchableOpacity>

            {imageInfo && (
              <Image
                key={`preview-${message.id}-${imageInfo.url}`}
                source={{uri: imageInfo.url}}
                style={styles.previewImage}
                onError={handleImagePreviewError}
              />
            )}
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  sendingOverlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sendingText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  failedOverlay: {
    backgroundColor: 'rgba(255,0,0,0.3)',
  },
  failedText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewImage: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.8,
    resizeMode: 'contain',
  },
});

export default ImageMessage;
