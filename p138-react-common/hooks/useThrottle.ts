/**
 * 节流Hook
 * 
 * 用于限制函数调用频率，确保函数在指定时间内最多执行一次
 */

import {useCallback, useEffect, useRef, useState} from 'react';

/**
 * 节流Hook，返回一个节流后的值
 * 
 * @param value 需要节流的值
 * @param delay 节流延迟时间（毫秒）
 * @returns 节流后的值
 */
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());
  
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;
    
    if (timeSinceLastExecution >= delay) {
      // 如果自上次执行以来的时间超过了延迟时间，则立即更新值
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      // 否则，设置一个定时器在剩余时间后更新值
      const remainingTime = delay - timeSinceLastExecution;
      const timerId = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, remainingTime);
      
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [value, delay]);
  
  return throttledValue;
}

/**
 * 节流函数Hook，返回一个节流后的函数
 * 
 * @param fn 需要节流的函数
 * @param delay 节流延迟时间（毫秒）
 * @param deps 依赖数组，当依赖变化时重新创建节流函数
 * @returns 节流后的函数
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  deps: any[] = []
): (...args: Parameters<T>) => void {
  const lastExecuted = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const argsRef = useRef<Parameters<T> | null>(null);
  
  // 清除定时器
  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  
  // 在组件卸载时清除定时器
  useEffect(() => {
    return clearTimer;
  }, []);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((...args: Parameters<T>) => {
    argsRef.current = args;
    const now = Date.now();
    const elapsed = now - lastExecuted.current;
    
    if (elapsed >= delay) {
      // 如果已经超过节流时间，立即执行
      fn(...args);
      lastExecuted.current = now;
    } else if (!timeoutRef.current) {
      // 如果没有超过节流时间且没有待执行的定时器，设置一个定时器
      const remainingTime = delay - elapsed;
      timeoutRef.current = setTimeout(() => {
        if (argsRef.current) {
          fn(...argsRef.current);
        }
        lastExecuted.current = Date.now();
        timeoutRef.current = null;
      }, remainingTime);
    }
  }, [fn, delay, ...deps]);
}

/**
 * 节流函数Hook，支持取消功能
 * 
 * @param fn 需要节流的函数
 * @param delay 节流延迟时间（毫秒）
 * @param options 配置选项
 * @param deps 依赖数组，当依赖变化时重新创建节流函数
 * @returns [节流后的函数, 取消函数]
 */
export function useThrottledFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  options?: { leading?: boolean; trailing?: boolean },
  deps: any[] = []
): [(...args: Parameters<T>) => void, () => void] {
  const { leading = true, trailing = true } = options || {};
  const lastExecuted = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const argsRef = useRef<Parameters<T> | null>(null);
  
  // 清除定时器的函数
  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  
  // 在组件卸载时清除定时器
  useEffect(() => {
    return cancel;
  }, []);
  
  // 创建节流函数
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledFn = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const elapsed = now - lastExecuted.current;
    argsRef.current = args;
    
    // 如果是第一次调用或已经超过节流时间，且需要在开始时执行
    if ((elapsed >= delay || lastExecuted.current === 0) && leading) {
      fn(...args);
      lastExecuted.current = now;
      return;
    }
    
    // 如果需要在结束时执行，且没有待执行的定时器
    if (trailing && !timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        if (argsRef.current) {
          fn(...argsRef.current);
        }
        lastExecuted.current = Date.now();
        timeoutRef.current = null;
      }, delay - elapsed);
    }
  }, [fn, delay, leading, trailing, ...deps]);
  
  return [throttledFn, cancel];
} 