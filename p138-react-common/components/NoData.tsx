import {Image, Text, View} from 'react-native';
import React from 'react';
import {kScreenHeight, kScreenWidth} from '../utils/fuc/fc.rn';

export const NoData = () => (
  <View
    className="items-center justify-center"
    style={{height: kScreenHeight * 0.7}}>
    <Image
      source={require('src/assets/imgs/no_data.png')}
      style={{width: kScreenWidth * 0.2, height: kScreenWidth * 0.2}}
    />
    <Text className="text-gray-500 mt-4 text-lg">暂无数据</Text>
  </View>
);
