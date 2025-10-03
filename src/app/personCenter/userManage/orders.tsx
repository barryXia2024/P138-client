import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

import {AppHeader, TabSwitcher} from '@/p138-react-common/components';
import DateSelector, {
  DateRange,
} from '@/p138-react-common/components/DateSelector';

import dayjs from 'dayjs';

 
import {FlatList} from '@/p138-react-common/components/FlatList';
import {
  agentUnderOrder,
  myStatistic,
 
} from 'src/api/interface/customer-agent';
import {useUserStore} from 'src/store';
import {router, useLocalSearchParams} from 'expo-router';
import { formatDate } from '@/p138-react-common/utils';
 
 
const UserOrdersStatistics = () => {
  const {saleAmount,commission,startTime,endTime} = useLocalSearchParams();
 
 
 
  const loginInfo = useUserStore(state => state.loginInfo);

 

  return (
    <View style={styles.container}>
      <AppHeader title="我的统计" />
      <View className="bg-[#ffecec] justify-between flex-row px-2 py-4">
        <Text className="text-[#f04b49] text-[14px]">本月累计购彩总额：{saleAmount}元，本月累计提成总额：{commission}元</Text>
 
      </View>
      <FlatList
        requestFunction={myStatistic}
        requestParams={{
 
          shopCode: loginInfo?.shopCode || 0,
          parentUserID: loginInfo?.userID,
          current: 1,
          pageSize: 10,
          startTime:Number(startTime),
          endTime:Number(endTime),
        }}
        className="flex-1"
        renderItem={({item}) => {
          return (
            <View className="  bg-white border-b border-gray-200 p-4">
              <View className="flex-1 flex-row justify-between  items-center  ">
                <Text className="font-bold  text-[14px]">
                  {formatDate(item.createTime)}
                </Text>
                <Text className="text-[#2143b1] text-[14px]"> 
                   提成总额
                </Text>
              </View>
              <View className="flex-1 flex-row justify-between items-center placeholder:   ">
                <Text className="  text-[14px]">
                下级用户购彩金额：<Text className="text-red-500 text-[14px]">{item.saleAmount}</Text> 元
                </Text>
                <Text className="text-red-500 text-[14px]">¥{item.commission}元</Text>
              </View>
    
               
            </View>
          );
        }}
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
