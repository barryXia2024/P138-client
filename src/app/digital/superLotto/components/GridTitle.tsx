import React from 'react';
import {Text} from 'react-native';
import {SuperLottoPlayEnum} from '../../types';

const GridTitle: React.FC<{
  playMode: SuperLottoPlayEnum;

  index: number;
}> = ({playMode, index}) => {
  if (playMode === SuperLottoPlayEnum.NORMAL) {
    if (index === 0) {
      return (
        <Text className="text-sm text-gray-600">
          <Text className="text-lg font-bold text-black">前区</Text>
          至少选<Text className="text-red-500">5</Text>个
        </Text>
      );
    }
    if (index === 1) {
      return (
        <Text className="text-sm text-gray-600">
          <Text className="text-lg font-bold text-black">后区</Text>
          至少选<Text className="text-red-500">2</Text>个
        </Text>
      );
    }
    return null;
  }
  if (playMode === SuperLottoPlayEnum.DANTUO) {
    if (index === 0) {
      return (
        <Text className="text-sm text-gray-600">
          <Text className="text-lg font-bold text-black">前区胆码</Text>可选
          <Text className="text-red-500">1-4</Text>个红球
        </Text>
      );
    }
    if (index === 1) {
      return (
        <Text className="text-sm text-gray-600">
          <Text className="text-lg font-bold text-black">前区拖码</Text>
          至少选<Text className="text-red-500">2</Text>个号码
        </Text>
      );
    }
    if (index === 2) {
      return (
        <Text className="text-sm text-gray-600">
          <Text className="text-lg font-bold text-black">后区胆码</Text>
          可选<Text className="text-red-500">1</Text>个或不选
        </Text>
      );
    }
    if (index === 3) {
      return (
        <Text className="text-sm text-gray-600">
          <Text className="text-lg font-bold text-black">后区拖码</Text>
          至少选<Text className="text-red-500">2</Text>个号码
        </Text>
      );
    }
  }
  return null;
};

export default GridTitle;
