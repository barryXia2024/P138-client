/**
 * 交叉观察器Hook
 * 
 * 用于检测元素是否在视口中，常用于无限滚动、懒加载等场景
 */

import {useCallback, useEffect, useRef, useState} from 'react';

/**
 * 交叉观察器选项接口
 */
export interface IntersectionObserverOptions {
  /** 根元素，默认为浏览器视口 */
  root?: Element | Document | null;
  /** 根元素的边距 */
  rootMargin?: string;
  /** 交叉比例阈值 */
  threshold?: number | number[];
  /** 是否在初始化时即开始观察 */
  initiallyVisible?: boolean;
  /** 是否只触发一次 */
  triggerOnce?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 交叉观察器Hook，用于检测元素是否在视口中
 * 
 * @param options 交叉观察器配置选项
 * @returns [ref回调函数, 是否可见, 交叉观察器实例]
 */
export function useIntersectionObserver<T extends Element = Element>({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  initiallyVisible = false,
  triggerOnce = false,
  disabled = false,
}: IntersectionObserverOptions = {}): [
  (node: T | null) => void,
  boolean,
  IntersectionObserver | null
] {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [node, setNode] = useState<T | null>(null);
  const [isVisible, setIsVisible] = useState(initiallyVisible);
  
  // 交叉观察器回调
  const handleObserve = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setEntry(entry);
      
      const isIntersecting = entry.isIntersecting;
      setIsVisible(isIntersecting);
      
      // 如果设置了triggerOnce且元素已经进入视口，则取消观察
      if (triggerOnce && isIntersecting && observerRef.current && node) {
        observerRef.current.unobserve(node);
      }
    },
    [triggerOnce, node]
  );
  
  // 设置被观察节点的回调函数
  const ref = useCallback(
    (node: T | null) => {
      if (disabled) return;
      
      // 如果已有观察器且正在观察节点，先取消观察
      if (observerRef.current && node) {
        observerRef.current.disconnect();
      }
      
      // 创建新的观察器
      observerRef.current = new IntersectionObserver(handleObserve, {
        root,
        rootMargin,
        threshold,
      });
      
      // 保存节点引用
      setNode(node);
      
      // 如果有节点，开始观察
      if (node) {
        observerRef.current.observe(node);
      }
    },
    [disabled, root, rootMargin, threshold, handleObserve]
  );
  
  // 在组件卸载或依赖变化时清理观察器
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  return [ref, isVisible, observerRef.current];
}

/**
 * 简化版的交叉观察器Hook
 * 
 * @param options 交叉观察器配置选项
 * @returns [ref对象, 是否可见]
 */
export function useIsVisible<T extends Element = Element>(
  options: IntersectionObserverOptions = {}
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(options.initiallyVisible || false);
  
  useEffect(() => {
    if (options.disabled || !ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        
        // 如果设置了triggerOnce且元素已经进入视口，则取消观察
        if (options.triggerOnce && entry.isIntersecting && ref.current) {
          observer.unobserve(ref.current);
        }
      },
      {
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
        threshold: options.threshold || 0,
      }
    );
    
    observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
    };
  }, [
    options.root,
    options.rootMargin,
    options.threshold,
    options.triggerOnce,
    options.disabled,
  ]);
  
  return [ref, isVisible];
} 