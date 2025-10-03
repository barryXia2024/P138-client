import {useCallback, useEffect, useRef, useState} from 'react';
import {LayoutChangeEvent, Platform} from 'react-native';

// 检测是否在 Web 环境
const isWeb = Platform.OS === 'web';

// 节流函数
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return (...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      // 如果距离上次执行时间超过延迟，立即执行
      func(...args);
      lastExecTime = currentTime;
    } else {
      // 否则设置定时器延迟执行
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(
        () => {
          func(...args);
          lastExecTime = Date.now();
        },
        delay - (currentTime - lastExecTime),
      );
    }
  };
}

export function useResizeObserver<T extends HTMLElement = HTMLDivElement>(
  throttleDelay: number = 100,
) {
  const [size, setSize] = useState({width: 0, height: 0});
  const observerRef = useRef<ResizeObserver | null>(null);
  const throttledSetSize = useRef(throttle(setSize, throttleDelay));

  const refCallback = useCallback(
    (node: T | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (node && isWeb) {
        // 只在 Web 环境中使用 ResizeObserver
        observerRef.current = new ResizeObserver(entries => {
          const entry = entries[0];
          const {width, height} = entry.contentRect;

          // 使用节流函数更新尺寸
          throttledSetSize.current(prev => {
            if (prev.width !== width || prev.height !== height) {
              return {width, height};
            }
            return prev; // 不变就不触发渲染
          });
        });

        observerRef.current.observe(node);
      }
    },
    [throttleDelay],
  );

  useEffect(() => {
    return () => {
      if (isWeb) {
        observerRef.current?.disconnect();
      }
    };
  }, []);

  return [refCallback, size] as const;
}

// React Native 专用的尺寸监听 hook
export function useLayoutSize() {
  const [size, setSize] = useState({width: 0, height: 0});

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;

    setSize(prev => {
      if (prev.width !== width || prev.height !== height) {
        return {width, height};
      }
      return prev;
    });
  }, []);

  return [handleLayout, size] as const;
}

// 跨平台的尺寸监听 hook
export function useCrossPlatformResize() {
  if (isWeb) {
    return useResizeObserver();
  } else {
    return useLayoutSize();
  }
}

// 带节流功能的跨平台尺寸监听 hook
export function useThrottledResize(throttleDelay: number = 100) {
  if (isWeb) {
    return useResizeObserver(throttleDelay);
  } else {
    return useLayoutSize();
  }
}
