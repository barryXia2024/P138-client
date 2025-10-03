import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

import {AppHeader, TabSwitcher} from '@/p138-react-common/components';
import DateSelector, {
  DateRange,
} from '@/p138-react-common/components/DateSelector';

import dayjs from 'dayjs';

import SwiperFlatList from 'react-native-swiper-flatlist';
import {FlatList} from '@/p138-react-common/components/FlatList';
import {
  agentUnderOrder,
  proxyCountData,
  proxyUnderUser,
} from 'src/api/interface/customer-agent';
import {useUserStore} from 'src/store';
import {router, useLocalSearchParams} from 'expo-router';
import {formatDateTime} from '@/p138-react-common/utils';
import {kScreenWidth} from '@/p138-react-common/utils/styles';
type TabType = 'register' | 'bet';
const UserOrdersTabs: {
  label: string;
  key: TabType;
}[] = [
  {label: '注册数据', key: 'register'},
  {label: '出票数据', key: 'bet'},
];

const UserOrdersStatistics = () => {
  const {startDate, endDate} = useLocalSearchParams<{
    startDate: string;
    endDate: string;
  }>();
  const [range, setRange] = useState<DateRange>({
    startDate: dayjs(Number(startDate)).toDate(),
    endDate: dayjs(Number(endDate)).toDate(),
  });

  const [activeTab, setActiveTab] = useState<TabType>('register');
  const loginInfo = useUserStore(state => state.loginInfo);

  const SwiperFlatListRef = useRef<SwiperFlatList>(null);

  useEffect(() => {
    SwiperFlatListRef.current?.scrollToIndex({
      index: activeTab === 'register' ? 0 : 1,
    });

    proxyCountData(
      {
        startTime: range.startDate.getTime(),
        endTime: range.endDate.getTime(),
        shopCode: loginInfo?.shopCode || 0,
        parentUserID: loginInfo?.userID,
      },
      {
        startTime: range.startDate.getTime(),
        endTime: range.endDate.getTime(),
        shopCode: loginInfo?.shopCode || 0,
      },
    ).then(res => {
      console.log(res);
    });
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <AppHeader title="用户管理" />
      <View className="py-2 bg-white">
        <DateSelector range={range} setRange={setRange} />
      </View>
      <TabSwitcher<TabType>
        tabs={UserOrdersTabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />

      <SwiperFlatList
        ref={SwiperFlatListRef}
        style={{height: '100%'}}
        contentContainerStyle={{height: '100%'}}
        className="SwiperFlatList"
        data={UserOrdersTabs}
        initialScrollIndex={1}
        renderItem={({item, index}) =>
          item.key === 'register' ? (
            <View style={{width: kScreenWidth}}>
              <View className="bg-[#ffecec] justify-between flex-row px-2 py-4">
                <Text className="text-[#f04b49] text-[14px]">彩民人数</Text>
                <Text className="text-[#f04b49] text-[14px]">{}</Text>
              </View>
              <View className="bg-white flex-row justify-between border-b border-[#e5e5e5]">
                <View className="flex-1 items-center   py-4">
                  <Text className="text-[#333] text-[14px]">用户名</Text>
                </View>
                <View className=" flex-1 items-center    py-4">
                  <Text className="text-[#333] text-[14px]">余额</Text>
                </View>
                <View className=" flex-1 items-center   py-4">
                  <Text className="text-[#333] text-[14px]">出票金额</Text>
                </View>
                <View className=" flex-1 items-center py-4">
                  <Text className="text-[#333] text-[14px]">出票详情</Text>
                </View>
              </View>
              <FlatList
                requestFunction={proxyUnderUser}
                keyExtractor={item => item.userID}
                requestParams={{
                  startTime: range.startDate.getTime(),
                  endTime: range.endDate.getTime(),
                  shopCode: loginInfo?.shopCode || 0,
                  parentUserID: loginInfo?.userID,
                  current: 1,
                  pageSize: 10,
                }}
                className="flex-1"
                renderItem={({item}) => {
                  return (
                    <View className="flex-row justify-between bg-white border-b border-[#e5e5e5]">
                      <View className="flex-1 items-center justify-center py-4">
                        <Text className="text-[#2143b1] text-[14px]">
                          {item.username}
                        </Text>
                      </View>
                      <View className="flex-1 items-center justify-center py-4">
                        <Text className="text-red-500 text-[14px]">
                          ¥{item.balance}
                        </Text>
                      </View>
                      <View className="flex-1 items-center justify-center py-4">
                        <Text className="text-[#333] text-[14px]">
                          {formatDateTime(item.createTime)}
                        </Text>
                      </View>
                      <View className="flex-1 items-center  justify-center py-4">
                        <View
                          style={{
                            borderRadius: 30,
                            width: 80,
                            overflow: 'hidden',
                          }}>
                          <Button
                            title="查看"
                            color="red"
                            onPress={() => {
                              router.push({
                                pathname: '/order/bet/detail',
                                params: {
                                  orderId: item.userID,
                                },
                              });
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          ) : (
            <View style={{width: kScreenWidth}}>
              <View className="bg-[#ffecec] justify-between flex-row px-2 py-4">
                <Text className="text-[#f04b49] text-[14px]">出票金额</Text>
                <Text className="text-[#f04b49] text-[14px]">￥4</Text>
              </View>
              <View className="bg-white flex-row justify-between border-b border-[#e5e5e5]">
                <View className="flex-1 items-center   py-4">
                  <Text className="text-[#333] text-[14px]">用户名</Text>
                </View>
                <View className=" flex-1 items-center    py-4">
                  <Text className="text-[#333] text-[14px]">余额</Text>
                </View>
                <View className=" flex-1 items-center   py-4">
                  <Text className="text-[#333] text-[14px]">出票金额</Text>
                </View>
                <View className=" flex-1 items-center py-4">
                  <Text className="text-[#333] text-[14px]">出票详情</Text>
                </View>
              </View>
              <FlatList
                requestFunction={agentUnderOrder}
                requestParams={{
                  startTime: range.startDate.getTime(),
                  endTime: range.endDate.getTime(),
                  shopCode: loginInfo?.shopCode || 0,
                  parentUserID: loginInfo?.userID,
                  current: 1,
                  pageSize: 10,
                }}
                className="flex-1"
                renderItem={({item}) => {
                  return (
                    <View className="flex-row justify-between bg-white">
                      <View className="flex-1 items-center  py-4">
                        <Text className="text-[#2143b1] text-[14px]">
                          {item.username}
                        </Text>
                      </View>
                      <View className="flex-1 items-center  py-4">
                        <Text className="text-red-500 text-[14px]">
                          ¥{item.balance}
                        </Text>
                      </View>
                      <View className="flex-1 items-center   py-4">
                        <Text className="text-red-500 text-[14px]">
                          ¥{item.amount}
                        </Text>
                      </View>
                      <View className="flex-1 items-center  justify-center ">
                        <View
                          style={{
                            borderRadius: 30,
                            width: 80,
                            overflow: 'hidden',
                          }}>
                          <Button
                            title="查看"
                            color="red"
                            onPress={() => {
                              router.push({
                                pathname: '/order/bet/detail',
                                params: {
                                  orderId: item.orderID,
                                },
                              });
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          )
        }
        keyExtractor={item => item.label}
        autoplayLoop
        index={activeTab === 'register' ? 0 : 1}
        showPagination={false}
        bounces={false}
        scrollEnabled={false}
        removeClippedSubviews={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={kScreenWidth}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default UserOrdersStatistics;
