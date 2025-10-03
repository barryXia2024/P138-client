import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {AppHeader, Button} from '@/p138-react-common/components';

import CustomerMultiplier from '../components/CustomerMultiplier';
import {BuyEndTime} from '../components/HeaderSection';

import {useBetSlipLogic} from '../hooks/useBetSlipLogic';

import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';
import {useSlipStore} from '../../store/slipStore';

import Counter from '../components/Counter';
import {router, useLocalSearchParams} from 'expo-router';
import dayjs from 'dayjs';

import {SportPlayNameMap} from 'src/modules/lottery/constants';
import {useUserStore} from 'src/store';
import {getBetContentSportsLotteryList} from '@/p138-react-common/utils/fuc/lottery/bet';
import {debounce} from '@/p138-react-common/utils/fuc';

type OptimizationTab = '1' | '2' | '3';

// 专门用于计划金额的输入控件，复用 Counter 样式
function PlanAmountCounter({
  value,
  setValue,
}: {
  value: number;
  setValue: (v: number) => void;
}) {
  const [text, setText] = useState(String(value));
  const lastValidRef = useRef<number>(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setText(String(value));
  }, [value]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const scheduleValidate = (nextText: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const n = parseInt(nextText, 10);
      if (!isNaN(n) && n % 2 === 0) {
        setValue(n);
        lastValidRef.current = n;
      } else {
        setText(String(lastValidRef.current));
        globalThis.Toast?.show('金额需为2的倍数');
      }
    }, 2000);
  };

  const dec = () => {
    const n = Math.max(0, value - 2);
    setValue(n);
    lastValidRef.current = n;
    setText(String(n));
  };
  const inc = () => {
    const n = value + 2;
    setValue(n);
    lastValidRef.current = n;
    setText(String(n));
  };

  return (
    <View className="flex-row items-center justify-center border border-[#ccc] rounded-md overflow-hidden h-[30px]">
      <TouchableOpacity
        onPress={dec}
        style={{
          backgroundColor: '#f7f7f7',
          borderRightWidth: 1,
          borderRightColor: '#999',
        }}
        className="px-2  items-center justify-center bg-white border-r border-[#ccc] bg-[#f0f0f0] h-[30px]">
        <Text className="text-lg  text-[#333]">—</Text>
      </TouchableOpacity>

      <TextInput
        style={{
          fontSize: 12,
          height: 30,
          padding: 0,
          margin: 0,
          width: 60,
          textAlign: 'center',
        }}
        keyboardType="numeric"
        value={text}
        onChangeText={v => {
          setText(v);
          scheduleValidate(v);
        }}
      />
      <TouchableOpacity
        onPress={inc}
        style={{
          backgroundColor: '#f7f7f7',
          borderLeftWidth: 1,
          borderLeftColor: '#999',
        }}
        className="px-2 items-center justify-center bg-[#f7f7f7] border-l border-[#999] h-[30px]">
        <Text className="text-lg  text-[#333]">+</Text>
      </TouchableOpacity>
    </View>
  );
}

// tailwind 已替代内置样式

