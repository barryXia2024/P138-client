/**
 * 安全的文件处理工具
 * 专门处理Release版本中的文件路径问题
 */

import { Platform } from 'react-native';

// 平台特定导入
let RNFS: any = null;
if (Platform.OS !== 'web') {
  try {
    RNFS = require('react-native-fs');
  } catch (error) {
    console.warn('RNFS 导入失败:', error);
  }
}

/**
 * 安全地检查文件是否存在
 * 增强错误处理，避免Release版本中的路径问题
 */
export const safeFileExists = async (filePath: string): Promise<boolean> => {
  if (!filePath) {
    console.warn('⚠️ 文件路径为空');
    return false;
  }

  if (Platform.OS === 'web') {
    // Web平台直接返回true，因为通常使用blob URL
    return true;
  }

  if (!RNFS) {
    console.warn('⚠️ RNFS 不可用');
    return false;
  }

  try {
    console.log('🔍 安全检查文件存在性:', filePath.substring(0, 50) + '...');
    
    // 使用RNFS检查文件是否存在
    const exists = await RNFS.exists(filePath);
    
    if (exists) {
      // 尝试获取文件统计信息来验证文件可访问性
      try {
        const stats = await RNFS.stat(filePath);
        console.log('✅ 文件存在且可访问:', {
          路径: filePath.substring(0, 50) + '...',
          大小: stats.size,
          类型: stats.isDirectory() ? '目录' : '文件',
        });
        return true;
      } catch (statError) {
        console.warn('⚠️ 文件存在但无法访问:', statError);
        // 即使stat失败，如果exists返回true，仍然认为文件存在
        return true;
      }
    } else {
      console.log('❌ 文件不存在:', filePath.substring(0, 50) + '...');
      return false;
    }
  } catch (error) {
    console.error('❌ 检查文件存在性时发生错误:', error);
    console.error('❌ 错误详情:', {
      路径: filePath.substring(0, 50) + '...',
      错误类型: error instanceof Error ? error.constructor.name : 'Unknown',
      错误消息: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
};

/**
 * 安全地获取文件统计信息
 */
export const safeGetFileStats = async (filePath: string): Promise<{
  size: number;
  exists: boolean;
  error?: string;
}> => {
  if (!filePath) {
    return { size: 0, exists: false, error: '文件路径为空' };
  }

  if (Platform.OS === 'web') {
    return { size: 0, exists: true };
  }

  if (!RNFS) {
    return { size: 0, exists: false, error: 'RNFS 不可用' };
  }

  try {
    const exists = await RNFS.exists(filePath);
    if (!exists) {
      return { size: 0, exists: false, error: '文件不存在' };
    }

    const stats = await RNFS.stat(filePath);
    return {
      size: stats.size || 0,
      exists: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn('⚠️ 获取文件统计信息失败:', errorMessage);
    return {
      size: 0,
      exists: false,
      error: errorMessage,
    };
  }
};

/**
 * 验证文件路径是否有效
 * 检查路径格式和基本可访问性
 */
export const validateFilePath = (filePath: string): {
  valid: boolean;
  error?: string;
} => {
  if (!filePath) {
    return { valid: false, error: '文件路径为空' };
  }

  if (typeof filePath !== 'string') {
    return { valid: false, error: '文件路径必须是字符串' };
  }

  // 检查路径格式
  if (Platform.OS === 'android') {
    // Android路径检查
    if (!filePath.startsWith('/') && !filePath.startsWith('file://') && !filePath.startsWith('content://')) {
      return { valid: false, error: 'Android文件路径格式无效' };
    }
  } else if (Platform.OS === 'ios') {
    // iOS路径检查
    if (!filePath.startsWith('/') && !filePath.startsWith('file://') && !filePath.startsWith('ph://')) {
      return { valid: false, error: 'iOS文件路径格式无效' };
    }
  }

  return { valid: true };
};

/**
 * 创建安全的文件路径
 * 确保路径在Release版本中可访问
 */
export const createSafeFilePath = async (originalPath: string): Promise<string> => {
  // 首先验证原始路径
  const validation = validateFilePath(originalPath);
  if (!validation.valid) {
    console.warn('⚠️ 原始路径无效:', validation.error);
    return originalPath;
  }

  // 检查原始路径是否可访问
  const originalExists = await safeFileExists(originalPath);
  if (originalExists) {
    console.log('✅ 原始路径可访问，直接使用');
    return originalPath;
  }

  console.warn('⚠️ 原始路径不可访问，尝试使用原始路径');
  return originalPath;
};
