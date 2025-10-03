import React, {useEffect, useState} from 'react';
import {Platform, StyleProp, View, ViewStyle} from 'react-native';
import {router} from 'expo-router';
import Carousel from '../Carousel';
import {listAdApi} from '@/api/interface/ad';

import SwiperItem from './compoents/SwiperItem';

interface CarouselComponentProps {
  style?: StyleProp<ViewStyle>;
  className?: string;
  appType: number;
  adList?: ServerCoreAd.Ad[];
  adType?: ServerCoreAd.AdType;
  loading?: boolean;
  onPress?: (item: ServerCoreAd.Ad) => void;
}

const CarouselComponent = (props: CarouselComponentProps) => {
  const [bannerList, setBannerList] = useState<ServerCoreAd.Ad[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);

  // 优先使用 props.adList，否则内部请求
  useEffect(() => {
    if (props.adList) {
      setBannerList(props.adList);
    } else {
      setInternalLoading(true);
      listAdApi({
        appType: props.appType as CoreCommonEnum.AppType,
        adType: props.adType ?? null,
      }).then(res => {
        setBannerList(res.data || []);
        setInternalLoading(false);
      });
    }
  }, [props.adList, props.appType]);

  // 默认跳转逻辑
  const defaultGoto = (item: ServerCoreAd.Ad) => {
    if (item.redirectUrl && item.redirectUrl.includes('http')) {
      router.push({
        pathname: '/web',
        params: {
          url: item.redirectUrl,
        },
      });
      return;
    }
    switch (item.redirectType) {
      case 1:
        router.push({
          pathname: item.redirectUrl || '/home/notice',
          params: {
            item: JSON.stringify(item),
          },
        });
        break;
      case 2:
        break;
      default:
        router.push({
          pathname: item.redirectUrl || '/home/notice',
          params: {
            item: JSON.stringify(item),
          },
        });
        break;
    }
  };

  const goto = props.onPress || defaultGoto;

  const isLoading = props.loading ?? internalLoading;

  if (isLoading) {
    return (
      <View
        style={[props.style]}
        className={`${props.className} justify-center items-center w-full`}>
        <View style={{height: 100}} />
      </View>
    );
  }

  if (!bannerList || bannerList.length === 0) {
    return null;
  }
  return (
    <View
      style={[props.style]}
      className={`${props.className} justify-center items-center w-full`}>
      {/* {bannerList.length > 0 && <Image
                source={{uri: bannerList[0]?.imageUrl}}
                style={styles.image}
                resizeMode="contain"
              />} */}
      {bannerList && bannerList.length > 0 && (
        <View style={{height: Platform.OS === 'web' ? 190 : 110, flex: 1, width: '100%'}}>
          <Carousel
            data={bannerList}
            autoplayLoop
            autoplay={true}
            autoplayDelay={3000}
            height={Platform.OS === 'web' ? 190 : 110}
            renderItem={({item}) => <SwiperItem item={item} goto={goto} />}
          />
        </View>
      )}
    </View>
  );
};

export default CarouselComponent;
