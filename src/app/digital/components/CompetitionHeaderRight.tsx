import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';

import {useLotteryInfoStore} from 'src/modules/lottery/store';

const CompetitionHeaderRight: React.FC = () => {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);

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
      <TouchableOpacity onPress={goHelp}>
        <Text className="text-white text-base">帮助</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompetitionHeaderRight;
