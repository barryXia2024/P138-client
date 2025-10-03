import React, {useCallback, useEffect} from 'react';
import {View, ScrollView, Text} from 'react-native';
import {router} from 'expo-router';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {TabSwitcher} from '@/p138-react-common/components';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {ROUTE_PATHS} from 'src/modules/lottery/constants';

import {getSuperLottoUIConfig, SuperLottoTABS} from '../constants';
import useDigitalBase from '../hooks/useDigitalBase';
import useSuperLotto from './hooks/useSuperLotto';
import {
  BallsGrid,
  BetControls,
  ButtonGroupProps,
  DigitalLotteryFooter,
  HistoryPeriodSelector,
  CompetitionHeaderRight,
} from '../components';
import {useSuperLottoStore} from './useSuperLottoStore';
import {superLottoDigitalMissList} from './utils';
import {SuperLottoPlayEnum} from '../types';
import GridTitle from './components/GridTitle';

export default function SuperLottoPage() {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const {positions, betCount, playMode} = useSuperLottoStore();
  const {
    lotteryData,
    onPeriodChange,
    showDigitalMiss,
    onClickDigitalMiss,
  } = useDigitalBase();

  const {
    toggleNumber,
    handleNextStep,
    quickPickOne,
    quickPickFive,
    onClearSelection,
    handleTabPress,
  } = useSuperLotto();

  const ButtonGroupNormal: ButtonGroupProps[] = [
    {
      title: '机选5注',
      style: {width: 70},
      onPress: quickPickFive,
      type: 'button',
    },
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
  const ButtonGroupDanTuo: ButtonGroupProps[] = [
    {
      title: '遗漏',
      onCheckedChange:() => onClickDigitalMiss(!showDigitalMiss),
      type: 'checkbox',
    },
  ];
  const summary =
    playMode === SuperLottoPlayEnum.NORMAL ? (
      <Text className="text-center text-md py-3 text-md">
        已选红 <Text className="text-red-500">{positions[0]?.length || 0}</Text>
        个，蓝球
        <Text className="text-blue-500">{positions[1]?.length || 0}</Text>个
      </Text>
    ) : (
      <Text className="text-center text-md py-3 text-md">
        已选前区胆码
        <Text className="text-red-500">{positions[0]?.length || 0}</Text>
        个，前区拖码
        <Text className="text-red-500">{positions[1]?.length || 0}</Text>
        个，后区胆码
        <Text className="text-blue-500">{positions[2]?.length || 0}</Text>
        个，后区拖码
        <Text className="text-blue-500">{positions[3]?.length || 0}</Text>个
      </Text>
    );

  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader
        title={lotteryInfo?.lotteryChineseName}
        titleDes="玩法说明"
        titleDesOnPress={() => router.push(ROUTE_PATHS.GAME_RULE)}
        onBackPress={() => router.dismissTo('/Home')}
        rightComponent={<CompetitionHeaderRight />}
      />

      <TabSwitcher
        tabs={SuperLottoTABS}
        activeTab={playMode}
        onTabPress={k => {
          handleTabPress(k);
          onClickDigitalMiss(false);
        }}
        tabClassName="p-2"
      />

      <ScrollView
        className="flex-1 px-4 bg-[#f0f0f0]"
        showsVerticalScrollIndicator={false}>
        <HistoryPeriodSelector
          needZero
          lotteryData={
            lotteryData as LotteryDataSource.CharityLotteryDataSource & {
              currentTermNo: string;
              defaultTermNo: string;
            }
          }
          onPeriodChange={onPeriodChange}
        />
        <BallsGrid
          config={getSuperLottoUIConfig(playMode)}
          rowTitle={i => <GridTitle index={i} playMode={playMode} />}
          betControls={
            <BetControls
              buttonGroup={
                playMode === SuperLottoPlayEnum.NORMAL
                  ? ButtonGroupNormal
                  : ButtonGroupDanTuo
              }
              checked={showDigitalMiss}
            />
          }
          positions={positions}
          toggleNumber={toggleNumber}
          showMiss={showDigitalMiss}
          dismissArray={i => {
            const dis = superLottoDigitalMissList(
              lotteryData?.omissionList || [],
              playMode,
            );
            console.log(dis);
            return dis[i];
          }}
        />
      </ScrollView>

      <DigitalLotteryFooter
        onNextStep={handleNextStep}
        summary={summary}
        betCount={betCount}
        betAmount={betCount * 2}
        onClear={onClearSelection}
      />
    </View>
  );
}
