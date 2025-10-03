import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
} from 'react-native';
import {useCreateOrderStore} from '../store/createOrderStore';

export const FollowBillingPublic = () => {
  const {isPublic, setPublic} = useCreateOrderStore();

  return (
    <View className="bg-white p-4 mt-4 ">
      <View className="flex-row gap-2">
        <Text style={{marginTop: 16}}>保密设置:</Text>
        <TouchableOpacity
          className={`overflow-hidden rounded-md ${
            !isPublic ? 'border-none' : 'border border-[#ccc]'
          }`}
          onPress={() => setPublic(false)}>
          {!isPublic ? (
            <ImageBackground
              source={require('src/assets/imgs/follow/xuanzhong.webp')}
              className="justify-center items-center"
              style={{width: 100, height: 40}}
              resizeMode="stretch">
              <Text className="text-red-500 text-center">截止后公开</Text>
            </ImageBackground>
          ) : (
            <View className="justify-center items-center w-24 h-10 bg-white">
              <Text className="text-black text-center">截止后公开</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className={`overflow-hidden rounded-md ${
            isPublic ? 'border-none' : 'border border-[#ccc]'
          }`}
          onPress={() => setPublic(true)}>
          {isPublic ? (
            <ImageBackground
              source={require('src/assets/imgs/follow/xuanzhong.webp')}
              className="justify-center items-center"
              style={{width: 100, height: 40}}
              resizeMode="stretch">
              <Text style={{color: 'red', textAlign: 'center'}}>公开</Text>
            </ImageBackground>
          ) : (
            <View className="justify-center items-center w-24 h-10 bg-white">
              <Text className="text-black text-center">公开</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <Text className="text-gray-500 text-sm">
        {isPublic
          ? '他人复制购彩，中奖后无佣金'
          : '他人复制购彩，可获得中奖金额的5% 作为佣金'}
      </Text>
    </View>
  );
};
