import {CoreOssClient} from './core-web';
import {WebPlatformAdapter} from './web-adapter';

export const OSS_IMAGE_PREFIX = 'ossimg_';

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

// 创建Web平台的OSS客户端实例
const webAdapter = new WebPlatformAdapter();
const ossClient = CoreOssClient.getInstance(webAdapter);

// 导出上传方法
export const uploadToOss = async (
  file: File,
  loginInfo: {userID: string},
): Promise<string | null> => {
  try {
    return await ossClient.upload(file, loginInfo.userID);
  } catch (error) {
    console.error('上传失败:', error);
    return null;
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

export const deleteFileFromOss = async (fileName: string): Promise<void> => {
  // 注意：这里需要实现删除功能，暂时留空
  console.warn('删除文件功能暂未实现');
};