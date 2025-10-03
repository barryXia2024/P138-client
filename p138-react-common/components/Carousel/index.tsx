// components/Carousel/index.tsx
import React, {useImperativeHandle, useRef} from 'react';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {Dimensions, StyleSheet, View} from 'react-native';

const {width} = Dimensions.get('window');

export interface CarouselProps<T> {
  data: T[];
  renderItem: (props: {item: T; index: number}) => JSX.Element;
  height?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  autoplayLoop?: boolean;
  index?: number;
  showPagination?: boolean;

}
export interface CarouselRef {
  scrollTo: (index: number, animated?: boolean) => void;
  next?: () => void;
  prev?: () => void;
}

function CarouselRN<T>({
  data,
  renderItem,
  height = 160,
  autoplay = false,
  autoplayDelay = 2,
  autoplayLoop = false,
  index = 0,
  showPagination = false,
  ref,
}: CarouselProps<T> & {ref?: React.RefObject<CarouselRef>}) {
 
  const internalRef = useRef<SwiperFlatList>(null);
  useImperativeHandle(ref, () => ({
    scrollTo: (index: number, animated?: boolean) => {
      internalRef.current?.scrollToIndex({index, animated});
    },
    next: () => {
      if (index < data.length - 1) {
        internalRef.current?.scrollToIndex({index: index + 1, animated: true});
      }
    },
    prev: () => {
        if (index > 0) {
        internalRef.current?.scrollToIndex({index: index - 1, animated: true});
      }
    },
  }), []);

  return (
    <SwiperFlatList
      ref={internalRef}
      data={data}
      renderItem={({item, index}) => (
        <View style={{width, height}}>{renderItem({item, index})}</View>
      )}
      autoplay={autoplay}
      autoplayDelay={autoplayDelay}
      autoplayLoop={autoplayLoop}
      index={index}
      showPagination={showPagination}
      paginationStyle={styles.pagination}
      paginationStyleItem={styles.dot}
      paginationActiveColor="white"
      paginationDefaultColor="rgba(255,255,255,0.5)"
    />
  );
}

const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    bottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default CarouselRN;
