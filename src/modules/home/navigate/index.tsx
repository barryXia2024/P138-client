import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {IMAGE_SIZE} from 'p138-react-common/utils/styles/theme';
import {router} from 'expo-router';
import {useUserStore} from 'src/store/user';
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import {isDev} from 'src/utils';

export function HeaderLeft() {
  const {shopInfo} = useUserStore();
  return (
    <View className="flex-row items-center justify-between pl-2">
      <View className="w-[30px] h-[30px] p-1 rounded-full bg-white flex items-center justify-center">
        <Image
          source={require('src/assets/imgs/home/icon_gngz.png')}
          style={IMAGE_SIZE.IMAGE_SIZE20}
        />
      </View>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => router.push('/home/shop')}>
        <View className="flex-1 flex-row items-center justify-between">
          <Text className="pl-2 text-white text-[18px]">
            {shopInfo?.shopName}{' '}
            {isDev && (
              <Text className="text-[12px] text-white">
                {shopInfo?.shopCode}
              </Text>
            )}
          </Text>
          <Image
            source={require('src/assets/imgs/home/icon_arrow_right.png')}
            style={IMAGE_SIZE.IMAGE_SIZE20}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
export const HeaderRight = () => (
  <TouchableOpacity onPress={() => router.push('/home/plan')}>
    {/* 右侧小图标（GIF） */}
    <OSSImage
      style={IMAGE_SIZE.IMAGE_SIZE50}
      source={{uri: '1919606211772948480/home.gif'}}
      resizeMode="contain"
    />
  </TouchableOpacity>
);
