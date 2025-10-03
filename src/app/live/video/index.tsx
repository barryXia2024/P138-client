import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ScrollView} from 'react-native';
import dayjs from 'dayjs';
import {FlatList} from '@/p138-react-common/components/FlatList';
import LiveItem from 'src/modules/live/components/liveITem';
import DateSelector from 'src/modules/live/components/DateSelector';
import TermSelector from 'src/modules/live/components/TermSelector';
import {router} from 'expo-router';
import {TopTab} from 'src/app/follow/components';
import FilterBar from 'src/app/follow/components/filterBar';
import { useVideoList } from './useVideoList';

const VideoList = () => {
  const {
    state,
    dates,
    todayIndex,
    scrollViewRef,
    currentData,
    hasMore,
    competitionType,
    handleDateChange,
    handleTabChange,
    handleFilterChange,
    handleTermSelect,
    handleRefresh,
    handleLoadMore,
  } = useVideoList();

  return (
    <View style={styles.container}>
      <View className="flex-row items-center justify-between bg-white">
        <TopTab
          style={{flex: 1}}
          tabs={['足球', '篮球', '数字彩']}
          onTabPress={handleTabChange}
        />
        <TouchableOpacity
          className="px-4"
          onPress={() => {
            router.push('/lottery/result/list');
          }}>
          <Text>开奖公告</Text>
        </TouchableOpacity>
      </View>
      
      {state.selectedTabIndex === 0 && (
        <FilterBar
          filters={['竞彩', '北单', '足彩']}
          onFilterPress={handleFilterChange}
          style={styles.marginTop5}
        />
      )}
      
      {state.selectedTabIndex !== 2 ? (
        state.selectedFilterIndex !== 2 ? (
          <DateSelector
            dates={dates}
            selectedDate={state.selectedDate}
            onDateChange={handleDateChange}
            todayIndex={todayIndex}
            scrollViewRef={scrollViewRef}
          />
        ) : (
          <TermSelector
            lotteryTermNo={state.lotteryTermNo}
            selectedLotteryTermNo={state.selectedLotteryTermNo}
            onSelect={handleTermSelect}
            flatListRef={scrollViewRef}
          />
        )
      ) : null}
      
      <FlatList
        data={currentData}
        keyExtractor={item =>
          `${item.competitionId}_${
            item.updatedAt || item.awayId || item.homeId || ''
          }_${dayjs().valueOf()}`
        }
        hasMore={hasMore}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        renderItem={({item}) => (
          <LiveItem
            item={item}
            competitionType={competitionType}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  marginTop5: {marginTop: 5},
});

export default VideoList;
