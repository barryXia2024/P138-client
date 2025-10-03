import React, {useEffect} from 'react';
import {View} from 'react-native';
import {AppHeader, TabSwitcher} from '@/p138-react-common/components';
import {router} from 'expo-router';

import {
  ROUTE_PATHS,
  SportsLotteryConfig,
} from 'src/modules/lottery/constants/lotteryInfo';
import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';

import {
  CompetitionHeaderRight,
  LotteryBetFooter,
} from 'src/modules/lottery/components';
import SportsCompetitionList from 'src/modules/lottery/sport/CompetitionList';

const CompetitiveSports = () => {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const {betPlayActiveTab, setBetPlayActiveTab} = useBetInfoStore();
  const lotteryConfig = SportsLotteryConfig[lotteryInfo?.lotteryName||'FootballLottery'];
  useEffect(() => {
    // 设置默认玩法
    if(lotteryConfig.playTypes[0].key){
      setBetPlayActiveTab(lotteryConfig.playTypes[0].key);
    }
  }, []);

  return (
    <View className="flex-1 bg-f0f0f0">
      <AppHeader
        title={lotteryInfo?.lotteryChineseName}
        titleDes="玩法说明"
        titleDesOnPress={() => router.push(ROUTE_PATHS.GAME_RULE)}
        onBackPress={() => router.dismissTo('/Home')}
        rightComponent={<CompetitionHeaderRight />}
      />
      <TabSwitcher
        tabs={lotteryConfig.playTypes}
        activeTab={betPlayActiveTab}
        onTabPress={setBetPlayActiveTab}
      />
      <SportsCompetitionList  />

      <LotteryBetFooter />
    </View>
  );
};

export default CompetitiveSports;
