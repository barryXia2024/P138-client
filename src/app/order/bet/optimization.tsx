import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
 
} from 'react-native';
import {AppHeader, Button} from '@/p138-react-common/components';

import { useLocalSearchParams} from 'expo-router';
 

// tailwind 已替代内置样式

const BetOptimizationPage = () => {
  const {orderInfoString} = useLocalSearchParams<{
    orderInfoString: string;
  }>();
  const orderInfo: ServerCoreOrder.LotteryOrder = JSON.parse(orderInfoString);

  const optimizationList = () => {
    const optimization: ServerCoreOrder.BonusOptimizationResult = JSON.parse(
      orderInfo?.optimization,
    );
    if (orderInfo?.optimizationType === 1) {
      return optimization?.avgBonusDetailList;
    } else if (orderInfo?.optimizationType === 2) {
      return optimization?.hotBonusDetailList;
    } else if (orderInfo?.optimizationType === 3) {
      return optimization?.coldBonusDetailList;
    }
    return [];
  };

  return (
    <View className="flex-1 bg-[#f0f0f0]">
      <AppHeader
        title={
          ['平均优化', '博热优化', '博冷优化'][orderInfo?.optimizationType - 1]
        }
      />
      <View className="bg-white justify-center items-center">
        {/* 计划购买金额 */}
        <View className="bg-white  flex-row items-center ">
          <Text className="text-md">
            方案总金额{' '}
            <Text className="text-red-500">{orderInfo?.betAmount}元</Text>
          </Text>
        </View>
      </View>
      {/* Tabs */}

      {/* 表头，参考订单详情表格样式 */}
      <View className="flex-row justify-between bg-white w-full">
        <Text
          style={{width: 50, lineHeight: 30}}
          className="text-center text-[12px] leading-[30px] bg-[#f0f0f0] font-bold border-r border-white w-[50px]">
          序号
        </Text>
        <Text
          style={{width: 50, lineHeight: 30}}
          className="text-center text-[12px] leading-[30px] bg-[#f0f0f0] font-bold border-r border-white w-[50px]">
          过关
        </Text>
        <Text
          style={{flex: 1, lineHeight: 30}}
          className="text-center text-[12px] leading-[30px] bg-[#f0f0f0] font-bold border-r border-white flex-1">
          场次 /玩法
        </Text>
        <Text
          style={{width: 120, lineHeight: 30}}
          className="text-center text-[12px] leading-[30px] bg-[#f0f0f0] font-bold border-r border-white w-[120px]">
          倍数/金额
        </Text>
        <Text
          style={{width: 60, lineHeight: 30}}
          className="text-center text-[12px] leading-[30px] bg-[#f0f0f0] font-bold border-r border-white w-[60px]">
          最高奖金
        </Text>
      </View>

      <ScrollView>
        {optimizationList()?.map((row, idx) => (
          <View
            key={idx}
            style={{borderBottomWidth: 1, borderBottomColor: '#ddd'}}
            className="bg-white flex-row items-center justify-between  ">
            <View
              style={{width: 50, borderRightWidth: 1, borderRightColor: '#ddd'}}
              className="items-center justify-center border-r border-[#ddd] w-[50px] h-full">
              <Text className="text-[12px] leading-[20px] text-center">
                {idx + 1}
              </Text>
            </View>
            <View
              style={{width: 50, borderRightWidth: 1, borderRightColor: '#ddd'}}
              className="items-center justify-center border-r border-[#ddd] w-[50px] h-full">
              <Text className="text-[12px] leading-[20px] text-center">
                {row.betFreePass}
              </Text>
            </View>
            <View
              style={{flex: 1, borderRightWidth: 1, borderRightColor: '#ddd'}}
              className="items-center justify-center border-r border-[#ddd] flex-1 h-full">
              {row.betItem?.map((t, i) => (
                <Text
                  key={i}
                  className="text-[12px] leading-[20px] text-center">
                  {t}
                </Text>
              ))}
            </View>
            <View
              style={{
                width: 120,
                borderRightWidth: 1,
                borderRightColor: '#ddd',
              }}
              className="items-center justify-center border-r border-[#ddd] w-[120px] h-full">
              <Text className="text-[12px] leading-[20px] text-center">
                {row.multipart*orderInfo?.betMultiple}倍/{row.multipart*2*orderInfo?.betMultiple}元
              </Text>
            </View>
            <View
              style={{width: 60, borderRightWidth: 1, borderRightColor: '#ddd'}}
              className="items-center justify-center w-[60px] h-full">
              <Text className="text-[12px] leading-[20px] text-center">
                {row.bonus}元
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default BetOptimizationPage;
