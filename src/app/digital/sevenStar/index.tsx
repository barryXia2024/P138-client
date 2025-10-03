import React, {useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {router} from 'expo-router';
import AppHeader from '@/p138-react-common/components/AppHeader';

import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {ROUTE_PATHS} from 'src/modules/lottery/constants';

import useDigitalBase from '../hooks/useDigitalBase';

import BallsGrid from '../components/BallsGrid';
import {getSevenStarUIConfig} from '../constants';

import {
  DigitalLotteryFooter,
  BetControls,
  ButtonGroupProps,
  CompetitionHeaderRight,
  HistoryPeriodSelector,
} from '../components';
import useSevenStar from './hooks/useSevenStar';
import {useSevenStarStore} from './useSevenStarStore';
import {sevenStarDigitalMissList} from './utils';

export default function SevenStarLotteryPage() {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const {positions, betCount} = useSevenStarStore();
  const {
    lotteryData,
    onPeriodChange,

    showDigitalMiss,
    onClickDigitalMiss,
  } = useDigitalBase();

  const {toggleNumber, handleNextStep, quickPickOne, onClearSelection} =
    useSevenStar();

  const ButtonGroup: ButtonGroupProps[] = [
    {
      title: '机选',

      onPress: quickPickOne,
      type: 'button',
    },
    {
      title: '遗漏',
      onCheckedChange:() => onClickDigitalMiss(!showDigitalMiss),
      type: 'checkbox',
    },
  ];

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
          lotteryData={
            lotteryData as LotteryDataSource.CharityLotteryDataSource & {
              currentTermNo: string;
              defaultTermNo: string;
            }
          }
          onPeriodChange={onPeriodChange}
        />
      </View>

      <ScrollView
        className="flex-1 px-4 bg-[#f0f0f0]  "
        showsVerticalScrollIndicator={false}>
        <BallsGrid
          config={getSevenStarUIConfig()}
          rowTitle={i => (i === 0 ? '每位最少选择1个号码' : '')}
          betControls={
            <BetControls buttonGroup={ButtonGroup} checked={showDigitalMiss} />
          }
          positions={positions}
          toggleNumber={toggleNumber}
          showMiss={showDigitalMiss}
          dismissArray={i => {
            return sevenStarDigitalMissList(lotteryData?.omissionList || [])[i];
          }}
        />
      </ScrollView>

      <DigitalLotteryFooter
        onNextStep={handleNextStep}
        summary={<View />}
        betCount={betCount}
        betAmount={betCount * 2}
        onClear={onClearSelection}
      />
    </View>
  );
}
