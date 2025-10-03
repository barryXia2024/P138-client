/**
 * 图片缓存Hook
 * 
 * 用于缓存网络图片，提高图片加载性能
 * 依赖expo-file-system和expo-crypto包
 */

import {useEffect, useState} from 'react';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

/**
 * 图片缓存状态接口
 */
export interface ImageCacheResult {
  /** 缓存后的图片URI */
  cachedUri: string | null;
  /** 是否正在加载 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 原始图片URL */
  originalUrl: string | null;
}

/**
 * 图片缓存配置选项
 */
export interface ImageCacheOptions {
  /** 缓存过期时间（毫秒） */
  expireTime?: number;
  /** 是否在组件挂载时自动加载 */
  loadOnMount?: boolean;
  /** 预先指定图片宽度 */
  width?: number;
  /** 预先指定图片高度 */
  height?: number;
}

/**
 * 图片缓存Hook
 * 
 * @param imageUrl 图片URL
 * @param options 缓存选项
 * @returns 图片缓存状态
 */
export function useImageCache(
  imageUrl: string | null,
  options: ImageCacheOptions = {}
): ImageCacheResult {
  const [cachedUri, setCachedUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    expireTime = 7 * 24 * 60 * 60 * 1000, // 默认一周过期
    loadOnMount = true,
    width,
    height,
  } = options;

  /**
   * 缓存图片到文件系统
   */
  const cacheImage = async (url: string): Promise<string> => {
    try {
      // 生成缓存文件名
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        url
      );
      
      const fileExtension = url.split('.').pop() || 'jpg';
      const cachedFile = `${FileSystem.cacheDirectory}${hash}.${fileExtension}`;
      
      // 检查缓存是否存在
      const fileInfo = await FileSystem.getInfoAsync(cachedFile);
      
      // 如果缓存存在且未过期，直接使用缓存
      if (fileInfo.exists) {
        const modificationTime = fileInfo.modificationTime || 0;
        const now = Date.now();
        
        // 缓存未过期，直接返回
        if (now - modificationTime < expireTime) {
          return cachedFile;
        }
      }
      
      // 缓存不存在或已过期，重新下载
      const downloadResult = await FileSystem.downloadAsync(url, cachedFile);
      
      if (downloadResult.status === 200) {
        return downloadResult.uri;
      } else {
        throw new Error(`下载图片失败: ${downloadResult.status}`);
      }
    } catch (err) {
      console.error('图片缓存失败:', err);
      throw err;
    }
  };

  /**
   * 加载并缓存图片
   */
  const loadImage = async () => {
    if (!imageUrl) {
      setCachedUri(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 处理一些特殊情况
      if (imageUrl.startsWith('data:')) {
        // 如果是base64图片，不需要缓存
        setCachedUri(imageUrl);
      } else if (imageUrl.startsWith('file:')) {
        // 如果是本地文件，不需要缓存
        setCachedUri(imageUrl);
      } else {
        // 网络图片，需要缓存
        let targetUrl = imageUrl;
        
        // 如果指定了宽高，可以优化图片URL（针对支持动态调整尺寸的服务）
        if (width && height && imageUrl.includes('?')) {
          // 这里假设API支持通过width和height参数调整图片大小
          targetUrl = `${imageUrl}&width=${width}&height=${height}`;
        }
        
        const uri = await cacheImage(targetUrl);
        setCachedUri(uri);
      }
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('图片缓存失败'));
      // 失败时使用原始URL
      setCachedUri(imageUrl);
      setLoading(false);
    } 
  };

  // 当图片URL变化时重新加载
  useEffect(() => {
    if (loadOnMount) {
      loadImage();
    }
  }, [imageUrl, width, height]);

  return {
    cachedUri,
    loading,
    error,
    originalUrl: imageUrl,
  };
}

/**
 * 清除所有图片缓存
 * @returns Promise<void>
 */
export const clearImageCache = async (): Promise<void> => {
  try {
    await FileSystem.deleteAsync(FileSystem.cacheDirectory!, { idempotent: true });
  } catch (error) {
    console.error('清除图片缓存失败:', error);
    throw error;
  }
}; 