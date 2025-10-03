import {MqttMiddlewareContext} from '../types';
import {log} from '../debug';

export const traceLogMiddleware = (ctx: MqttMiddlewareContext) => {
  const tag = ctx.direction === 'incoming' ? '📥 收到' : '📤 发送';
  log(`[${tag}] [${ctx.topic}] [${ctx.logKey ?? '-'}]`, ctx.payload);
  ctx.next();
};
