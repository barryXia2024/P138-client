import React, {memo, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import {Image} from 'expo-image';
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import {IMAGE_SIZE} from '@/p138-react-common/utils/styles/theme';
import {icon_lottery_type, icon_lottery_type_text} from './constants';
import {useLotteryGrid} from './useLotteryGrid';

const Item = ({
  item,
  onPress,
  getDisplayInfo,
}: {
  item: ServerCoreLottery.ListCustomLotteryResult;
  onPress: () => void;
  getDisplayInfo: (lottery: ServerCoreLottery.ListCustomLotteryResult) => {
    name: string;
    iconUrl: string;
    description: string;
    isSaleable: boolean;
  };
}) => {
  const info = getDisplayInfo(item);
  return (
    <TouchableOpacity
      activeOpacity={info.isSaleable ? 1 : 0.5}
      className="w-1/4  justify-center items-center"
      onPress={onPress}
      disabled={!info.isSaleable}>
      <OSSImage
        source={{uri: info.iconUrl.replace('https://', 'http://')}}
        style={IMAGE_SIZE.IMAGE_SIZE50}
      />
      <Text className="text-lg font-bold">{info.name}</Text>
      <Text className="text-[12px] text-gray-500">{info.description}</Text>

      <Text className="text-xs text-red-400 mb-1">
        {!info.isSaleable ? '停售' : ' '}
      </Text>
    </TouchableOpacity>
  );
};

const LotteryGridItems: React.FC<HomeProps.LotteryGridItemsProps> = props => {
  // const { className, lotteryData, loading, onPress, getDisplayInfo } = props;

  const {
    lotteryData,

    handleLotteryPress,
    getLotteryDisplayInfo,
  } = useLotteryGrid();

  const categories = [ lotteryData?.category2,lotteryData?.category1];

  return (
    <View className={props.className}>
      {categories.map(
        (lotterys, index) =>
          lotterys &&
          lotterys.length > 0 && (
            <View key={index}>
              {/* 标题 */}
              <View className="flex flex-row items-center">
                <Image
                  source={icon_lottery_type[index]}
                  style={IMAGE_SIZE.IMAGE_SIZE30}
                />
                <Text className="text-xl font-bold ml-2">
                  {icon_lottery_type_text[index]}
                </Text>
              </View>
              <View className="flex flex-row flex-wrap justify-start mt-2">
                {lotterys
                  .sort((a, b) => (a?.lotterySort ?? 0) - (b?.lotterySort ?? 0))
                  .map(lottery => (
                    <Item
                      item={lottery}
                      key={lottery.id}
                      onPress={() => handleLotteryPress(lottery)}
                      getDisplayInfo={getLotteryDisplayInfo}
                    />
                  ))}
              </View>
            </View>
          ),
      )}
    </View>
  );
};

export default memo(LotteryGridItems);
