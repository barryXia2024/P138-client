import React, {useCallback, useEffect} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {router} from 'expo-router';
import AppHeader from '@/p138-react-common/components/AppHeader';

import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {ROUTE_PATHS} from 'src/modules/lottery/constants';
import {CompetitionHeaderRight} from 'src/modules/lottery/components';
import {
  BetControls,
  HistoryPeriodSelector,
  // NumberSelectionGrid,
  // HistoryPeriodSelector,
} from '../../components';
// import {mockHistoryData} from '../../mockdata/historyData';
import {SevenStarGrid} from '../../components/common/LotteryGrids';
import {SevenStarUIConfig} from '../../lotteryTypes/sevenStar/uiConfig';
import SevenStarBetFooter from '../../components/bet-footer/SevenStarBetFooter';
import {useSevenStarStore} from '../../lotteryTypes/sevenStar';
import {buildSevenStarTicket, useBetlistStore} from '../../betSlip';

import {getCharityLotteryData} from 'src/api/interface/lottery-lottery-type-data';
import {sevenStarPlayAllDissmiss} from '../../lotteryTypes/utils/combination';

export default function SevenStarLotteryPage() {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);

  const betCount = useSevenStarStore(s => s.getBetCount());
  const positions = useSevenStarStore(s => s.positions);
  const {showDissmiss, clearSelection} = useSevenStarStore();
  const {clearAll, addTicket, setLotteryData, lotteryData} = useBetlistStore();

  // const currentPeriod = mockHistoryData[0]?.termNo || '25094';
  // const deadline = '2025-08-18 20:50:00';

  const canProceed = betCount > 0;
  useEffect(() => {
    clearAll();

    if (lotteryInfo?.lotteryName) {
      getCharityLotteryData({lotteryName: lotteryInfo?.lotteryName}).then(
        res => {
          if (res.success && res.data) {
            setLotteryData(res.data);
          }
        },
      );
    }
    return () => {
      clearAll();
      clearSelection();
    };
  }, []);
  const handleNextStep = useCallback(async () => {
    if (!canProceed) {
      Toast.show('请按规则完成选号');
      return;
    }

    const ticket = await buildSevenStarTicket();
    console.log('ticket', ticket);
    if (!ticket) return;
    addTicket(ticket);
    // 清空当前选号
    useSevenStarStore.getState().clearSelection();
    // 跳转 betlist
    router.push({pathname: '/lottery/sport/digital/betlist'});
  }, [canProceed]);

  const dismissArray = useCallback(() => {
    return sevenStarPlayAllDissmiss(lotteryData?.omissionList || []);
  }, [lotteryData?.omissionList]);
  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader
        title={lotteryInfo?.lotteryChineseName}
        titleDes="玩法说明"
        titleDesOnPress={() => router.push(ROUTE_PATHS.GAME_RULE)}
        onBackPress={() => router.dismissTo('/Home')}
        rightComponent={<CompetitionHeaderRight />}
      />

      <View className="px-4 mt-2">
        <HistoryPeriodSelector
          currentPeriod={lotteryData?.currentTermNo}
          deadline={lotteryData?.buyEndTime}
          historyData={lotteryData?.vos?.map(item => ({
            termNo: item.termNo,
            result: item.result,
          }))}
          lotteryData={lotteryData}
          setLotteryData={setLotteryData}
        />
      </View>

      <ScrollView
        className="flex-1 px-4 bg-[#f0f0f0]  "
        showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center bg-white  px-4 pt-2">
          <Text className="text-sm text-gray-500  flex-1">
            每位最少选择1个号码
          </Text>
          <BetControls type="SevenStar" />
        </View>
        <SevenStarGrid
          getNumbers={i => SevenStarUIConfig.labels[i].numbers}
          getSelected={i => positions[i] ?? []}
          onToggle={(i, n) => useSevenStarStore.getState().toggleNumber(i, n)}
          showDissmiss={showDissmiss}
          dismissArray={dismissArray()}
        />
      </ScrollView>

      <SevenStarBetFooter onNextStep={handleNextStep} canProceed={canProceed} />
    </View>
  );
}
