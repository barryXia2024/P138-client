import {MqttMiddleware, MqttMiddlewareContext} from '../types';

import {traceLogMiddleware} from './traceLog';
import {
  cleanupExpiredMessageIds,
  clearCache,
  getCacheStats,
  initializeCache,
  messageDeduplicationMiddleware,
  reloadCache,
} from './messageDeduplication';
import {messageCleanupService} from './messageCleanup';

const internalMiddlewares: MqttMiddleware[] = [
  messageDeduplicationMiddleware, // 消息去重中间件，优先执行
  traceLogMiddleware,
];

export const runInternalMiddlewares = async (ctx: MqttMiddlewareContext) => {
  let index = -1;
  const run = async (i: number) => {
    if (i <= index) return;
    index = i;
    const mw = internalMiddlewares[i];
    if (mw) {
      try {
        console.log('runInternalMiddlewares', i, mw);
        await mw({...ctx, next: () => run(i + 1)});
      } catch (error) {
        console.error(`[MQTT] 中间件执行错误 (index: ${i}):`, error);
        // 中间件出错时继续执行下一个
        await run(i + 1);
      }
    } else {
      ctx.next();
    }
  };
  await run(0);
};

// 导出清理服务和缓存管理
export {
  messageCleanupService,
  getCacheStats,
  clearCache,
  cleanupExpiredMessageIds,
  initializeCache,
  reloadCache,
};
