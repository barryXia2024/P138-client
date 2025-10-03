import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';
import {Image} from 'expo-image';
import {useLotteryInfoStore, useLotteryEventStore} from '../store';
import {IMAGE_SIZE} from '@/p138-react-common/utils/styles/theme';
import { LotteryTypeEnum } from '@/p138-react-common/constants';

const CompetitionHeaderRight: React.FC = () => {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const {setFilterDialog, filterDialog} = useLotteryEventStore();
  const onFilterPress = () => {
    setFilterDialog({
      isVisible: true,
      matchData: filterDialog.matchData,
      lotteryName: filterDialog.lotteryName,
    });
  };
  const goHelp = () => {
    router.push({
      pathname: '/help',
      params: {
        helpType: lotteryInfo?.lotteryName,
      },
    });
  };
  return (
    <View className="flex-row gap-2">
      {lotteryInfo?.lotteryType===LotteryTypeEnum.Sport&&<TouchableOpacity onPress={onFilterPress}>
        <Image
          source={require('src/assets/imgs/lottery/scratch/button-icon2.png')}
          style={IMAGE_SIZE.IMAGE_SIZE20}
        />
      </TouchableOpacity>}
      <TouchableOpacity onPress={goHelp}>
        <Text className="text-white text-base">帮助</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompetitionHeaderRight;
