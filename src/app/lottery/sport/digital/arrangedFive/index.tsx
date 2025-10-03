import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {router} from 'expo-router';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {CompetitionHeaderRight} from 'src/modules/lottery/components';
import {ROUTE_PATHS} from 'src/modules/lottery/constants';
import {TabSwitcher} from '@/p138-react-common/components';

import {HistoryPeriodSelector} from '../components';
import ArrangedFiveGrid from './components/ArrangedFiveGrid';
import CommonBetFooter from '../components/common/CommonBetFooter';

import {useArrangedFiveStore} from './store/useArrangedFiveStore';
import useArrangedFive from './hooks/useArrangedFive';
import {ArrangedFivePlayEnum} from './constants';

import DigitalBall from 'src/app/lottery/components/DigitalBall';
import {useBettingListStore} from './slip/store/useBettingListStore';
const ArrangedFiveLotteryPage: React.FC = () => {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);

  const {clearSelection, positions, playMode, subPlayMode} =
    useArrangedFiveStore();
    const { lotteryData, setLotteryData} = useBettingListStore();
  const {
    playTabs,
    subTabs,
    activeUI,
    handlePlayTabPress,
    handleSubTabPress,
    canProceed,
    onNextStep,
    getNumbers,
    getDisplayValue,
    onToggle,
    ticket,
 
    getSelected,
  } = useArrangedFive();

  if (!activeUI) return null;
  console.log(playMode,subPlayMode)

  

  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader
        title={lotteryInfo?.lotteryChineseName}
        titleDes="玩法说明"
        titleDesOnPress={() => router.push(ROUTE_PATHS.GAME_RULE)}
        onBackPress={() => router.dismissTo('/Home')}
        rightComponent={<CompetitionHeaderRight />}
      />

      <ScrollView
        className="flex-1 px-4 bg-[#f0f0f0]"
        showsVerticalScrollIndicator={false}>
        {/* 主玩法 */}
        <View className="my-4">
          <TabSwitcher
            tabs={playTabs}
            activeTab={playMode}
            onTabPress={key => handlePlayTabPress(key)}
          />
        </View>
        {/* 期数选择器 */}
        <HistoryPeriodSelector
          currentPeriod={lotteryData?.currentTermNo}
          onPeriodChange={() => {}}
          deadline={lotteryData?.buyEndTime}
          historyData={lotteryData?.vos ?? []}
          lotteryData={lotteryData}
          setLotteryData={setLotteryData}
        />
        {/* 子玩法 */}
        {subTabs.length > 0 &&
          playMode === ArrangedFivePlayEnum.DirectCombinationDuplex && (
            <View>
              <TabSwitcher
                tabs={subTabs}
                activeTab={subPlayMode}
                onTabPress={key => handleSubTabPress(key)}
              />
            </View>
          )}

        <View className="mt-4">
          <ArrangedFiveGrid
            lotteryName={lotteryInfo?.lotteryName}
            activeUI={activeUI}
            playMode={playMode}
            subPlayMode={subPlayMode}
            getNumbers={getNumbers}
            getDisplayValue={getDisplayValue}
            getSelected={getSelected}
            onToggle={onToggle}
          />
        </View>
        {playMode === ArrangedFivePlayEnum.DirectCombinationDuplex && (
          <View className="mt-4 bg-white p-4 rounded-lg w-full flex-1">
            <Text className="text-sm text-gray-500">所选号码</Text>
            <View className="flex-row flex-wrap gap-2 mt-2 flex-1">
              {positions[positions.length - 1]?.map((position, index) => (
                <DigitalBall
                  key={index}
                  value={position}
                  color="red"
                  size="large"
                  selected
                  onClick={() =>{
                     
                     
         
                    removeFromArray(position);
                  }}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <CommonBetFooter
        summary={null}
        betCount={ticket?.betCount ?? 0}
        betAmount={ticket?.betAmount ?? 0}
        canProceed={canProceed}
        onClear={clearSelection}
        onNextStep={onNextStep}
      />
    </View>
  );
};

export default ArrangedFiveLotteryPage;
