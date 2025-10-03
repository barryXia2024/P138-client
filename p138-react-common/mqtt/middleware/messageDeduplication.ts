import {storageAdapter} from '@/p138-react-common/api/platforms/storage';
import {MqttMiddlewareContext} from '../types';

const MESSAGE_ID_STORAGE_KEY = 'mqtt_message_ids';
const MAX_STORED_MESSAGE_IDS = 1000; // 最大存储消息ID数量
const MESSAGE_RETENTION_DAYS = 7; // 消息保留7天
const MESSAGE_RETENTION_MS = MESSAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000; // 7天的毫秒数

interface StoredMessageIds {
  ids: Set<string>;
  timestamp: number;
}

// 内存缓存
class MessageIdCache {
  private cache: Map<string, number> = new Map(); // messageId -> timestamp
  private isLoaded = false;
  private loadingPromise: Promise<void> | null = null;

  /**
   * 检查消息ID是否存在于缓存中
   */
  has(messageId: string): boolean {
    return this.cache.has(messageId);
  }

  /**
   * 添加消息ID到缓存
   */
  add(messageId: string): void {
    this.cache.set(messageId, Date.now());
  }

  /**
   * 从缓存中删除消息ID
   */
  delete(messageId: string): void {
    this.cache.delete(messageId);
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
    this.isLoaded = false;
  }

  /**
   * 获取缓存大小
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * 检查缓存是否已加载
   */
  get loaded(): boolean {
    return this.isLoaded;
  }

  /**
   * 从本地存储加载消息ID到缓存
   */
  async loadFromStorage(): Promise<void> {
    if (this.isLoaded) return;

    // 如果正在加载，等待加载完成
    if (this.loadingPromise) {
      await this.loadingPromise;
      return;
    }

    this.loadingPromise = this._loadFromStorage();
    await this.loadingPromise;
  }

  /**
   * 确保缓存已加载（每次调用都会检查，确保浏览器刷新后能恢复）
   */
  async ensureLoaded(): Promise<void> {
    // 如果缓存为空且标记为已加载，说明可能是浏览器刷新导致的
    if (this.isLoaded && this.cache.size === 0) {
      console.log('[MQTT] 检测到缓存为空，重新加载本地存储数据');
      this.isLoaded = false; // 重置加载状态
    }

    // 如果缓存为空，强制重新加载
    if (this.cache.size === 0) {
      console.log('[MQTT] 缓存为空，强制重新加载本地存储数据');
      this.isLoaded = false;
    }

    await this.loadFromStorage();

    // 加载后不清理本地存储，保持7天数据
    console.log(
      `[MQTT] 缓存加载完成，共${this.cache.size}个消息ID（本地存储保留7天）`,
    );
  }

  private async _loadFromStorage(): Promise<void> {
    try {
      const stored = await storageAdapter.getItem(MESSAGE_ID_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map();

        // 处理新的对象格式数据
        if (
          data.ids &&
          typeof data.ids === 'object' &&
          !Array.isArray(data.ids)
        ) {
          // 新格式：{ids: {id: timestamp}, timestamp: number}
          Object.entries(data.ids).forEach(([id, timestamp]) => {
            if (id && typeof timestamp === 'number') {
              this.cache.set(id, timestamp);
            }
          });
        } else if (
          Array.isArray(data.ids) &&
          data.ids.length > 0 &&
          typeof data.ids[0] === 'object'
        ) {
          // 兼容旧格式：{ids: [{id: string, timestamp: number}], timestamp: number}
          data.ids.forEach((item: {id: string; timestamp: number}) => {
            if (item.id && item.timestamp) {
              this.cache.set(item.id, item.timestamp);
            }
          });
        } else if (Array.isArray(data.ids)) {
          // 兼容更旧格式：{ids: string[], timestamp: number}
          data.ids.forEach((id: string) => {
            if (id) {
              this.cache.set(id, data.timestamp || Date.now());
            }
          });
        }

        console.log(
          `[MQTT] 从本地存储加载了${this.cache.size}个消息ID（保留7天数据）`,
        );
      }
      this.isLoaded = true;
    } catch (error) {
      console.error('[MQTT] 缓存加载失败:', error);
      this.isLoaded = true; // 即使失败也标记为已加载，避免重复尝试
    } finally {
      this.loadingPromise = null;
    }
  }

