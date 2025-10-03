/**
 * 权限检查工具
 * 用于处理debug和release版本的权限差异
 */

import { Platform, PermissionsAndroid, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

/**
 * 检查并请求Android存储权限
 */
export const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    // Android 13+ 使用新的媒体权限
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]);
      
      return (
        granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] === PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      // Android 12 及以下使用传统权限
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      
      return (
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
  } catch (error) {
    console.error('权限请求失败:', error);
    return false;
  }
};

/**
 * 检查并请求相机权限
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('相机权限请求失败:', error);
    return false;
  }
};

/**
 * 检查并请求相册权限
 */
export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('相册权限请求失败:', error);
    return false;
  }
};

/**
 * 检查所有图片相关权限
 */
export const checkImagePermissions = async (): Promise<{
  storage: boolean;
  camera: boolean;
  mediaLibrary: boolean;
}> => {
  const [storage, camera, mediaLibrary] = await Promise.all([
    requestStoragePermission(),
    requestCameraPermission(),
    requestMediaLibraryPermission(),
  ]);

  return { storage, camera, mediaLibrary };
};

/**
 * 显示权限说明对话框
 */
export const showPermissionDialog = (permissionType: 'storage' | 'camera' | 'mediaLibrary') => {
  const messages = {
    storage: '需要存储权限来保存和访问图片文件',
    camera: '需要相机权限来拍摄照片',
    mediaLibrary: '需要相册权限来选择和发送图片',
  };

  Alert.alert(
    '权限请求',
    messages[permissionType],
    [
      { text: '取消', style: 'cancel' },
      { text: '去设置', onPress: () => {
        // 这里可以添加跳转到设置页面的逻辑
        console.log('跳转到设置页面');
      }},
    ]
  );
};
