import React, { ReactElement } from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

interface CarouselWrapperProps<T> {
  data: T[];
  renderItem: (params: { item: T; index: number }) => ReactElement;
  defaultIndex?: number;
  width?: number;
  height?: number;
  onIndexChange?: (index: number) => void;
  ref?: any;
  [key: string]: any;
}

const screenWidth = typeof window !== 'undefined'
  ? window.innerWidth
  : Dimensions.get('window').width;

function CarouselWrapper<T>({
  data,
  renderItem,
  defaultIndex = 0,
  width = screenWidth,
  height = 300,
  onIndexChange,
  ref,
  ...props
}: CarouselWrapperProps<T>) {
  return (
    <Carousel
      ref={ref}
      data={data}
      renderItem={({ index }: { index: number }) => renderItem({ item: data[index], index })}
      defaultIndex={defaultIndex}
      width={width}
      height={height}
      pagingEnabled
      snapEnabled
      style={{ backgroundColor: '#fff' }}
      containerStyle={{ height }}
      scrollAnimationDuration={300}
      enabled={false}
      onSnapToItem={onIndexChange}
      {...props}
    />
  );
}

export default CarouselWrapper;