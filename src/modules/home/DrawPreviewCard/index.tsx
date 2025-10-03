import {
  COLORS,
  FONT_SIZES,
  IMAGE_SIZE,
} from 'p138-react-common/utils/styles/theme';
import React, {memo} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {lotteryChineseNameMap} from '@/p138-react-common/constants/LotteryCommon';
import {LotteryIconMap} from '../../lottery/constants/LotteryCommon';
import dayjs from 'dayjs';

import {useDrawPreview} from './useDrawPreview';

const DrawPreviewCard: React.FC = () => {
  const {drawData, handleFootballDrawPress, handleBasketballDrawPress, handleBeijingSingleMatchDrawPress} =
    useDrawPreview();
  const matchResult = (
    drawInfo: LotteryDrawAnnoumcememt.SportsDrawAnnouncement,
    onPress: () => void,
  ) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        className="border border-gray-300 bg-white mx-5 my-2 rounded-md p-2 elevation-1 gap-1">
        <View className="flex-row items-center gap-2">
          <Image
            source={
              LotteryIconMap[
                drawInfo.lotteryName as keyof typeof LotteryIconMap
              ]
            }
            style={{width: 30, height: 30}}
            resizeMode="stretch"
          />
          <Text style={{fontSize: FONT_SIZES.medium}}>
            {
              lotteryChineseNameMap[
                drawInfo.lotteryName as keyof typeof lotteryChineseNameMap
              ]
            }
          </Text>
          <Text style={{fontSize: FONT_SIZES.medium, color: '#999'}}>
            {dayjs(drawInfo.termNo).format('YYYY-MM-DD')}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text style={{fontSize: FONT_SIZES.medium}}>
              {drawInfo.matchNum}
            </Text>
            <Text
              className="text-white px-2 py-1 rounded-md"
              style={[
                {
                  backgroundColor: drawInfo.leagueColor,
                  fontSize: FONT_SIZES.small,
                },
              ]}>
              {drawInfo.leagueName}
            </Text>
          </View>
          <View className="flex-row items-center gap-2 justify-between">
            <Text style={{fontSize: FONT_SIZES.medium}}>{drawInfo.home}</Text>
            <Text style={{fontSize: FONT_SIZES.medium, color: COLORS.themeRed}}>
              {drawInfo.matchScore}
            </Text>
            <Text style={{fontSize: FONT_SIZES.medium}}>{drawInfo.away}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="bg-white mb-2">
      <View className="flex-row items-center gap-2">
        <Image
          source={require('src/assets/imgs/home/icon_award.png')}
          style={IMAGE_SIZE.IMAGE_SIZE30}
        />
        <Text style={{fontSize: FONT_SIZES.large, fontWeight: 'bold'}}>
          开奖公告
        </Text>
      </View>
      {drawData.FootballLottery &&
        drawData.FootballLottery.length > 0 &&
        matchResult(drawData.FootballLottery[0], () =>
          handleFootballDrawPress(),
        )}
      {drawData.BasketballLottery &&
        drawData.BasketballLottery.length > 0 &&
        matchResult(drawData.BasketballLottery[0], () =>
          handleBasketballDrawPress(),
        )}
      {drawData.BeijingSingleMatch &&
        drawData.BeijingSingleMatch.length > 0 &&
        matchResult(drawData.BeijingSingleMatch[0], () =>
          handleBeijingSingleMatchDrawPress(),
        )}
    </View>
  );
};

export default memo(DrawPreviewCard);
