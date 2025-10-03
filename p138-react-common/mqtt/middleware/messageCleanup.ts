import {cleanupExpiredMessageIds} from './messageDeduplication';

/**
 * 消息清理服务
 * 定期清理过期的消息ID缓存
 */
export class MessageCleanupService {
  private cleanupInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  /**
   * 启动清理服务
   * @param intervalMs 清理间隔（毫秒），默认1小时
   * @param maxAge 消息ID最大保存时间（毫秒），默认24小时
   */
  start(intervalMs: number = 60 * 60 * 1000, maxAge: number = 24 * 60 * 60 * 1000) {
    if (this.isRunning) {
      console.log('[MQTT] 消息清理服务已在运行中');
      return;
    }

    this.isRunning = true;
    console.log(`[MQTT] 启动消息清理服务，间隔: ${intervalMs}ms, 最大保存时间: ${maxAge}ms`);

    // 立即执行一次清理
    this.performCleanup(maxAge);

    // 设置定时清理
    this.cleanupInterval = setInterval(() => {
      this.performCleanup(maxAge);
    }, intervalMs);
  }

  /**
   * 停止清理服务
   */
  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    console.log('[MQTT] 消息清理服务已停止');
  }

  /**
   * 执行清理操作
   */
  private async performCleanup(maxAge: number) {
    try {
      console.log('[MQTT] 开始清理过期消息ID...');
      await cleanupExpiredMessageIds(maxAge);
      console.log('[MQTT] 消息ID清理完成');
    } catch (error) {
      console.error('[MQTT] 消息ID清理失败:', error);
    }
  }

  /**
   * 手动触发清理
   */
  async manualCleanup(maxAge: number = 24 * 60 * 60 * 1000) {
    await this.performCleanup(maxAge);
  }
}

// 创建全局清理服务实例
export const messageCleanupService = new MessageCleanupService(); 