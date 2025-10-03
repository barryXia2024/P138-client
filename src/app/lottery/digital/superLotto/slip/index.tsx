import React, {useState} from 'react';
import {View} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {ROUTE_DIGITAL_PAY_CONFIRM} from 'src/app/lottery/digital/shared/routes';
import {AppHeader, Button} from '@/p138-react-common/components';
import {useBettingListStore} from './store';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
 
import HeaderSection from 'src/app/lottery/digital/components/HeaderSection';
import TicketList from './components/TicketList';
// import {DigitalTicket} from 'src/app/lottery/sport/digital/core';
import {AppendFlagEnum} from 'src/app/lottery/digital/shared/types';
 
import {useSlipActions} from './hooks/useSlipActions';
import AppendChaseBar from './components/AppendChaseBar';
import SummaryBar from './components/SummaryBar';
import CustomerMultiplier from 'src/app/lottery/slip/sport/components/CustomerMultiplier';
 
 

// SuperLottoItem 已抽为独立组件，便于在数字彩/竞技彩两端共享且不耦合页面

export default function BetlistPage() {
  const router = useRouter();
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const [append, setAppend] = useState<AppendFlagEnum>(
    AppendFlagEnum.NotAppend,
  );
  const {
    tickets,
    ticketsMultiplier,
    setTicketsMultiplier,
    removeTicket,
    addTicket,
    lotteryData,
    clearAll,
  } = useBettingListStore();
  const {isSave} = useLocalSearchParams();
 
  const [chaseNumber, setChaseNumber] = useState(1);
  const [multiplierModal, setMultiplierModal] = useState<{
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: SuperLottoTicket;
  }>({
    isVisiable: false,
    value: 1,
    type: 'multiplier',
  });

  const {
    betTotalAmount,
    submitProgram,
    saveLotteryPlan,
    quickPickSuperLotto,
  } = useSlipActions({
    tickets,
    ticketsMultiplier,
    append,
    chaseNumber,
    lotteryData: lotteryData!,
    lotteryInfo: lotteryInfo!,
    addTicket,
  });

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
        onContinue={() => router.back()}
        onQuickPick={quickPickSuperLotto}
      />

      <TicketList
        tickets={tickets}
        append={append}
        ticketsMultiplier={ticketsMultiplier}
        setTicketsMultiplier={setTicketsMultiplier}
        removeTicket={removeTicket}
        setMultiplierModal={setMultiplierModal}
      />

      <AppendChaseBar
        append={append}
        onToggleAppend={() =>
          setAppend(
            append === AppendFlagEnum.Append
              ? AppendFlagEnum.NotAppend
              : AppendFlagEnum.Append,
          )
        }
        chaseNumber={chaseNumber}
        onOpenChase={() =>
          setMultiplierModal({isVisiable: true, value: 1, type: 'betTimes'})
        }
      />

      <SummaryBar
        isSave={isSave === '1'}
        ticketsCount={tickets.length}
        totalAmount={betTotalAmount() * chaseNumber}
        chaseNumber={chaseNumber}
        onSave={saveLotteryPlan}
        onConfirm={() => {
          const dict: ServerCoreOrder.SaveSchemeCommand =
            submitProgram() ;
            console.log(dict, 'dict');
        
          router.push({
            pathname: ROUTE_DIGITAL_PAY_CONFIRM,
            params: {
              jcBetsInfoString: JSON.stringify(
                tickets.map(t => ({...t, game: 'SuperLotto'})) ,
              ),
              amout: betTotalAmount(),
              multiplierDictString: JSON.stringify(ticketsMultiplier),
              dictString: JSON.stringify(dict),
            },
          });
        }}
      />

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
