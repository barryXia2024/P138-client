/**
 * 工具函数导出入口
 * 
 * 统一导出所有工具函数，便于使用
 */

// 日期时间工具
export * from './dateUtils';

// 数值工具
export * from './numberUtils';

// 错误处理工具
export * from './errorHandler';

// 表单验证工具
export * from './validationUtils';

// 设备信息工具（注意：仅在需要时导入，因为可能有依赖问题）
// export * from './deviceUtils';

/**
 * 生成UUID
 * @returns UUID字符串
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 拷贝后的新对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any;
  }

  if (obj instanceof Object) {
    const copy: Record<string, any> = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone((obj as Record<string, any>)[key]);
    });
    return copy as T;
  }

  return obj;
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null;

  return function(this: any, ...args: Parameters<T>): void {
    const context = this;

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 节流时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastFunc: NodeJS.Timeout | undefined;
  let lastRan: number = 0;

  return function(this: any, ...args: Parameters<T>): void {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * 为字符串首字母大写
 * @param str 字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 判断对象是否为空对象
 * @param obj 要判断的对象
 * @returns 是否为空对象
 */
export function isEmptyObject(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * 获取对象的安全属性，避免空指针异常
 * @param obj 目标对象
 * @param path 属性路径，如 "user.profile.name"
 * @param defaultValue 默认值
 * @returns 属性值或默认值
 */
export function getProperty<T>(
  obj: any,
  path: string,
  defaultValue: T
): T {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result === undefined || result === null || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }

  return (result === undefined || result === null) ? defaultValue : result;
}

/**
 * 将图片转换为Base64
 * 
 * 注意：此功能在Web/Expo实现可能不同
 * @param uri 图片URI
 * @returns Promise<string> Base64字符串
 */
export async function getBase64FromUri(uri: string): Promise<string> {
  try {
    // 实际项目中应该使用适当的库来实现
    // 例如： FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    throw new Error('未实现');
  } catch (error) {
    console.error('转换Base64失败:', error);
    throw error;
  }
}

/**
 * 随机数生成函数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机数
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 