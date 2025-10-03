import React, {useMemo, useRef, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {AppHeader, Button} from '@/p138-react-common/components';
import {FlatList} from '@/p138-react-common/components/FlatList';

import {useLotteryInfoStore} from 'src/modules/lottery/store';
import CustomerMultiplier from 'src/app/lottery/slip/sport/components/CustomerMultiplier';

import CustomAlertDialog from '@/p138-react-common/components/CustomAlertDialog';

import {useBettingListStore} from './store/useBettingListStore';

import {DigitalTicket} from '../../core';
import SlipItem from './components/SlipItem';
import useSlip from './hook/useSlip';

import HeaderSection from '../../components/HeaderSection';

export default function BetlistPage() {
  const router = useRouter();
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);

  const {
    tickets,
    ticketsMultiplier,
    setTicketsMultiplier,
    removeTicket,

    lotteryData,
    addTicket,
    clearAll,
  } = useBettingListStore();
  const {isSave} = useLocalSearchParams();
  const [chaseNumber, setChaseNumber] = useState<number>(1);
  const {saveLotteryPlan, getBetProgram} = useSlip();

  const [multiplierModal, setMultiplierModal] = useState<{
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: DigitalTicket;
  }>({isVisiable: false, value: 1, type: 'multiplier'});

  const totalAmount = useMemo(() => {
    return tickets.reduce((acc, curr) => {
      return acc + (curr.betAmount || 0) * (ticketsMultiplier[curr.betId] || 1);
    }, 0);
  }, [tickets, ticketsMultiplier]);

  return (
    <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
      <AppHeader
        title={'选号列表'}
        rightComponent={
          <Button
            title="清空"
            type="text"
            textStyle={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}
            onPress={() => {
              clearAll();
              router.back();
            }}
          />
        }
      />

      <HeaderSection
        deadline={lotteryData?.buyEndTime || '2025-08-30 10:00:00'}
        lotteryName={lotteryInfo?.lotteryName || ''}
        onClearBets={() => {}}
        addTicket={addTicket}
      />

      <FlatList
        data={tickets}
        renderItem={({item}) => (
          <SlipItem
            item={item}
            ticketsMultiplier={ticketsMultiplier}
            setTicketsMultiplier={setTicketsMultiplier}
            removeTicket={removeTicket}
            setMultiplierModal={setMultiplierModal}
          />
        )}
      />

      <View className="bg-white mt-1">
        <View className="flex-row justify-center py-3 items-center">
          <TouchableOpacity
            onPress={() => {
              setMultiplierModal({
                isVisiable: true,
                value: 1,
                type: 'betTimes',
              });
            }}>
            <Text>
              追号<Text className="text-red-500 font-bold">{chaseNumber}</Text>
              期
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between border-t border-gray-300 p-4">
          {isSave !== '1' && (
            <CustomAlertDialog
              title="提示"
              trigger={
                <Button
                  title="保存"
                  className="border-red-500 border"
                  textStyle={{color: 'red', fontSize: 18, fontWeight: 'bold'}}
                />
              }
              description="保存方案后续可以转为投注方案，也可以不投注等开奖后验证您的思路。确定保存吗？"
              onConfirm={() => {
                saveLotteryPlan({
                  lotteryData,
                  tickets,
                  ticketsMultiplier,
                  chaseNumber,
                  totalAmount: totalAmount * chaseNumber,
                
                });
              }}
            />
          )}

          <View className=" items-center justify-center">
            <Text>
              <Text className="text-lg text-red-500 font-bold">
                {totalAmount * chaseNumber}
              </Text>
              元
            </Text>
            <Text>
              <Text className="  text-red-500  ">
                {tickets.reduce((acc, curr) => acc + (curr.betCount || 0), 0)}
              </Text>
              注 <Text className="  text-red-500  ">{chaseNumber}</Text>期
            </Text>
          </View>
          <Button
            title="确认投注"
            type="primary"
            onPress={() => {
              router.push({
                pathname: '/lottery/slip/digitalPayConfirm',
                params: {
                  jcBetsInfoString: JSON.stringify(
                    tickets.map(t => ({...t, game: 'ArrangedFive'})),
                  ),
                  amout: totalAmount,
                  multiplierDictString: JSON.stringify(ticketsMultiplier),
                  dictString: JSON.stringify(
                    getBetProgram(
                      lotteryData,
                      tickets,
                      ticketsMultiplier,
                      totalAmount * chaseNumber,
                      chaseNumber
                    ),
                  ),
                },
              });
            }}
            textStyle={{fontSize: 18, fontWeight: 'bold'}}
          />
        </View>
      </View>

      <CustomerMultiplier
        multiplier={multiplierModal.value}
        type="digital"
        setMultiplier={value => {
          if (multiplierModal.type === 'betTimes') setChaseNumber(value);
          if (multiplierModal.type === 'multiplier' && multiplierModal.ticket) {
            ticketsMultiplier[multiplierModal.ticket!.betId] = value;
          }
        }}
        maxMultiplierTitle={
          multiplierModal?.type === 'multiplier' ? '倍' : '期'
        }
        toggleMultiplierModal={() =>
          setMultiplierModal(prev => ({...prev, isVisiable: !prev.isVisiable}))
        }
        showMultiplierModal={multiplierModal.isVisiable}
      />
    </View>
  );
}
