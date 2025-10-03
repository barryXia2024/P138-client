import React from 'react';
import {View, ScrollView} from 'react-native';
import {router} from 'expo-router';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {CompetitionHeaderRight} from 'src/modules/lottery/components';
import {HistoryPeriodSelector} from '../components';
import {TabSwitcher} from '@/p138-react-common/components';

import {ROUTE_PATHS} from 'src/modules/lottery/constants';
import {useSuperLottoStore} from './store/useSuperLottoStore';
import useSuperLotto from './hooks/useSuperLotto';
import SuperLottoGrid from './components/SuperLottoGrid';
import SuperLottoFooter from './components/SuperLottoFooter';

export default function SuperLottoPage() {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const {playMode, setPlayMode} = useSuperLottoStore();
  const {lotteryData, playTabs, activeUI, onToggle, onNextStep, canProceed} =
    useSuperLotto();
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
        tabs={playTabs}
        activeTab={playMode}
        onTabPress={key => setPlayMode(key)}
      />

      <ScrollView
        className="flex-1 px-4 bg-[#f0f0f0]"
        showsVerticalScrollIndicator={false}>
        <View className=" mt-4">
          <HistoryPeriodSelector
            currentPeriod={lotteryData?.currentTermNo}
            deadline={lotteryData?.buyEndTime}
            needZero={false}
            historyData={lotteryData?.vos || []}
          />
        </View>

        <SuperLottoGrid activeUI={activeUI} onToggle={onToggle} />
      </ScrollView>

      <SuperLottoFooter onNextStep={onNextStep} canProceed={canProceed} />
    </View>
  );
}
