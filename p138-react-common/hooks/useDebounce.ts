/**
 * 防抖Hook
 * 
 * 用于处理需要防抖的值，避免频繁更新
 */

import {useEffect, useRef, useState} from 'react';

/**
 * 防抖Hook，返回一个防抖后的值
 * 
 * @param value 需要防抖的值
 * @param delay 防抖延迟时间（毫秒）
 * @returns 防抖后的值
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    // 设置一个定时器，在指定延迟后更新debouncedValue
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // 在下一次effect运行前或组件卸载时清除定时器
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * 防抖函数Hook，返回一个防抖后的函数
 * 
 * @param fn 需要防抖的函数
 * @param delay 防抖延迟时间（毫秒）
 * @param deps 依赖数组，当依赖变化时重新创建防抖函数
 * @returns 防抖后的函数
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  deps: any[] = []
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 清除之前的定时器
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
  return useRef((...args: Parameters<T>) => {
    clearTimer();
    
    timeoutRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }).current;
}

/**
 * 防抖函数Hook，支持立即执行
 * 
 * @param fn 需要防抖的函数
 * @param delay 防抖延迟时间（毫秒）
 * @param options 配置选项
 * @param deps 依赖数组，当依赖变化时重新创建防抖函数
 * @returns 防抖后的函数和取消函数
 */
export function useDebouncedFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  options?: { leading?: boolean },
  deps: any[] = []
): [(...args: Parameters<T>) => void, () => void] {
  const { leading = false } = options || {};
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstCall = useRef(true);
  
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
  
  // 创建防抖函数
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFn = useRef((...args: Parameters<T>) => {
    // 如果是第一次调用且需要立即执行
    if (leading && isFirstCall.current) {
      isFirstCall.current = false;
      fn(...args);
      return;
    }
    
    // 清除之前的定时器
    cancel();
    
    // 设置新的定时器
    timeoutRef.current = setTimeout(() => {
      fn(...args);
      isFirstCall.current = true;
    }, delay);
  }).current;
  
  return [debouncedFn, cancel];
} 