/**
 * P138通用API框架 - 中间件系统
 */

import {AxiosRequestConfig, AxiosResponse} from 'axios';

// 中间件上下文
export interface MiddlewareContext {
  request?: AxiosRequestConfig;
  response?: AxiosResponse;
  error?: any;
}

// 中间件接口
export interface Middleware {
  name: string;
  onRequest?: (context: MiddlewareContext) => Promise<void>;
  onResponse?: (context: MiddlewareContext) => Promise<void>;
  onError?: (context: MiddlewareContext) => Promise<void>;
}

// 中间件管理器
export class MiddlewareManager {
  private middlewares: Middleware[] = [];

  use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  remove(middlewareName: string): void {
    this.middlewares = this.middlewares.filter(m => m.name !== middlewareName);
  }

  async executeRequest(context: MiddlewareContext): Promise<void> {
    for (const middleware of this.middlewares) {
      if (middleware.onRequest) {
        await middleware.onRequest(context);
      }
    }
  }

  async executeResponse(context: MiddlewareContext): Promise<void> {
    for (const middleware of this.middlewares) {
      if (middleware.onResponse) {
        await middleware.onResponse(context);
      }
    }
  }

  async executeError(context: MiddlewareContext): Promise<void> {
    for (const middleware of this.middlewares) {
      if (middleware.onError) {
        await middleware.onError(context);
      }
    }
  }
} 