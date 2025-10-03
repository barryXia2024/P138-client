import React, {useMemo, useState} from 'react';
import {View, Text} from 'react-native';
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
import {NativeCheckbox} from '@/p138-react-common/components/checkBox';
import {LotteryName} from '@/p138-react-common/constants/LotteryCommon';
import { useBetlistStore } from '../../betSlip';
 

export default function BetlistPage() {
  const router = useRouter();
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const {
    tickets,
    ticketsMultiplier,
    setTicketsMultiplier,
    removeTicket,
 
    addTicket,
    clearAll,
  } = useBettingListStore();
  const {lotteryData} = useBetlistStore();

 
  const {isSave} = useLocalSearchParams();
  const {saveLotteryPlan, getBetProgram} = useSlip();

  const [multiplierModal, setMultiplierModal] = useState<{
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: DigitalTicket;
  }>({isVisiable: false, value: 1, type: 'multiplier'});

  // 追加与追号
  const [append, setAppend] = useState<'1' | '2'>('2');
  const [chaseNumber, setChaseNumber] = useState<number>(1);

  console.log(tickets);

  const totalAmount = useMemo(() => {
    return tickets.reduce((acc, curr) => {
      const base = curr.betAmount || 0; // 这里的 betAmount 已经是每注2元或计算后的金额
      const multiplier = ticketsMultiplier[curr.betId] || 1;
      // 追加：每注金额从2变3，这里采用比值1.5调整；若外部已按注数算金额，这里等比增量
      const appendFactor = append === '1' ? 1.5 : 1;
      return acc + base * multiplier * appendFactor;
    }, 0);
  }, [tickets, ticketsMultiplier, append]);

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
        deadline={lotteryData?.buyEndTime}
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
        {/* 追加 + 追号 */}
        <View className="flex-row justify-center py-3 items-center">
          {lotteryInfo?.lotteryName === LotteryName.SuperLotto && (
            <NativeCheckbox
              label="追加（最高可中1800万）"
              checked={append === '1'}
              onCheckedChange={() => {
                setAppend(append === '1' ? '2' : '1');
              }}
            />
          )}
          <Text className="mx-3"> </Text>
          <Button
            title={`追号${chaseNumber}期`}
            type="text"
            onPress={() =>
              setMultiplierModal({
                isVisiable: true,
                value: chaseNumber,
                type: 'betTimes',
              })
            }
          />
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
                    tickets.map(t => ({...t, game: 'ArrangedThree'})),
                  ),
                  amout: totalAmount * chaseNumber,
                  multiplierDictString: JSON.stringify(ticketsMultiplier),
                  dictString: JSON.stringify(
                    getBetProgram({
                      lotteryData,
                      tickets,
                      ticketsMultiplier,
                      totalAmount: totalAmount * chaseNumber,
                    }),
                  ),
                  append,
                  chaseNumber,
                },
              });
            }}
            textStyle={{fontSize: 18, fontWeight: 'bold'}}
          />
        </View>
      </View>

      <CustomerMultiplier
        type="digital"
        multiplier={multiplierModal.value}
        setMultiplier={value => {
          if (multiplierModal.type === 'betTimes') {
            setChaseNumber(value);
          } else if (multiplierModal.ticket) {
            ticketsMultiplier[multiplierModal.ticket.betId] = value;
          }
        }}
        maxMultiplierTitle={multiplierModal.type === 'betTimes' ? '期' : '倍'}
        toggleMultiplierModal={() => {
          setMultiplierModal(prev => ({...prev, isVisiable: !prev.isVisiable}));
        }}
        showMultiplierModal={multiplierModal.isVisiable}
      />
    </View>
  );
}
