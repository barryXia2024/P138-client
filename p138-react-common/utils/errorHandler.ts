/**
 * 错误处理工具
 * 
 * 提供统一的错误处理、错误类型分类和错误信息格式化
 */

/**
 * 错误类型枚举
 */
export enum ErrorType {
  NETWORK = 'network',   // 网络错误
  AUTH = 'auth',         // 认证/授权错误
  VALIDATION = 'validation', // 数据验证错误
  SERVER = 'server',     // 服务器错误
  CLIENT = 'client',     // 客户端错误
  BUSINESS = 'business', // 业务逻辑错误
  UNKNOWN = 'unknown',   // 未知错误
}

/**
 * 错误代码到错误信息的映射
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // 网络错误
  'network_error': '网络连接失败，请检查网络设置',
  'timeout_error': '请求超时，请稍后再试',
  'connection_error': '连接服务器失败',
  
  // 认证错误
  'auth_expired': '登录已过期，请重新登录',
  'auth_invalid': '登录信息无效，请重新登录',
  'auth_required': '请先登录后再操作',
  'auth_failed': '用户名或密码错误',
  
  // 权限错误
  'permission_denied': '没有权限执行此操作',
  'forbidden': '禁止访问该资源',
  
  // 服务器错误
  'server_error': '服务器错误，请稍后再试',
  'service_unavailable': '服务暂时不可用，请稍后再试',
  'gateway_error': '网关错误，请稍后再试',
  
  // 客户端错误
  'client_error': '客户端错误，请更新应用后再试',
  'version_outdated': '应用版本过低，请更新后再试',
  
  // 数据验证错误
  'validation_error': '数据验证失败，请检查输入',
  'invalid_format': '数据格式不正确',
  'required_field': '请填写必填项',
  
  // 资源错误
  'not_found': '请求的资源不存在',
  'resource_conflict': '资源冲突，请稍后再试',
  
  // 业务逻辑错误
  'insufficient_balance': '余额不足',
  'operation_failed': '操作失败，请稍后再试',
  
  // 默认错误
  'unknown_error': '发生未知错误，请稍后再试',
};

/**
 * 业务错误类
 * 用于封装业务逻辑相关的错误
 */
export class BusinessError extends Error {
  code: string;
  type: ErrorType;
  data?: any;
  
  constructor(message: string, code: string = 'business_error', type: ErrorType = ErrorType.BUSINESS, data?: any) {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
    this.type = type;
    this.data = data;
  }
}

/**
 * 网络错误类
 * 用于封装网络相关的错误
 */
export class NetworkError extends Error {
  code: string;
  type: ErrorType;
  status?: number;
  
  constructor(message: string, code: string = 'network_error', status?: number) {
    super(message);
    this.name = 'NetworkError';
    this.code = code;
    this.type = ErrorType.NETWORK;
    this.status = status;
  }
}

/**
 * 认证错误类
 * 用于封装认证/授权相关的错误
 */
export class AuthError extends Error {
  code: string;
  type: ErrorType;
  
  constructor(message: string, code: string = 'auth_error') {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.type = ErrorType.AUTH;
  }
}

/**
 * 从API响应中提取错误信息
 * @param error API错误对象
 * @returns 格式化后的错误信息对象
 */
export const extractErrorFromResponse = (error: any): {
  code: string;
  message: string;
  type: ErrorType;
  original: any;
} => {
  let code = 'unknown_error';
  let message = ERROR_MESSAGES.unknown_error;
  let type = ErrorType.UNKNOWN;
  
  if (error.isAxiosError) {
    // Axios错误
    if (error.response) {
      // 服务器响应错误
      const status = error.response.status;
      const data = error.response.data;
      
      code = data?.code || `http_${status}`;
      message = data?.message || ERROR_MESSAGES[code] || `服务器返回错误: ${status}`;
      
      // 根据HTTP状态码确定错误类型
      if (status === 401 || status === 403) {
        type = ErrorType.AUTH;
      } else if (status === 400 || status === 422) {
        type = ErrorType.VALIDATION;
      } else if (status >= 500) {
        type = ErrorType.SERVER;
      } else {
        type = ErrorType.CLIENT;
      }
    } else if (error.request) {
      // 请求发送但没有收到响应
      code = 'network_error';
      message = ERROR_MESSAGES.network_error;
      type = ErrorType.NETWORK;
    } else {
      // 请求配置出错
      code = 'client_error';
      message = error.message || ERROR_MESSAGES.client_error;
      type = ErrorType.CLIENT;
    }
  } else if (error instanceof BusinessError) {
    // 业务错误
    code = error.code;
    message = error.message;
    type = error.type;
  } else if (error instanceof NetworkError) {
    // 网络错误
    code = error.code;
    message = error.message;
    type = error.type;
  } else if (error instanceof AuthError) {
    // 认证错误
    code = error.code;
    message = error.message;
    type = error.type;
  } else if (error instanceof Error) {
    // 普通JavaScript错误
    code = 'client_error';
    message = error.message || ERROR_MESSAGES.client_error;
    type = ErrorType.CLIENT;
  } else if (typeof error === 'string') {
    // 字符串错误
    message = error;
  }
  
  return {
    code,
    message,
    type,
    original: error,
  };
};

/**
 * 处理API错误
 * @param error 错误对象
 * @param options 错误处理选项
 * @returns 格式化后的错误信息对象
 */
export const handleApiError = (error: any, options?: {
  defaultMessage?: string;
  logError?: boolean;
  showToast?: boolean;
  toastDuration?: number;
}): {
  code: string;
  message: string;
  type: ErrorType;
  original: any;
} => {
  const { 
    defaultMessage = '操作失败，请重试',
    logError = true,
    showToast = false,
    toastDuration = 3000,
  } = options || {};
  
  // 提取错误信息
  const errorInfo = extractErrorFromResponse(error);
  
  // 使用默认消息（如果需要）
  if (!errorInfo.message) {
    errorInfo.message = defaultMessage;
  }
  
  // 日志记录
  if (logError) {
    console.error(`[API Error] ${errorInfo.type}:${errorInfo.code} - ${errorInfo.message}`, error);
  }
  
  // 显示Toast提示
  if (showToast) {
    // 这里可以集成具体的Toast组件
    // 例如: Toast.show({ type: 'error', text: errorInfo.message, duration: toastDuration });
    // 或者集成到全局错误处理中
  }
  
  return errorInfo;
};

/**
 * 全局错误处理函数
 * 可以在应用入口处设置为全局错误处理器
 */
export const globalErrorHandler = (error: Error, errorInfo: React.ErrorInfo): void => {
  console.error('Global error:', error);
  console.error('Error info:', errorInfo);
  
  // 这里可以集成错误上报服务，如Sentry
  // Sentry.captureException(error, { extra: errorInfo });
  
  // 可以触发全局的错误提示UI
  // 例如: showErrorModal(error.message);
}; 