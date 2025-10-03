import React, {useMemo, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {Button, TabSwitcher} from '@/p138-react-common/components';
import CustomerMultiplier from '../../components/CustomerMultiplier';
import {useBettingListStore} from './store';
import {optimizationMockData} from 'src/app/lottery/slip/sport/mockdata';

type OptimizationTab = 'avg' | 'hot' | 'cold';

const tabs = [
  {label: '平均优化', key: 'avg' as OptimizationTab},
  {label: '博热优化', key: 'hot' as OptimizationTab},
  {label: '博冷优化', key: 'cold' as OptimizationTab},
];

function Stepper({value, onChange}: {value: number; onChange: (v: number) => void}) {
  return (
    <View className="flex-row items-center">
      <TouchableOpacity
        onPress={() => onChange(Math.max(0, value - 1))}
        className="w-10 h-10 border border-gray-300 rounded-l-md items-center justify-center">
        <Text className="text-xl">-</Text>
      </TouchableOpacity>
      <View className="w-16 h-10 border-t border-b border-gray-300 items-center justify-center">
        <Text className="text-lg">{value}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onChange(value + 1)}
        className="w-10 h-10 border border-gray-300 rounded-r-md items-center justify-center">
        <Text className="text-xl">+</Text>
      </TouchableOpacity>
    </View>
  );
}

const OptimizationPage = () => {
  const {lotteryData} = useBettingListStore();
  const [planAmount, setPlanAmount] = useState<number>(40);
  const [activeTab, setActiveTab] = useState<OptimizationTab>('avg');

  const list = useMemo(() => {
    const d = optimizationMockData.data;
    if (activeTab === 'avg') return d.avgBonusDetailList;
    if (activeTab === 'hot') return d.hotBonusDetailList;
    return d.coldBonusDetailList;
  }, [activeTab]);

  const [rowMultipliers, setRowMultipliers] = useState<Record<number, number>>(() => {
    const init: Record<number, number> = {};
    optimizationMockData.data.avgBonusDetailList.forEach((_, i) => (init[i] = 0));
    return init;
  });

  const totalAmount = useMemo(() => {
    return list.reduce((sum, item, idx) => sum + (rowMultipliers[idx] ?? item.multipart) * 2, 0);
  }, [list, rowMultipliers]);

  const totalBonus = useMemo(() => {
    return list.reduce((sum, item, idx) => sum + item.bonus * (rowMultipliers[idx] ?? item.multipart), 0);
  }, [list, rowMultipliers]);

  return (
    <View className="flex-1 bg-[#f0f0f0]">
      <AppHeader
        title="奖金优化"
        rightComponent={<Button title="帮助" type="text" textStyle={{color: '#fff'}} />}
      />

      <View className="px-4 py-3 bg-white flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="text-[#333] text-base mr-3">{lotteryData?.buyEndTime ? `${lotteryData.buyEndTime} 截止，请尽快提交投注` : ''}</Text>
        </View>
      </View>

      {/* 计划购买金额 */}
      <View className="bg-white px-4 py-3 mt-2 flex-row items-center justify-between">
        <Text className="text-lg">计划购买金额</Text>
        <View className="flex-row items-center">
          <Stepper value={planAmount} onChange={setPlanAmount} />
          <Text className="ml-2 text-lg">元</Text>
        </View>
      </View>

      {/* Tabs */}
      <View className="px-4 py-3">
        <TabSwitcher tabs={tabs} activeTab={activeTab} onTabPress={k => setActiveTab(k as OptimizationTab)} tabClassName="p-2" />
      </View>

      {/* 表头 */}
      <View className="flex-row bg-white px-4 py-2">
        <View className="w-16"><Text className="text-[#666]">过关</Text></View>
        <View className="flex-1"><Text className="text-[#666]">单注组合</Text></View>
        <View className="w-28 items-center"><Text className="text-[#666]">倍数</Text></View>
        <View className="w-28 items-end"><Text className="text-[#666]">预计奖金</Text></View>
      </View>

      <ScrollView className="flex-1">
        {list.map((row, idx) => (
          <View key={idx} className="bg-white mt-2 px-4 py-3">
            <View className="flex-row items-center">
              <View className="w-16">
                <Text className="text-[#333]">{row.betFreePass.replace('串', '串')}</Text>
              </View>
              <View className="flex-1 pr-3">
                {row.betItem.map((t, i) => (
                  <Text key={i} className="text-[#333] leading-6">{t}</Text>
                ))}
              </View>
              <View className="w-28 items-center">
                <Stepper
                  value={rowMultipliers[idx] ?? row.multipart}
                  onChange={v => setRowMultipliers(s => ({...s, [idx]: v}))}
                />
              </View>
              <View className="w-28 items-end">
                <Text className="text-[#333]">{((rowMultipliers[idx] ?? row.multipart) * row.bonus).toFixed(2)}元</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 底部合计 */}
      <View className="bg-white px-4 py-3 border-t border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg">金额：<Text className="text-red-500">{totalAmount}</Text> 元</Text>
          <Button title="下一步" onPress={() => globalThis.Toast.show('下一步')} />
        </View>
      </View>

      {/* 倍数弹窗（共用组件） */}
      <CustomerMultiplier
        multiplier={1}
        type="digital"
        setMultiplier={() => {}}
        toggleMultiplierModal={() => {}}
        showMultiplierModal={false}
      />
    </View>
  );
};

export default OptimizationPage;


