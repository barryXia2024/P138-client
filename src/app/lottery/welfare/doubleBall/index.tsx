import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {router} from 'expo-router';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {CompetitionHeaderRight} from 'src/modules/lottery/components';
import {ROUTE_PATHS} from 'src/modules/lottery/constants';
import {TabSwitcher} from '@/p138-react-common/components';

import {HistoryPeriodSelector} from '../../sport/digital/components';

import CommonBetFooter from '../../sport/digital/components/common/CommonBetFooter';
import {useDoubleBallStore} from './store/useDoubleBallStore';
import useDoubleBall from './hooks/useDoubleBall';

import DoubleBallsGrid from './components/DoubleBallsGrid';
import {DoubleBallPlayEnum} from './constants';

const DoubleBallPage: React.FC = () => {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const {playMode,lotteryData,setLotteryData} = useDoubleBallStore();

  const {
    playTabs,

    activeUI,
    handlePlayTabPress,
    canProceed,
    onNextStep,
    ticket,
 
    onToggle,
  } = useDoubleBall();

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
        <TabSwitcher
          tabs={playTabs}
          activeTab={playMode}
          onTabPress={key => handlePlayTabPress(key as DoubleBallPlayEnum)}
        />

        <View className="mt-4">
          {/* 期数选择器 */}
          <HistoryPeriodSelector
            currentPeriod={lotteryData?.currentTermNo}
            deadline={lotteryData?.buyEndTime}
            historyData={lotteryData?.vos ?? []}
            lotteryData={lotteryData}
            setLotteryData={setLotteryData}
          />

          <DoubleBallsGrid activeUI={activeUI} onToggle={onToggle} />
        </View>
      </ScrollView>

      <CommonBetFooter
        summary={null}
        betCount={ticket?.betCount ?? 0}
        betAmount={ticket?.betAmount ?? 0}
        canProceed={canProceed}
        onClear={() => {}}
        onNextStep={onNextStep}
      />
    </View>
  );
};

export default DoubleBallPage;
