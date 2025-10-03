import React, {memo, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';

import Marquee from 'src/components/Marquee';
import {kScreenHeight, kScreenWidth} from '@/p138-react-common/utils/styles';
import {CustomModal} from '@/p138-react-common/components';

import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import {useUserStore} from 'src/store';
import  { listAdApi } from 'src/api/interface/ad';

const HomeMarquee: React.FC<HomeProps.HomeMarqueeProps> = ({className}) => {
  const [adList, setAdList] = useState<ServerCoreAd.Ad[]>([]);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  useEffect(() => {
    listAdApi({
      adType: 4,
      appType: 1,
      adStatus: 1,
    }).then(res => {
      if(res.success){
        setAdList(res.data || []);
      }
    });
  }, []);
  if(adList.length === 0){
    return null;
  }

  return (
    <View className={className}>
      <TouchableOpacity
        className="flex-1 w-full flex-row items-center justify-center mt-4"
        onPress={() => setIsPreviewModalVisible(true)}>
        <Image
          source={require('src/assets/imgs/home/icon_notice.png')}
          style={{
            width: 20,
            height: 20,
            marginLeft: Platform.OS === 'web' ? 100 : 0,
          }}
        />
        <Marquee width={kScreenWidth * 0.85} text={adList?.[0]?.adContent||''} />
        <Image
          source={require('src/assets/imgs/home/icon_arrow_right.png')}
          style={{
            width: 20,
            height: 20,
            marginRight: Platform.OS === 'web' ? 20 : 0,
          }}
        />
      </TouchableOpacity>
      <CustomModal
        isVisible={isPreviewModalVisible}
        onClose={() => setIsPreviewModalVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          className="rounded-lg   relative w-full h-[100%] justify-center items-center"
          style={{width: kScreenWidth, height: kScreenHeight}}
          onPress={() => setIsPreviewModalVisible(false)}>
          <OSSImage
            source={{uri: adList?.[0]?.imageUrl||''}}
            className="w-full  h-full rounded-lg"
            style={{width: kScreenWidth, height: kScreenHeight * 0.95}}
            resizeMode="contain"
           
          />
        </TouchableOpacity>
      </CustomModal>
    </View>
  );
};

export default memo(HomeMarquee);
