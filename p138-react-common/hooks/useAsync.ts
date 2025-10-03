/**
 * 异步操作Hook
 * 
 * 用于处理异步请求状态，封装加载、错误和数据状态
 */

import {useCallback, useEffect, useRef, useState} from 'react';

/**
 * 异步状态接口
 */
export interface AsyncState<T> {
  /** 数据 */
  data: T | null;
  /** 是否加载中 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
}

/**
 * 异步Hook返回值接口
 */
export interface UseAsyncReturn<T, P extends any[]> extends AsyncState<T> {
  /** 执行异步操作 */
  execute: (...params: P) => Promise<T>;
  /** 重置状态 */
  reset: () => void;
  /** 设置数据 */
  setData: (data: T | null) => void;
  /** 设置错误 */
  setError: (error: Error | null) => void;
}

/**
 * 异步操作Hook选项接口
 */
export interface UseAsyncOptions {
  /** 是否在初始挂载时执行 */
  executeOnMount?: boolean;
  /** 是否自动重置错误 */
  resetErrorOnExecute?: boolean;
}

/**
 * 异步操作Hook
 * 
 * @param asyncFunction 异步函数
 * @param options Hook选项
 * @returns 异步操作状态和控制函数
 */
export function useAsync<T, P extends any[] = []>(
  asyncFunction: (...params: P) => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T, P> {
  const { executeOnMount = false, resetErrorOnExecute = true } = options;
  
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });
  
  const mountedRef = useRef(true);
  const paramsRef = useRef<P>();
  
  // 重置状态
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);
  
  // 设置数据
  const setData = useCallback((data: T | null) => {
    setState(prevState => ({
      ...prevState,
      data,
    }));
  }, []);
  
  // 设置错误
  const setError = useCallback((error: Error | null) => {
    setState(prevState => ({
      ...prevState,
      error,
    }));
  }, []);
  
  // 执行异步操作
  const execute = useCallback(
    async (...params: P): Promise<T> => {
      paramsRef.current = params;
      
      if (resetErrorOnExecute) {
        setState(prevState => ({
          ...prevState,
          error: null,
          loading: true,
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          loading: true,
        }));
      }
      
      try {
        const data = await asyncFunction(...params);
        
        // 组件可能已卸载，避免状态更新
        if (mountedRef.current) {
          setState({
            data,
            loading: false,
            error: null,
          });
        }
        
        return data;
      } catch (error) {
        // 组件可能已卸载，避免状态更新
        if (mountedRef.current) {
          setState(prevState => ({
            ...prevState,
            loading: false,
            error: error instanceof Error ? error : new Error(String(error)),
          }));
        }
        
        throw error;
      }
    },
    [asyncFunction, resetErrorOnExecute]
  );
  
  // 在组件挂载时执行
  useEffect(() => {
    if (executeOnMount) {
      execute(...([] as unknown as P));
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [execute, executeOnMount]);
  
  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
  };
}

/**
 * 带缓存的异步操作Hook
 * 
 * @param asyncFunction 异步函数
 * @param cacheKey 缓存键，传入空字符串或null则不缓存
 * @param options Hook选项
 * @returns 异步操作状态和控制函数
 */
export function useCachedAsync<T, P extends any[] = []>(
  asyncFunction: (...params: P) => Promise<T>,
  cacheKey: string | null,
  options: UseAsyncOptions & { cacheTTL?: number } = {}
): UseAsyncReturn<T, P> {
  const { executeOnMount = false, resetErrorOnExecute = true, cacheTTL = 5 * 60 * 1000 } = options;
  
  const cache = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  
  const wrappedFunction = useCallback(
    async (...params: P): Promise<T> => {
      // 如果cacheKey有效且缓存中有数据
      if (cacheKey) {
        const cachedItem = cache.current.get(cacheKey);
        
        // 检查缓存是否有效
        if (cachedItem && Date.now() - cachedItem.timestamp < cacheTTL) {
          return cachedItem.data;
        }
      }
      
      // 没有有效缓存，执行异步操作
      const data = await asyncFunction(...params);
      
      // 如果cacheKey有效，保存到缓存
      if (cacheKey) {
        cache.current.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }
      
      return data;
    },
    [asyncFunction, cacheKey, cacheTTL]
  );
  
  return useAsync(wrappedFunction, { executeOnMount, resetErrorOnExecute });
}

/**
 * 并行执行多个异步操作Hook
 * 
 * @param asyncFunctions 异步函数数组
 * @returns 异步操作状态数组和控制函数
 */
export function useParallelAsync<T extends any[]>(
  asyncFunctions: (() => Promise<T[number]>)[]
): [AsyncState<T>, () => Promise<T>, () => void] {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });
  
  const execute = useCallback(async (): Promise<T> => {
    setState(prevState => ({
      ...prevState,
      loading: true,
      error: null,
    }));
    
    try {
      const results = await Promise.all(asyncFunctions.map(fn => fn()));
      
      setState({
        data: results as T,
        loading: false,
        error: null,
      });
      
      return results as T;
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }));
      
      throw error;
    }
  }, [asyncFunctions]);
  
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);
  
  return [state, execute, reset];
} 