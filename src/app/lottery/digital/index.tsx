import React from 'react';
import { View, Text } from 'react-native';
import { useLotteryInfoStore } from 'src/modules/lottery/store';
import { LotteryName } from '@/p138-react-common/constants/LotteryCommon';

// 简单直接的彩种页面导入
import SuperLottoPage from './superLotto';
// import ArrangedThreePage from './arrangedThree';
// import ArrangedFivePage from './arrangedFive';
// import SevenStarPage from './sevenStar';

export default function DigitalLotteryPage() {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);

  // 简单的路由逻辑 - 不要过度复杂化
  switch (lotteryInfo?.lotteryName) {
    case LotteryName.SuperLotto:
      return <SuperLottoPage />;
    
    // case LotteryName.ArrangedThree:
    //   return <ArrangedThreePage />;
    
    // case LotteryName.ArrangedFive:
    //   return <ArrangedFivePage />;
    
    // case LotteryName.SevenStar:
    //   return <SevenStarPage />;

    default:
      return (
        <View className="flex-1 bg-gray-100 justify-center items-center">
          <View className="bg-white rounded-lg p-6">
            <Text className="text-lg text-gray-600 mb-2">数字彩游戏</Text>
            <Text className="text-sm text-gray-500">
              当前彩种: {lotteryInfo?.lotteryChineseName || '未选择'}
            </Text>
          </View>
        </View>
      );
  }
}
