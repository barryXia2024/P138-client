import React from 'react';
import {View, Text} from 'react-native';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {LotteryName} from '@/p138-react-common/constants/LotteryCommon';

// 导入彩种页面
// import {SuperLottoPage, SevenStarPage} from './lotteryPages';
import ArrangedThreeLotteryPage from './arrangedThree';
import ArrangedFiveLotteryPage from './arrangedFive';
import DoubleBallPage from '../../welfare/doubleBall';
 
 
import Fucai3DPage from '../../digital/fucai3d';
import SevenHappyPage from '../../welfare/sevenHappy';
import Happy8Page from '../../welfare/happy8';
import SevenStarLotteryPage from 'src/app/digital/sevenStar';
import SuperLottoPage from '../../digital/superLotto';
 
 

export default function DigitalLotteryPage() {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);

  // 根据彩种名称直接显示对应页面
  if (lotteryInfo?.lotteryName === LotteryName.SuperLotto) {
    return <SuperLottoPage />;
  } else if (lotteryInfo?.lotteryName === LotteryName.SevenStar) {
    return <SevenStarLotteryPage />;
  } else if (lotteryInfo?.lotteryName === LotteryName.ArrangedThree) {
    return <ArrangedThreeLotteryPage />;
  } else if (lotteryInfo?.lotteryName === LotteryName.ArrangedFive) {
    return <ArrangedFiveLotteryPage />;
  } else if (lotteryInfo?.lotteryName === LotteryName.DoubleBall) {
    return <DoubleBallPage />;
  } else if (lotteryInfo?.lotteryName === LotteryName.Fucai3D) {
    return <Fucai3DPage />;
  }else if (lotteryInfo?.lotteryName === LotteryName.SevenHappy) {
    return <SevenHappyPage />;
  }else if (lotteryInfo?.lotteryName === LotteryName.Happy8) {
    return <Happy8Page />;
  }

  // 默认显示彩种选择页面（如果外部没有指定彩种）
  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="bg-white rounded-lg p-6 items-center">
        <Text className="text-lg text-gray-600 mb-4">请选择数字彩彩种</Text>
        <Text className="text-sm text-gray-500 text-center">
          支持：大乐透、七星彩、排列三、排列五
        </Text>
      </View>
    </View>
  );
}
