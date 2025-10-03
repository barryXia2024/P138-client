import {router, useLocalSearchParams} from 'expo-router';
import AppHeader from '@/p138-react-common/components/AppHeader';
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import SportLotteryList from './components/lotteryList';

import BetFooter from 'src/modules/lottery/components/LotteryBetFooter';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {lotteryChineseNameMap} from '@/p138-react-common/constants/LotteryCommon';
import { ROUTE_PATHS } from 'src/modules/lottery/constants';

const RightComponent: React.FC = () => {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/help',
          params: {
            helpType: lotteryInfo?.lotteryName,
          },
        })
      }>
      <Text className="text-white text-base">帮助</Text>
    </TouchableOpacity>
  );
};

const SportLotteryBettingList: React.FC = () => {
  const params: {id: string; lotteryName: CommonCommonEnum.LotteryName} =
    useLocalSearchParams();
  const {lotteryName} = params;

  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader
        title={lotteryChineseNameMap[lotteryName]}
        titleDes="玩法说明"
        // titleDesOnPress={() =>
        //   router.push('/lottery/competitiveSports/GameRule')
        // }
        titleDesOnPress={() => router.push(ROUTE_PATHS.GAME_RULE)}
        rightComponent={<RightComponent />}
      />
      <SportLotteryList />
      <BetFooter />
    </View>
  );
};

export default SportLotteryBettingList;
