/**
 * 简化的图片发送实现
 * 完全按照OpenIM Demo的方式实现
 */

import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ToastService } from '@/p138-react-common/components/toast/ToastService';

/**
 * 简化的图片选择和处理函数
 * 完全按照Demo的方式实现
 */
export const selectAndSendImage = async (onSendImage: (uri: string, width?: number, height?: number) => Promise<void>) => {
  try {
    console.log('📸 开始选择图片（Demo方式）...');

    // 请求权限
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      ToastService.show('需要相册权限才能发送图片');
      return;
    }

    // 选择图片
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.8,
      allowsEditing: false,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];
      
      console.log('📸 选择的图片信息:', {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize,
        fileName: asset.fileName,
      });

      // 检查文件大小（限制为10MB）
      if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
        ToastService.show('图片文件过大，请选择小于10MB的图片');
        return;
      }

      // 🚨 Demo方式：直接使用原始URI
      console.log('📤 开始发送图片消息（Demo方式）...');
      console.log('📤 发送图片路径:', asset.uri);
      
      await onSendImage(asset.uri, asset.width, asset.height);
      
      console.log('✅ 图片发送成功（Demo方式）');
    } else {
      console.log('❌ 用户取消了图片选择');
    }
  } catch (error) {
    console.error('❌ 选择图片失败（Demo方式）:', error);
    
    let errorMessage = '未知错误';
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // 针对特定错误类型提供更友好的提示
      if (error.message.includes('fs.PathError') || error.message.includes('no such file or directory')) {
        errorMessage = '图片文件访问失败，请重新选择图片';
      } else if (error.message.includes('permission')) {
        errorMessage = '权限不足，请检查应用权限设置';
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        errorMessage = '网络连接失败，请检查网络后重试';
      }
    }
    
    ToastService.show(`选择图片失败：${errorMessage}`);
  }
};
