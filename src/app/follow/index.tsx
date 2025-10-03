import React, {useCallback, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import AppHeader from '@/p138-react-common/components/AppHeader';
import ListItem from './components/followItem';
import TopTab from './components/topTab';
import FilterBar from './components/filterBar';
import {IMAGE_SIZE} from '@/p138-react-common/utils/styles/theme';
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import {FlatList, FlatListRef} from '@/p138-react-common/components/FlatList';

import {useFollowData} from './hooks/useFollowData';
import {getOrderTrackHall} from './models/FollowModel';
import {router, useFocusEffect} from 'expo-router';
import LotterySelectModal from './components/LotterySelectModal';
export const FollowOrderList = () => {
  const {
    orderTrackHallQuery,

    events,
  } = useFollowData();

  return (
    <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <TopTab
        tabs={['连赢榜', '命中榜', '盈利榜']}
        onTabPress={events.onTabPress}
      />

      {/* 列表区域 - 使用增强版 FlatList */}
      <FlatList
        requestFunction={getOrderTrackHall}
        requestParams={orderTrackHallQuery}
        renderItem={({item}) => <ListItem item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const FollowOrderScreen = () => {
  const {
    state,
    orderTrackHallQuery,
    followLotteryList,
    events,
    fetchFollowLotteryList,
  } = useFollowData();

  const flatListRef = useRef<FlatListRef<CommonFollowHall.FollowOrder>>(null);

  // 页面聚焦时刷新数据
  useFocusEffect(
    useCallback(() => {
      flatListRef.current?.refresh();
      fetchFollowLotteryList();
    }, []),
  );

  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      <AppHeader
        titleDes="帮助"
        titleDesOnPress={()=>{
          router.push({
            pathname: '/help',
            params: {
              helpType: 'fadan',
            },
          })
        }}
        title="跟单大厅"
        leftComponent={
          <TouchableOpacity onPress={events.onFadanPress}>
            <Text className="text-white text-sm border border-white rounded-md px-2 py-1 bg-[#f7eded33]">
              发单
            </Text>
          </TouchableOpacity>
        }
        rightComponent={
          <View className="flex-row gap-4">
            <TouchableOpacity onPress={events.onUserPress} activeOpacity={1}>
              <OSSImage
                source={require('src/assets/imgs/follow/mine.png')}
                style={IMAGE_SIZE.IMAGE_SIZE20}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={events.onSearchPress} activeOpacity={1}>
              <OSSImage
                source={require('src/assets/imgs/follow/search.png')}
                style={IMAGE_SIZE.IMAGE_SIZE20}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={events.onSharePress}>
              <OSSImage
                source={require('src/assets/imgs/follow/icon_share.png')}
                style={IMAGE_SIZE.IMAGE_SIZE20}
              />
            </TouchableOpacity>
          </View>
        }
      />

      {/* 顶部选项卡 */}
      <TopTab
        tabs={['连赢榜', '命中榜', '盈利榜']}
        onTabPress={events.onTabPress}
      />

      {/* 筛选栏 */}
      <FilterBar
        filters={['默认排序', '跟单人数', '自购金额']}
        onFilterPress={events.onFilterPress}
        style={styles.marginTop5}
      />

      {/* 列表区域 - 使用增强版 FlatList */}
      <FlatList
        ref={flatListRef}
        requestFunction={getOrderTrackHall}
        requestParams={orderTrackHallQuery}
        renderItem={({item}) => <ListItem item={item} />}
        showsVerticalScrollIndicator={false}
      />

      <LotterySelectModal
        isVisible={state.isModalVisible}
        lotteryList={followLotteryList}
        onClose={events.onModalClose}
        onLotterySelect={events.onLotterySelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  marginTop5: {
    marginTop: 5,
  },
});

export default FollowOrderScreen;
