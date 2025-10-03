import React from 'react';
import {Text} from 'react-native';
import {
  SuperLottoPlayEnum,
  SuperLottoSubPlayEnum,
} from '../constants/index';

const GridTitle: React.FC<{
  playMode: SuperLottoPlayEnum;
  playSubMode: SuperLottoSubPlayEnum;
  index: number;
}> = ({playMode, index}) => {
  if (playMode === SuperLottoPlayEnum.NORMAL) {
    if (index === 0) {
      return (
        <Text>
          <Text className="text-xl font-bold">前区</Text>
          至少选<Text className="text-red-500">5</Text>个
        </Text>
      );
    }
    if (index === 1) {
      return (
        <Text>
          <Text className="text-xl font-bold">后区</Text>
          至少选<Text className="text-red-500">2</Text>个
        </Text>
      );
    }
    return null;
  }
  if (playMode === SuperLottoPlayEnum.DANTUO) {
    if (index === 0) {
      return (
        <Text>
          <Text className="text-xl font-bold">红球胆码</Text>选
          <Text className="text-red-500">1-5</Text>个红球
        </Text>
      );
    }
    if (index === 1) {
      return (
        <Text>
          <Text className="text-xl font-bold">红球拖码</Text>
          至少选<Text className="text-red-500">2</Text>个号码
        </Text>
      );
    }
    if (index === 2) {
      return (
        <Text>
          <Text className="text-xl font-bold">蓝球</Text>
          至少选<Text className="text-red-500">1</Text>个蓝球
        </Text>
      );
    }
    if (index === 3) {
      return (
        <Text>
          <Text className="text-xl font-bold">蓝球</Text>
          至少选<Text className="text-red-500">1</Text>个蓝球
        </Text>
      );
    }
  }
  return null;
};

export default GridTitle;
