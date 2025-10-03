import React from 'react';
import {View, Text} from 'react-native';
import {BetInfo} from '../../types';

interface BetInfoDisplayProps {
  betInfo: BetInfo;
}

export const BetInfoDisplay: React.FC<BetInfoDisplayProps> = ({betInfo}) => {
  if (betInfo.betCount === 0) {
    return null;
  }

  return (
    <View className="bg-white p-4 rounded-lg mb-2">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-sm text-gray-600">投注注数</Text>
          <Text className="text-lg font-bold text-red-500">{betInfo.betCount} 注</Text>
        </View>
        <View className="items-end">
          <Text className="text-sm text-gray-600">投注金额</Text>
          <Text className="text-lg font-bold text-red-500">¥{betInfo.betAmount}</Text>
        </View>
      </View>
      
      <View className="mt-3 pt-3 border-t border-gray-200">
        <Text className="text-xs text-gray-500 text-center">
          每注 2 元，投注前请仔细核对号码
        </Text>
      </View>
    </View>
  );
};

export default BetInfoDisplay;
