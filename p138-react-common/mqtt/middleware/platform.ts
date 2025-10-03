import {MqttMiddlewareContext} from '../types';

export const addPlatformFieldMiddleware = (ctx: MqttMiddlewareContext) => {
  if (ctx.direction === 'outgoing' && typeof ctx.payload === 'object') {
    ctx.payload.platform = 'client';
  }
  ctx.next();
};
