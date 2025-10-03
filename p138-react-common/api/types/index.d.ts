

/**
 * P138通用API框架类型定义
 */

declare namespace P138Api {
  /**
   * 环境类型
   */
  type Environment = 'development' | 'test' | 'staging' | 'production';

  /**
   * 设备ID生成器接口
   */
  interface IDeviceIdGenerator {
    /**
     * 获取或创建设备ID
     */
    getOrCreateDeviceId(): Promise<string>;
    /**
     * 通过用户ID获取设备ID 
     */
    getDeviceIdWithUserName(userName?: string): Promise<string>;
    /**
     * 获取设备ID
     */
    generateSnowflakeId(): string;
    
    /**
     * 清除设备ID
     */
    clearDeviceId(): Promise<void>;
  }

  /**
   * 基础配置接口
   */
  interface IBaseConfig {
    baseURL: string;
    timeout?: number;
    header?: Record<string, string>;
    isWeb?: boolean;
    ignoreAuth?: boolean;
    storage: {
      getItem: (key: string) => Promise<string | null>;
      setItem: (key: string, value: string) => Promise<void>;
      removeItem: (key: string) => Promise<void>;
    };
    toast: {
      show: (message: string) => void;
      error: (message: string) => void;
      success: (message: string) => void;
    };
    logout: () => void;
    onShowToast?: (message: string) => void;
    onLogout?: () => void;
    refreshTokenApi: (refreshToken: string) => Promise<{ success: boolean, data: ServerCommonAuth.OAuthToken }>;
    
  }

  /**
   * 平台配置
   */
  interface IPlatformConfig extends IBaseConfig {
    // 存储相关
    storage: {
      getItem: (key: string) => Promise<string | null>;
      setItem: (key: string, value: string) => Promise<void>;
      removeItem: (key: string) => Promise<void>;
    };
    // 提示相关
    toast: {
      show: (message: string) => void;
      error: (message: string) => void;
      success: (message: string) => void;
    };
    // 登出相关
    logout: () => void;
  }

  /**
   * API响应
   */
  interface IApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
  }

  /**
   * 请求配置接口
   */
  interface IRequestProps<TQuery = Record<string, any>, TData = Record<string, any>, THeader = Record<string, string>> {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    query?: TQuery;
    data?: TData;
    header?: THeader;
    ignoreAuth?: boolean;
    skipErrorHandler?: boolean;
    skipTokenHandler?: boolean;
  }

  /**
   * 中间件上下文
   */
  interface IMiddlewareContext {
    request?: {
      method: string;
      url: string;
      params?: Record<string, any>;
      data?: any;
      header?: Record<string, string>;
    };
    response?: any;
    error?: any;
    isRetry?: boolean;
    config: IBaseConfig;
    ignoreAuth?: boolean;
  }

  /**
   * 中间件接口
   */
  interface IMiddleware {
    name: string;
    onRequest?: (context: IMiddlewareContext) => Promise<void>;
    onResponse?: (context: IMiddlewareContext) => Promise<void>;
    onError?: (context: IMiddlewareContext) => Promise<void>;
  }

  /**
   * API客户端接口
   */
  interface IApiClient {
    client: any;
    use: (middleware: IMiddleware) => void;
    request: <TResponse = any, TQuery = Record<string, any>, TData = Record<string, any>, THeader = Record<string, string>>(
      props: IRequestProps<TQuery, TData, THeader>
    ) => Promise<TResponse>;
  }
} 