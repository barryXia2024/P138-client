import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {router} from 'expo-router';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {CompetitionHeaderRight} from 'src/modules/lottery/components';
import {ROUTE_PATHS} from 'src/modules/lottery/constants';
import {TabSwitcher} from '@/p138-react-common/components';

import {useArrangedThreeStore} from './store/useArrangedThreeStore';
import {HistoryPeriodSelector} from '../components';
import ArrangedThreeGrid from './components/ArrangedThreeGrid';
import CommonBetFooter from '../components/common/CommonBetFooter';
import useArrangedTree from './hooks/useArrangedTree';
import QuickItem from '../components/quikItem';
import TopTab from './components/topTab';
import {ArrangedThreePlayEnum} from './constants';
import {useBettingListStore} from './slip/store/useBettingListStore';

const ArrangedThreeLotteryPage: React.FC = () => {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
 
  const { lotteryData, setLotteryData} = useBettingListStore();

  const {
    clearSelection,
    positions,
    playMode,
    subPlayMode,
    applyQuickPickCount,
  } = useArrangedThreeStore();

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
 
    arrangedThreePlayAllDissmiss
  } = useArrangedTree();

  if (!activeUI) return null;

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
        className="flex-1  bg-[#f0f0f0]"
        showsVerticalScrollIndicator={false}>
        {/* 主玩法 */}
        <View className="mt-4">
          <TopTab
            tabs={playTabs}
            onTabPress={e => {
              handlePlayTabPress(e.label as ArrangedThreePlayEnum);
            }}
          />
        </View>

        {/* 子玩法 */}
        {subTabs.length > 0 && (
          <View className="mt-3">
            <TabSwitcher
              tabs={subTabs}
              activeTab={subPlayMode}
              onTabPress={key => handleSubTabPress(key)}
            />
          </View>
        )}

        <View className="mt-4">
          {/* 期数选择器 */}
          <HistoryPeriodSelector
            currentPeriod={lotteryData?.currentTermNo}
            deadline={lotteryData?.buyEndTime}
            historyData={lotteryData?.vos ?? []}
            lotteryData={lotteryData}
            setLotteryData={setLotteryData}
          />

          <ArrangedThreeGrid
            lotteryName={lotteryInfo?.lotteryName}
            activeUI={activeUI}
            playMode={playMode}
            subPlayMode={subPlayMode}
            getNumbers={getNumbers}
            getDisplayValue={getDisplayValue}
            getSelected={i => positions[i] ?? []}
            onToggle={onToggle}
            arrangedThreePlayAllDissmiss={arrangedThreePlayAllDissmiss}
          />
        </View>
        {activeUI.quickPick && (
          <View className="bg-white p-4 rounded-md mt-4">
            <Text className="text-lg font-bold text-gray-500">快速选号</Text>
            <View className="flex-row flex-wrap ">
              {activeUI.quickPick.map(
                (item: {label: string; count?: number}, idx: number) => (
                  <View className="w-1/2 p-2" key={item?.label ?? idx}>
                    <QuickItem
                      item={item}
                      selected={
                        (positions?.[0]?.length ?? 0) === (item?.count ?? 0)
                      }
                      onPress={it => applyQuickPickCount(it?.count ?? 0)}
                    />
                  </View>
                ),
              )}
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

export default ArrangedThreeLotteryPage;
