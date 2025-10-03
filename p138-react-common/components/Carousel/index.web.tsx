import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {View} from 'react-native';
import {CarouselProps, CarouselRef} from './index';
import {useResizeObserver} from './observer';

function CarouselWebInner<T>(
  {
    data,
    renderItem,
    height,
    autoplay = false,
    autoplayDelay = 3000,
    autoplayLoop = true,
    index = 0,
    showPagination = false,
  }: CarouselProps<T>,
  ref?: React.Ref<CarouselRef | null>,
) {
  const internalRef = useRef<ICarouselInstance>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [refCallback, containerSize] = useResizeObserver<HTMLDivElement>(
    isDragging ? 300 : 100,
  ); // 拖拽时增加节流延迟

  // 监听拖拽状态
  useEffect(() => {
    const carouselElement = internalRef.current;
    if (!carouselElement) return;

    const handleDragStart = () => {
      setIsDragging(true);
    };

    const handleDragEnd = () => {
      // 拖拽结束后延迟重置状态，确保尺寸更新完成
      setTimeout(() => {
        setIsDragging(false);
      }, 100);
    };

    // 监听触摸事件来判断拖拽状态
    const handleTouchStart = () => {
      setIsDragging(true);
    };

    const handleTouchEnd = () => {
      setTimeout(() => {
        setIsDragging(false);
      }, 100);
    };

    // 添加事件监听器
    const element = carouselElement as any;
    if (element.addEventListener) {
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchend', handleTouchEnd);
      element.addEventListener('mousedown', handleDragStart);
      element.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      if (element.removeEventListener) {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('mousedown', handleDragStart);
        element.removeEventListener('mouseup', handleDragEnd);
      }
    };
  }, []);

  // 使用 ResizeObserver 监听的尺寸，如果没有则使用默认值
  const finalSize = {
    width: containerSize.width || 0,
    height: height ?? (containerSize.height || 0),
  };

  const ready = finalSize.width > 0 && finalSize.height > 0;

  // 将内部 ref 暴露出去
  useImperativeHandle(
    ref,
    () => ({
      scrollTo: (index: number, animated?: boolean) => {
        internalRef.current?.scrollTo({index, animated});
      },
      next: () => {
        internalRef.current?.next();
      },
      prev: () => {
        internalRef.current?.prev();
      },
    }),
    [],
  );

  return (
    <View style={{flex: 1}}>
      <div ref={refCallback} style={{width: '100%', height: '100%'}}>
        {ready && (
          <Carousel
            ref={internalRef}
            width={finalSize.width}
            height={finalSize.height}
            data={data}
            autoPlay={autoplay}
            loop={autoplayLoop}
            scrollAnimationDuration={1000}
            autoPlayInterval={autoplayDelay}
            pagingEnabled={showPagination}
            containerStyle={{
              width: finalSize.width,
              height: finalSize.height,
            }}
            defaultIndex={index}
            renderItem={({item, index}) => renderItem({item, index})}
          />
        )}
      </div>
    </View>
  );
}

// 包一层 forwardRef 导出
const CarouselWeb = forwardRef(CarouselWebInner) as <T>(
  props: CarouselProps<T> & {ref?: React.Ref<CarouselRef | null>},
) => React.ReactElement;

export default CarouselWeb;
