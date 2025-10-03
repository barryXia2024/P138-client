/**
 * MQTT 消息去重功能使用示例
 * 
 * 这个文件展示了如何在应用中使用消息去重功能
 */

import {cleanupExpiredMessageIds, clearCache, getCacheStats, messageCleanupService} from './index';

/**
 * 应用启动时初始化消息清理服务
 */
export function initializeMessageCleanup() {
  // 启动清理服务
  // 参数1: 清理间隔（毫秒），默认1小时
  // 参数2: 消息ID最大保存时间（毫秒），默认24小时
  messageCleanupService.start(
    60 * 60 * 1000,  // 每小时清理一次
    24 * 60 * 60 * 1000  // 消息ID保存24小时
  );
  
  console.log('[MQTT] 消息清理服务已启动');
}

/**
 * 应用关闭时停止消息清理服务
 */
export function cleanupMessageService() {
  messageCleanupService.stop();
  console.log('[MQTT] 消息清理服务已停止');
}

/**
 * 手动清理过期消息ID（可选）
 */
export async function manualCleanup() {
  try {
    await messageCleanupService.manualCleanup(24 * 60 * 60 * 1000);
    console.log('[MQTT] 手动清理完成');
  } catch (error) {
    console.error('[MQTT] 手动清理失败:', error);
  }
}

/**
 * 获取缓存统计信息
 */
export function getCacheStatistics() {
  const stats = getCacheStats();
  console.log('[MQTT] 缓存统计:', {
    缓存大小: stats.size,
    是否已加载: stats.loaded,
    最旧消息年龄: `${Math.round(stats.oldestAge / 1000 / 60)}分钟`,
    最新消息年龄: `${Math.round(stats.newestAge / 1000 / 60)}分钟`,
    平均年龄: `${Math.round(stats.averageAge / 1000 / 60)}分钟`
  });
  return stats;
}

/**
 * 手动清空缓存
 */
export function clearMessageCache() {
  clearCache();
  console.log('[MQTT] 手动清空缓存完成');
}

/**
 * 手动清理过期消息ID
 */
export async function cleanupExpiredMessages(maxAge: number = 24 * 60 * 60 * 1000) {
  try {
    await cleanupExpiredMessageIds(maxAge);
    console.log('[MQTT] 手动清理过期消息完成');
  } catch (error) {
    console.error('[MQTT] 手动清理过期消息失败:', error);
  }
}

/**
 * 在React Native应用中的使用示例
 */
export function setupInReactNative() {
  // 在应用启动时调用
  initializeMessageCleanup();
  
  // 在应用关闭时调用（通常在AppState监听器中）
  // AppState.addEventListener('change', (nextAppState) => {
  //   if (nextAppState === 'background' || nextAppState === 'inactive') {
  //     cleanupMessageService();
  //   }
  // });
}

/**
 * 在Web应用中的使用示例
 */
export function setupInWeb() {
  // 在应用启动时调用
  initializeMessageCleanup();
  
  // 在页面卸载时停止服务
  window.addEventListener('beforeunload', () => {
    cleanupMessageService();
  });
}

// 使用示例：
// 
// 1. 在应用入口文件中导入并初始化：
// import { initializeMessageCleanup, cleanupMessageService } from 'p138-react-common/mqtt/middleware/usage-example';
// 
// // 应用启动时
// initializeMessageCleanup();
// 
// // 应用关闭时
// cleanupMessageService();
// 
// 2. 消息去重功能会自动工作，无需额外配置
// 
// 3. 如果需要手动清理，可以调用：
// import { manualCleanup } from 'p138-react-common/mqtt/middleware/usage-example';
// await manualCleanup();
//
// 4. 缓存管理功能：
// import { getCacheStatistics, clearMessageCache, cleanupExpiredMessages } from 'p138-react-common/mqtt/middleware/usage-example';
// const stats = getCacheStatistics(); // 获取详细缓存统计
// clearMessageCache(); // 手动清空缓存
// await cleanupExpiredMessages(); // 手动清理过期消息 