const OptimizationPage = () => {
  const {getDeadline, getOpimization} = useBetSlipLogic();
  const {data, betAmount} = useLocalSearchParams<{
    data: string;
    betAmount: string;
  }>();
  const {
    selectedMatches,
    matchData,
    selectedPassTypes,
    isRequirePhoto,
    betPlayActiveTab,
  } = useBetInfoStore();
  const {toggleMultiplierModal, showMultiplierModal} = useSlipStore();
  const {lotteryInfo} = useLotteryInfoStore();
  const {shopInfo, loginInfo, userInfo} = useUserStore();
  const [multiplier, setMultiplier] = useState<number>(1);
  const [optimizationData, setOptimizationData] =
    useState<ServerCoreOrder.BonusOptimizationResult>();

  const [planAmount, setPlanAmount] = useState<number>(Number(betAmount));
  const [activeTab, setActiveTab] = useState<OptimizationTab>();

  const list = useMemo(() => {
    const d = optimizationData;
    if (activeTab === '1') return d?.avgBonusDetailList;
    if (activeTab === '2') return d?.hotBonusDetailList;
    if (activeTab === '3') return d?.coldBonusDetailList;
    return d?.coldBonusDetailList;
  }, [activeTab]);

  const [rowMultipliers, setRowMultipliers] = useState<Record<number, number>>(
    () => {
      const init: Record<number, number> = {};
      optimizationData?.avgBonusDetailList?.forEach(
        (row, i) => (init[i] = row.multipart),
      );
      return init;
    },
  );
  useEffect(() => {
    const d = JSON.parse(data);
    
    setOptimizationData(d);
    if(d.avgBonusDetailList.length>0){
      console.log('avgBonusDetailList',d.avgBonusDetailList);
      setActiveTab('1')
    }else if(d.hotBonusDetailList.length>0){
      console.log('hotBonusDetailList',d.hotBonusDetailList);
      setActiveTab('2')
    }else if(d.coldBonusDetailList.length>0){
      console.log('coldBonusDetailList',d.coldBonusDetailList);
      setActiveTab('3')
    }else{
      setActiveTab('1')
    } 
  }, [data]);

  // 切换玩法时按当前列表重置每行倍数，避免错位
  useEffect(() => {
    const init: Record<number, number> = {};
    list?.forEach((row: any, i: number) => (init[i] = row.multipart));
    setRowMultipliers(init);
  }, [list]);

  const totalAmount = useMemo(() => {
    return list?.reduce(
      (sum, item, idx) => sum + (rowMultipliers[idx] ?? item.multipart) * 2,
      0,
    );
  }, [list, rowMultipliers]);
  const debounceGetOpimization = debounce((betAmount: string) => {
    console.log('betAmount', betAmount);
    getOpimization(betAmount);
  }, 1000);
  const calcRowBonus = (idx: number) => {
    const row = list?.[idx];
    const times = rowMultipliers[idx] ?? row?.multipart;
    return (times * (row?.bonus || 1)).toFixed(2);
  };
  const minBuyEndTime = useMemo(() => {
    return Object.keys(selectedMatches)
      .map(matchId => dayjs(matchData[matchId].buyEndTime).valueOf())
      .reduce(
        (minTime, currentTime) =>
          currentTime - minTime < 0 ? currentTime : minTime,
        Infinity,
      );
  }, [selectedMatches, matchData]);
  const betContentSportsLotteryList = useMemo(() => {
    return getBetContentSportsLotteryList(
      selectedMatches,
      matchData,
      SportPlayNameMap[betPlayActiveTab],
      lotteryInfo,
    );
  }, [selectedMatches, matchData, betPlayActiveTab, lotteryInfo]);

  const getCreateOrderCommand = () => {
    const updatedOptimizationData = {
      ...optimizationData,
      avgBonusDetailList:
        activeTab === '1'
          ? optimizationData?.avgBonusDetailList?.map((row, idx) => ({
              ...row,
              multipart: rowMultipliers[idx] ?? row.multipart,
            }))
          : optimizationData?.avgBonusDetailList,
      hotBonusDetailList:
        activeTab === '2'
          ? optimizationData?.hotBonusDetailList?.map((row, idx) => ({
              ...row,
              multipart: rowMultipliers[idx] ?? row.multipart,
            }))
          : optimizationData?.hotBonusDetailList,
      coldBonusDetailList:
        activeTab === '3'
          ? optimizationData?.coldBonusDetailList?.map((row, idx) => ({
              ...row,
              multipart: rowMultipliers[idx] ?? row.multipart,
            }))
          : optimizationData?.coldBonusDetailList,
    };
    if (!optimizationData) return;
    // 拿当前 tab 的奖金明细
    let currentBonusList: typeof optimizationData.avgBonusDetailList = [];
    if (activeTab === '1')
      currentBonusList = updatedOptimizationData?.avgBonusDetailList ?? [];
    if (activeTab === '2')
      currentBonusList = updatedOptimizationData?.hotBonusDetailList ?? [];
    if (activeTab === '3')
      currentBonusList = updatedOptimizationData?.coldBonusDetailList ?? [];

    const totalBonus = currentBonusList?.reduce((sum, row) => {
      const bonus = (row.bonus || 0) * (row.multipart || 0);
      console.log('bonus', bonus);
      return sum + bonus;
    }, 0);
    const keys = Object.keys(selectedMatches);
    const compivisions = keys.map(key => {
      let value = matchData[key];

      return value;
    });

    const dict: ServerCoreOrder.CreateOrderCommand = {
      bettingString: selectedPassTypes.join('#'),
      shopLotteryID: lotteryInfo?.id as string,
      lotteryName: lotteryInfo?.lotteryName as CoreCommonEnum.LotteryName,
      lotteryType: lotteryInfo?.lotteryType as CoreCommonEnum.LotteryType,
      buyEndTime: dayjs(minBuyEndTime).format('YYYY-MM-DD HH:mm:ss'),
      betCount: currentBonusList.length,
      append: '2',
      optimizationType: Number(activeTab) as ServerCoreOrder.OptimizationType,
      optimization: JSON.stringify(updatedOptimizationData),
      bonusDetailList: null,
      single: Object.keys(selectedMatches).length === 1 ? true : false,
      betContentDigitalLottery: null,
      betContentSportsLotteryList: betContentSportsLotteryList,
      betContentTraditionalLotteryList: null,
      playName: SportPlayNameMap[betPlayActiveTab],
      shopCode: shopInfo?.shopCode || 0,
      userID: loginInfo?.userID || '',
      paymentMethod: null,
      betPlay: SportPlayNameMap[betPlayActiveTab],
      betMultiple: multiplier,
      frontEndOnly: JSON.stringify(compivisions),
      winMixAmount: totalBonus.toFixed(2),
      winAmount: totalBonus.toFixed(2),
      betAmount: (Number(planAmount) * multiplier).toFixed(2),
      username: userInfo?.username,
      needUploadTicket: isRequirePhoto,
      lotteryIcon: lotteryInfo?.lotteryIcon as string,
      termNo: null,

      lotteryCategory:
        lotteryInfo?.lotteryCategory as CoreCommonEnum.LotteryCategory,

      lotteryNumber: null,
      paymentStatus: 2,

      commission: '0',
    };
    return dict;
  };
  const creatOrder = () => {
    const dict = getCreateOrderCommand();
    console.log('dict', dict);

    router.push({
      pathname: '/lottery/slip/sport/optimization/payConfirm',
      params: {
        lottery: lotteryInfo?.lotteryName,
        play: SportPlayNameMap[betPlayActiveTab],
        id: lotteryInfo?.id,
        jcBetsInfoString: JSON.stringify(dict),
      },
    });
  };

  return (
    <View className="flex-1 bg-[#f0f0f0]">
      <AppHeader
        title="奖金优化"
        rightComponent={
          <Button title="帮助" type="text" textStyle={{color: '#fff'}} />
        }
      />
      <View className="bg-white justify-center items-center">
        <View className="justify-center items-center py-2">
          <BuyEndTime deadline={getDeadline()} />
        </View>

        {/* 计划购买金额 */}
        <View className="bg-white  flex-row items-center ">
          <Text className="text-md">计划购买金额</Text>
          <View className="flex-row items-center">
            <PlanAmountCounter
              value={planAmount}
              setValue={v => {
                setPlanAmount(v);
                debounceGetOpimization((v).toString());
              }}
            />
            <Text className="ml-2 text-md">元</Text>
          </View>
        </View>
      </View>
      {/* Tabs */}
      <View className="px-4 py-3 bg-white">
        <View className="flex-row items-center bg-[#f0f0f0] rounded-full">
          <TouchableOpacity
            className={`flex-1 items-center py-1 rounded-full ${activeTab === '1' ? `bg-[#FF4D4F]  ` : ''}`}
            style={{backgroundColor: activeTab === '1' ? '#FF4D4F' : '#f0f0f0'}}
            onPress={() => setActiveTab('1')}>
            <Text
              className="text-md"
              style={{color: activeTab === '1' ? '#fff' : '#333'}}>
              平均优化
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 items-center py-1 rounded-full ${activeTab === '2' ? `bg-[#FF4D4F]  ` : ''}`}
            style={{backgroundColor: activeTab === '2' ? '#FF4D4F' : '#f0f0f0'}}
            onPress={() => setActiveTab('2')}>
            <Text
              className="text-md"
              style={{color: activeTab === '2' ? '#fff' : '#333'}}>
              博热优化
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 items-center py-1 rounded-full ${activeTab === '3' ? `bg-[#FF4D4F]  ` : ''}`}
            style={{backgroundColor: activeTab === '3' ? '#FF4D4F' : '#f0f0f0'}}
            onPress={() => setActiveTab('3')}>
            <Text
              className="text-md"
              style={{color: activeTab === '3' ? '#fff' : '#333'}}>
              博冷优化
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 表头，参考订单详情表格样式 */}
      <View className="flex-row justify-between bg-white w-full">
        <Text
          style={{width: 50, lineHeight: 30}}
          className="text-center text-[12px] leading-[30px] bg-[#f0f0f0] font-bold border-r border-white w-[50px]">
          过关
        </Text>
        <Text
          style={{flex: 1, lineHeight: 30}}
          className="text-center text-[12px] leading-[30px] bg-[#f0f0f0] font-bold border-r border-white flex-1">
          单注组合
        </Text>
        <Text
          style={{width: 120, lineHeight: 30}}
          className="text-center text-[12px] leading-[30px] bg-[#f0f0f0] font-bold border-r border-white w-[120px]">
          倍数
        </Text>
        <Text
          style={{width: 60, lineHeight: 30}}
          className="text-center text-[12px] leading-[30px] bg-[#f0f0f0] font-bold border-r border-white w-[60px]">
          预计奖金
        </Text>
      </View>

      <ScrollView>
        {list?.map((row, idx) => (
          <View
            key={idx}
            style={{borderBottomWidth: 1, borderBottomColor: '#ddd'}}
            className="bg-white flex-row items-center justify-between  ">
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
              <Counter
                multiplier={rowMultipliers[idx] ?? row?.multipart}
                showMultiplier={() => {}}
                handleIncrement={() =>
                  setRowMultipliers(s => ({
                    ...s,
                    [idx]: (s[idx] ?? row.multipart) + 1,
                  }))
                }
                handleDecrement={() =>
                  setRowMultipliers(s => ({
                    ...s,
                    [idx]: Math.max(0, (s[idx] ?? row.multipart) - 1),
                  }))
                }
              />
            </View>
            <View
              style={{width: 60, borderRightWidth: 1, borderRightColor: '#ddd'}}
              className="items-center justify-center w-[60px] h-full">
              <Text className="text-[12px] leading-[20px] text-center">
                {calcRowBonus(idx)}元
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 倍投控制（与投注列表一致风格） */}
      <View className="bg-white px-4 py-3 border-t border-gray-200 flex-row ">
        <View className="flex-1" />
        <View className="flex-row items-center">
          <Text className="mr-3 text-lg">投</Text>
          <Counter
            multiplier={multiplier}
            showMultiplier={toggleMultiplierModal}
            handleIncrement={() => setMultiplier(multiplier + 1)}
            handleDecrement={() => setMultiplier(Math.max(1, multiplier - 1))}
          />
          <Text className="ml-2 text-base">倍</Text>
        </View>
      </View>

      {/* 底部合计 */}
      <View className="bg-white px-4 py-3 border-t border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg">
            金额：
            <Text className="text-red-500">
              {Number(planAmount) * multiplier}
            </Text>{' '}
            元
          </Text>
          <Button title="下一步" type="primary" onPress={() => creatOrder()} />
        </View>
      </View>

      {/* 倍数弹窗 */}
      <CustomerMultiplier
        multiplier={multiplier}
        setMultiplier={setMultiplier}
        toggleMultiplierModal={toggleMultiplierModal}
        showMultiplierModal={showMultiplierModal}
      />
    </View>
  );
};

export default OptimizationPage;
