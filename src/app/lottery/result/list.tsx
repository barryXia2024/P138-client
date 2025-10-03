import React, {useEffect, useRef, useState} from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {router, useLocalSearchParams} from 'expo-router';
import {TopTab} from 'src/app/follow/components';

import {
  SportLotteryResult,
  DigitalLotteryResult,
  TraditionalLotteryResult,
} from './components';
import {kScreenHeight, kScreenWidth} from '@/p138-react-common/utils/styles';
import Carousel, {CarouselRef} from '@/p138-react-common/components/Carousel';
 
 
const LotteryResult: React.FC = () => {
  const SwiperFlatListRef = useRef<CarouselRef | null>(null);
  const {activity} = useLocalSearchParams<{
    activity?: string
  }>();
  

 
   
  
 
  

 
 

  return (
    <View className="flex-1">
      <AppHeader
        title="开奖公告"
        rightComponent={
          <TouchableOpacity onPress={() => router.push('/shop/QRCodePage')}>
            <Image
              style={{width: 22, height: 22}}
              source={require('src/assets/imgs/live/share.png')}
            />
          </TouchableOpacity>
        }
      />
      <TopTab
        tabs={['数字彩', '竞技彩', '传统足彩']}
   
        onTabPress={index => {
          console.log('index', index);
          if(Platform.OS === 'web'){
            SwiperFlatListRef.current?.scrollTo(index, true);
          }else{
            SwiperFlatListRef.current?.scrollTo(index,true)
          }
        }}
      />
      <Carousel
        ref={SwiperFlatListRef}
 
        data={[1, 2, 3]}
        height={kScreenHeight-(Platform.OS === 'web' ? 0 : 64)}
        autoplayLoop={false}
        
        renderItem={({item: page}) => {
          if (page === 1) {
            return (
              <View className="flex-1   "  >
                <DigitalLotteryResult />
              </View>
            );
          }
          if (page === 2) {
            return (
              <View className="flex-1 ">
                <SportLotteryResult />
              </View>
            );
          }
          if (page === 3) {
            return (
              <View className="flex-1">
                <TraditionalLotteryResult />
              </View>
            );
          }
          return SportLotteryResult;
        }}
      />
      {/* {Platform.OS === 'web' ? (
        <Carousel
          ref={SwiperFlatListRef}
          data={[1, 2, 3]}
          autoplayLoop={false}
          renderItem={({item: page}) => {
            if (page === 1) {
              return (
                <View className="flex-1   ">
                  <DigitalLotteryResult />
                </View>
              );
            }
            if (page === 2) {
              return (
                <View className="flex-1 ">
                  <SportLotteryResult />
                </View>
              );
            }
            if (page === 3) {
              return (
                <View className="flex-1">
                  <TraditionalLotteryResult />
                </View>
              );
            }
            return SportLotteryResult;
          }}
        />
      ) : (
        <SwiperFlatList
          data={[1, 2, 3]}
          style={{flex: 1,height: '100%' }}
          ref={SwiperFlatListRef2}
          paginationStyle={{
            marginTop: 2,
            position: 'relative',
            alignSelf: 'center',
          }}
          paginationActiveColor={'#f90'}
          paginationDefaultColor={'#ccc'}
          contentContainerStyle={{flex: 1}}
          renderItem={({item: page}) => {
            if (page === 1) {
              return (
                <View className="flex-1   h-full" style={{height: '100%',width: '100%',backgroundColor: 'red'}}>
                  <DigitalLotteryResult style={{height: '100%',width: '100%'}} />
                </View>
              );
            }
            if (page === 2) {
              return (
                <View className="flex-1 h-full">
                  <SportLotteryResult />
                </View>
              );
            }
            if (page === 3) {
              return (
                <View className="flex-1 h-full">
                  <TraditionalLotteryResult />
                </View>
              );
            }
            return null;
          }}
        />
      )} */}
    </View>
  );
};

export default LotteryResult;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
