import { setWindowsLocation } from './config';
import {CoreOssClient} from './core';
import {RNPlatformAdapter} from './rn-adapter';

export const OSS_IMAGE_PREFIX = 'ossimg_';
setWindowsLocation()
export const judgeImageIsOss = (src: string) => {
  if (src.startsWith('http') || src.startsWith('data:image')) {
    return false;
  }
  return true;
};

export const judgeFileIsOss = (src: string) => {
  if (src.startsWith('http') || src.startsWith('data:')) {
    return false;
  }
  return true;
};

// 创建React Native平台的OSS客户端实例
const rnAdapter = new RNPlatformAdapter();
const ossClient = CoreOssClient.getInstance(rnAdapter);

// 导出上传方法
export const uploadToOss = async (
  file: any, // ImagePickerAsset
  userID: string,
): Promise<string> => {
  try {
    return await ossClient.upload(file, userID);
  } catch (error: any) {
    if (error.status === 403) {
      return '';
    }
    console.error('上传失败:', error);
    throw error;
  }
};

export const getImageFromOss = async (fileName: string): Promise<string> => {
  return ossClient.getImage(fileName);
};

export const getFileFromOss = async (fileName: string): Promise<string> => {
  return ossClient.getFile(fileName);
};

// 缓存管理方法
export const clearImageCache = (fileName?: string) => {
  ossClient.clearImageCache(fileName);
};

export const clearUploadCache = (cacheKey?: string) => {
  ossClient.clearUploadCache(cacheKey);
};

export const clearAllPendingRequests = () => {
  ossClient.clearAllPendingRequests();
};

export const clearAuthInfo = () => {
  ossClient.clearAuthInfo();
};

export default {
  uploadToOss,
  getImageFromOss,
  getFileFromOss,
  clearImageCache,
  clearUploadCache,
  clearAllPendingRequests,
  clearAuthInfo,
};