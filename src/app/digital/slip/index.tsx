import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {AppHeader, Button} from '@/p138-react-common/components';
import {FlatList} from '@/p138-react-common/components/FlatList';

import CustomerMultiplier from 'src/app/lottery/slip/sport/components/CustomerMultiplier';
import useSlip from './hooks/useSlip';
import {DigitalLotteryName, PositionTicket} from '../types';
import {useDigitalBetStore} from '../store/useDigitalBet';
import {HeaderSection, SevenStarItem} from './components';
import {SlipItemProps} from './types';
import {sevenStarQuickPickOneTicket} from '../sevenStar/utils';
import {AppendChaseBar} from '../components';
import SummaryBar from '../components/SummaryBar';
import SuperLottoSlipItem from './components/SuperLottoSlipItem';
import {superLottoQuickPickOneTicket} from '../superLotto/utils';

const SlipItemMap: Record<DigitalLotteryName, React.FC<SlipItemProps>> = {
  SevenStar: SevenStarItem,
  SuperLotto: SuperLottoSlipItem,
  ArrangedThree: SevenStarItem,
  ArrangedFive: SevenStarItem,
  DoubleBall: SevenStarItem,
  Fucai3D: SevenStarItem,
};

const quickPickMap: Record<DigitalLotteryName, () => PositionTicket> = {
  SevenStar: sevenStarQuickPickOneTicket,
  SuperLotto: superLottoQuickPickOneTicket,
  ArrangedThree: sevenStarQuickPickOneTicket,
  ArrangedFive: sevenStarQuickPickOneTicket,
  DoubleBall: sevenStarQuickPickOneTicket,
  Fucai3D: sevenStarQuickPickOneTicket,
};

export default function BetlistPage() {
  const router = useRouter();

  const {isSave} = useLocalSearchParams();
  const [chaseNumber, setChaseNumber] = useState<number>(1);
  const [append, setAppend] = useState<boolean>(false);
  const {
    saveLotteryPlan,
    getBetProgram,
    ticketsMultiplier,
    onTicketsMultiplierChange,
  } = useSlip();
  const {clearAllTickets, tickets, lotteryData, addTicket, removeTicket} =
    useDigitalBetStore();

  const [multiplierModal, setMultiplierModal] = useState<{
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: PositionTicket;
  }>({isVisiable: false, value: 1, type: 'multiplier'});

  const RenderItem = (item: PositionTicket) => {
    const SlipItem =
      SlipItemMap[
        (lotteryData?.lotteryName as DigitalLotteryName) || 'SevenStar'
      ];

    return (
      <SlipItem
        ticket={item}
        append=""
        ticketsMultiplier={ticketsMultiplier}
        setTicketsMultiplier={onTicketsMultiplierChange}
        removeTicket={removeTicket}
        setMultiplierModal={setMultiplierModal}
      />
    );
  };

  const quickPick = () => {
    const quickPickOne =
      quickPickMap[
        (lotteryData?.lotteryName as DigitalLotteryName) || 'SevenStar'
      ];
    const position = quickPickOne();

    addTicket(position);
  };
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
              clearAllTickets();
              router.back();
            }}
          />
        }
      />

      <HeaderSection
        deadline={lotteryData?.buyEndTime || '2025-08-30 10:00:00'}
        quickPick={quickPick}
      />

      <FlatList
        data={tickets.sort((a, b) => Number(b.betId) - Number(a.betId))}
        renderItem={({item}) => <RenderItem {...item} />}
      />

      <View className="bg-white mt-1">
        <AppendChaseBar
          append={append}
          onToggleAppend={() => setAppend(!append)}
          chaseNumber={chaseNumber}
          onOpenChase={() =>
            setMultiplierModal({isVisiable: true, value: 1, type: 'betTimes'})
          }
        />
        <SummaryBar
          isSave={isSave === '1'}
          ticketsCount={tickets.length}
          totalAmount={totalAmount * chaseNumber}
          chaseNumber={chaseNumber}
          onSave={() => {
            saveLotteryPlan({
              lotteryData:
                lotteryData as LotteryDataSource.CharityLotteryDataSource,
              tickets,
              ticketsMultiplier,
              chaseNumber,
              totalAmount: totalAmount * chaseNumber,
            });
          }}
          onConfirm={() => {
            router.push({
              pathname: '/digital/slip/payConfirm',
              params: {
                betProgram: JSON.stringify(
                  getBetProgram({
                    lotteryData:
                      lotteryData as LotteryDataSource.CharityLotteryDataSource,
                    tickets,
                    ticketsMultiplier,
                    totalAmount: totalAmount,
                    chaseNumber,
                  }),
                ),
              },
            });
          }}
        />
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
