import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Dimensions } from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';

const { width: screenWidth } = Dimensions.get('window');

interface CarouselWrapperProps<T> {
  data: T[];
  defaultIndex?: number;
  width?: number;
  height?: number | string;
  renderItem: (params: { item: T; index: number }) => React.ReactNode;
  onChangeIndex?: (index: number) => void;
  scrollEnabled?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  contentContainerStyle?: any;
  className?: string;
}

function CarouselWrapperInner<T>(
  {
    data,
    defaultIndex = 0,
    width = screenWidth,
    height = '100%',
    renderItem,
    scrollEnabled = false,
    onChangeIndex,
    contentContainerStyle,
    className,
  }: CarouselWrapperProps<T>,
  ref: any
) {
  const swiperRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    scrollTo: ({ index, animated = true }: { index: number; animated?: boolean }) => {
      swiperRef.current?.scrollToIndex({ index, animated });
    },
  }));

  return (
    <SwiperFlatList
      ref={swiperRef}
      index={defaultIndex}
      data={data}
      scrollEnabled={scrollEnabled}
      showPagination={false}
      onChangeIndex={({ index }) => onChangeIndex?.(index)}
      renderItem={({ item, index }) => (
        <View style={{ width, height }}>{renderItem({ item, index })}</View>
      )}
      contentContainerStyle={contentContainerStyle}
      className={className}
      keyExtractor={(_, index) => `${index}`}
    />
  );
}

const CarouselWrapper = forwardRef(CarouselWrapperInner) as <T>(
    props: CarouselWrapperProps<T> & { ref?: React.Ref<any> }
  ) => React.ReactElement;
  
  export default CarouselWrapper;
  