  /**
   * 保存缓存到本地存储
   */
  async saveToStorage(): Promise<void> {
    try {
      // 将Map直接转换为对象格式存储，id作为key
      const data = {
        ids: Object.fromEntries(this.cache),
        timestamp: Date.now(),
      };

      await storageAdapter.setItem(
        MESSAGE_ID_STORAGE_KEY,
        JSON.stringify(data),
      );
    } catch (error) {
      console.error('[MQTT] 缓存保存失败:', error);
    }
  }

  /**
   * 批量添加消息ID
   */
  addBatch(messageIds: string[]): void {
    const now = Date.now();
    messageIds.forEach(id => this.cache.set(id, now));
  }

  /**
   * 获取所有消息ID
   */
  getAll(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * 获取消息ID的时间戳
   */
  getTimestamp(messageId: string): number | undefined {
    return this.cache.get(messageId);
  }

  /**
   * 清理过期的消息ID（基于时间，仅在内存缓存中清理，不清理本地存储）
   */
  cleanupExpired(maxAge: number = MESSAGE_RETENTION_MS): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [messageId, timestamp] of this.cache.entries()) {
      if (now - timestamp > maxAge) {
        this.cache.delete(messageId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(
        `[MQTT] 从内存缓存中清理了${cleanedCount}个过期的消息ID（保留本地存储）`,
      );
    }

    return cleanedCount;
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    const oldest =
      entries.length > 0 ? Math.min(...entries.map(([, ts]) => ts)) : 0;
    const newest =
      entries.length > 0 ? Math.max(...entries.map(([, ts]) => ts)) : 0;

    return {
      size: this.cache.size,
      loaded: this.isLoaded,
      oldestAge: oldest > 0 ? now - oldest : 0,
      newestAge: newest > 0 ? now - newest : 0,
      averageAge:
        entries.length > 0
          ? entries.reduce((sum, [, ts]) => sum + (now - ts), 0) /
            entries.length
          : 0,
    };
  }
}

// 全局缓存实例
const messageIdCache = new MessageIdCache();

// 页面可见性检测（处理浏览器刷新和页面切换）
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // 页面重新可见时，重新加载缓存
      console.log('[MQTT] 页面重新可见，重新加载缓存');
      messageIdCache.ensureLoaded().catch(error => {
        console.error('[MQTT] 页面可见性变化时重新加载缓存失败:', error);
      });
    }
  });
}

/**
 * 消息去重中间件
 * 检查消息ID是否已存在，如果存在则跳过处理
 */
export const messageDeduplicationMiddleware = async (
  ctx: MqttMiddlewareContext,
) => {
  // 只对接收到的消息进行去重处理
  if (ctx.direction !== 'incoming') {
    ctx.next();
    return;
  }

  try {
    // 确保缓存已加载（每次都会检查，确保浏览器刷新后能恢复）
    await messageIdCache.ensureLoaded();

    // 从payload中提取messageId
    const messageId = extractMessageId(ctx.payload);
    console.log('messageId', messageId);
    if (!messageId) {
      // 如果没有messageId，直接继续处理
      ctx.next();
      return;
    }

    // 首先检查缓存（快速检查）
    if (messageIdCache.has(messageId)) {
      console.log(`[MQTT] 跳过重复消息(缓存): ${messageId}`);
      return;
    }

    // 如果缓存中没有，再检查本地存储（备用检查）
    const isDuplicate = await checkMessageIdExists(messageId);

    if (isDuplicate) {
      console.log(`[MQTT] 跳过重复消息(存储): ${messageId}`);
      // 将消息ID添加到缓存中，避免下次重复检查
      messageIdCache.add(messageId);
      return;
    }

    // 存储新的消息ID到缓存和本地存储
    await storeMessageIdWithCache(messageId);

    // 继续处理消息
    ctx.next();
  } catch (error) {
    console.error('[MQTT] 消息去重中间件错误:', error);
    // 发生错误时继续处理消息
    ctx.next();
  }
};

/**
 * 从payload中提取messageId
 */
function extractMessageId(payload: any): string | null {
  if (!payload) return null;

  // 尝试从不同位置提取messageId
  if (typeof payload === 'object') {
    // 直接包含messageId
    if (payload.msgID) return payload.msgID;
    if (payload.messageId) return payload.messageId;
    if (payload.messageID) return payload.messageID;
    if (payload.message_id) return payload.message_id;
    if (payload.id) return payload.id;

    // 从data字段中提取
    if (payload.data && typeof payload.data === 'object') {
      if (payload.messageID) return payload.messageID;
      if (payload.msgID) return payload.msgID;
      if (payload.data.messageId) return payload.data.messageId;
      if (payload.data.message_id) return payload.data.message_id;
      if (payload.data.id) return payload.data.id;
    }
  } else if (typeof payload === 'string') {
    const json = JSON.parse(payload);
    console.log('json', json);
    // 直接包含messageId
    if (json.msgID) return json.msgID;
    if (json.messageId) return json.messageId;
    if (json.messageID) return json.messageID;
    if (json.message_id) return json.message_id;
    if (json.id) return json.id;

    // 从data字段中提取
    if (json.data && typeof json.data === 'object') {
      if (json.data.messageID) return json.data.messageID;
      if (json.data.msgID) return json.data.msgID;
      if (json.data.messageId) return json.data.messageId;
      if (json.data.message_id) return json.data.message_id;
      if (json.data.id) return json.data.id;
    }
  }

  return null;
}

/**
 * 检查消息ID是否已存在
 */
async function checkMessageIdExists(messageId: string): Promise<boolean> {
  try {
    const stored = await storageAdapter.getItem(MESSAGE_ID_STORAGE_KEY);
    if (!stored) return false;

    const data: StoredMessageIds = JSON.parse(stored);
    // 从存储的数据中重建Set
    const idsSet = new Set(Array.isArray(data.ids) ? data.ids : []);
    return idsSet.has(messageId);
  } catch (error) {
    console.error('[MQTT] 检查消息ID失败:', error);
    return false;
  }
}

/**
 * 存储消息ID（带缓存）
 */
async function storeMessageIdWithCache(messageId: string): Promise<void> {
  try {
    // 添加到缓存
    messageIdCache.add(messageId);

    // 立即保存到本地存储（确保浏览器刷新后数据不丢失）
    // 注意：不清理本地存储，保持7天数据
    await messageIdCache.saveToStorage();
  } catch (error) {
    console.error('[MQTT] 存储消息ID失败:', error);
  }
}

/**
 * 存储消息ID（原有函数，保持兼容性）
 */
async function storeMessageId(messageId: string): Promise<void> {
  return storeMessageIdWithCache(messageId);
}

/**
 * 清理过期的消息ID（仅在内存缓存中清理，不清理本地存储）
 */
export async function cleanupExpiredMessageIds(
  maxAge: number = MESSAGE_RETENTION_MS,
): Promise<void> {
  try {
    // 仅在内存缓存中清理过期数据，不清理本地存储
    const cleanedCount = messageIdCache.cleanupExpired(maxAge);

    if (cleanedCount > 0) {
      console.log(
        `[MQTT] 从内存缓存中清理了${cleanedCount}个过期的消息ID（本地存储保留7天）`,
      );
    }
  } catch (error) {
    console.error('[MQTT] 清理过期消息ID失败:', error);
  }
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats() {
  return messageIdCache.getStats();
}

/**
 * 手动清空缓存
 */
export function clearCache() {
  messageIdCache.clear();
  console.log('[MQTT] 手动清空消息ID缓存');
}

/**
 * 初始化缓存（在应用启动时调用）
 */
export async function initializeCache(): Promise<void> {
  try {
    console.log('[MQTT] 初始化消息ID缓存');
    await messageIdCache.ensureLoaded();
    console.log(`[MQTT] 缓存初始化完成，共${messageIdCache.size}个消息ID`);
  } catch (error) {
    console.error('[MQTT] 缓存初始化失败:', error);
  }
}

/**
 * 强制重新加载缓存
 */
export async function reloadCache(): Promise<void> {
  try {
    console.log('[MQTT] 强制重新加载缓存');
    messageIdCache.clear();
    await messageIdCache.ensureLoaded();
    console.log(`[MQTT] 缓存重新加载完成，共${messageIdCache.size}个消息ID`);
  } catch (error) {
    console.error('[MQTT] 缓存重新加载失败:', error);
  }
}