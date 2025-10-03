import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useBetInfoStore} from 'src/modules/lottery/store/betInfo';
import {Button} from 'tamagui';
import {themeRedColor} from 'p138-react-common/utils/styles/color';

import {jumentSingle} from 'p138-react-common/utils/fuc/lottery/bet';
import {router} from 'expo-router';
import {
  BETTING_MESSAGES,
  ROUTE_PATHS,
  SportsLotteryConfig,
  SportLotteryType,
  SportLotteryTypeEnum,
} from '../constants';

import {getDuplicatedMatchIds, generateOddsCellKey} from '../utils/lottery';
import {useLotteryInfoStore} from '../store';

const LotteryBetFooter = () => {
  const {
    selectedMatches,
    resetStore,
    betPlayActiveTab,
    matchData,
    setSelectedMatches,
    toggleSelection
  } = useBetInfoStore();
  const {lotteryInfo} = useLotteryInfoStore();
  const sportLotteryConfig = SportsLotteryConfig[lotteryInfo.lotteryName];

  const showSingle = () => {
    return sportLotteryConfig.showSingle;
  };

  // C1C玩法：随机选择一场剩余比赛
  const handleC1CAutoSelection = (currentMatchId: string) => {
    const allMatchIds = Object.keys(matchData);
    if (allMatchIds.length === 0) return;
    
    // 随机取一个比赛ID
    let randomMatchId = allMatchIds[Math.floor(Math.random() * allMatchIds.length)];
    
    // 如果取到的是当前已选择的比赛，再随机取一个
    if (randomMatchId === currentMatchId && allMatchIds.length > 1) {
      randomMatchId = allMatchIds[Math.floor(Math.random() * allMatchIds.length)];
    }
    
    const selectedMatch = matchData[randomMatchId];
    
    if (selectedMatch?.handicapDtos) {
      const winDrawLoseHandicap = selectedMatch.handicapDtos.find(
        handicap => handicap.playChineseName === '胜平负',
      );
      
      if (winDrawLoseHandicap?.competitionOddsDtos) {
        // 随机选择2个投注项
        const availableOdds = [...winDrawLoseHandicap.competitionOddsDtos];
        for (let i = 0; i < 2 && availableOdds.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * availableOdds.length);
          const selectedOdd = availableOdds.splice(randomIndex, 1)[0];
          
          const oddsKey = generateOddsCellKey(
            Number(randomMatchId),
            winDrawLoseHandicap,
            selectedOdd
          );
          toggleSelection(randomMatchId, oddsKey, 8);
        }
      }
    }
  };

  const handleProceedToNextStep = () => {
    const keys = Object.keys(selectedMatches);

    // 检查是否选择了比赛
    if (keys.length === 0) {
      Toast.show(sportLotteryConfig.playTypesConfig[betPlayActiveTab].desc);
      return;
    }

    // 检查重复投注
    const isDuplicated = getDuplicatedMatchIds(selectedMatches);
    if (
      isDuplicated &&
      SportLotteryType[lotteryInfo?.lotteryName!] === SportLotteryTypeEnum.Sport
    ) {
      Toast.show(BETTING_MESSAGES.DUPLICATE_BETTING);
      return;
    }

    // 单场比赛的处理
    if (keys.length === 1) {
      let result = jumentSingle(selectedMatches);

      if (betPlayActiveTab === 'C1C') {
        console.log('C1C');
        result = true;
        // 处理C1C玩法的自动选择
        handleC1CAutoSelection(keys[0]);
      }

      if (result) {
        // 单关投注，直接跳转
        router.push({
          pathname: ROUTE_PATHS.BETTING_SLIP,
        });
      } else {
        // 单场比赛但不是单关，显示提示
        Toast.show(sportLotteryConfig.playTypesConfig[betPlayActiveTab].desc);
      }
      return;
    }

    // 多场比赛，直接跳转
    router.push({
      pathname: ROUTE_PATHS.BETTING_SLIP,
    });
  };

  return (
    <View className="flex-row items-center justify-between bg-white border-t border-ccc p-2">
      <View className="flex-row gap-2">
        <TouchableOpacity onPress={resetStore} className="center">
          <Image
            className="w-5 h-5"
            source={require('src/assets/imgs/gendan/delete.png')}
          />
        </TouchableOpacity>
        <View>
          <Text className="text-base font-bold text-black">
            {`已选 ${Object.keys(selectedMatches).length ?? 0} 场`}
            {showSingle() && (
              <Text className="text-red-500">(红色选框可投单关)</Text>
            )}
          </Text>
          <Text className="text-sm text-gray-500">
            {sportLotteryConfig.playTypesConfig[betPlayActiveTab]?.desc}
          </Text>
          <Text className="text-[10px] text-gray-500">
            {sportLotteryConfig.playTypesConfig[betPlayActiveTab]?.toolTip}
          </Text>
        </View>
      </View>
      <Button
        color="#fff"
        style={{backgroundColor: themeRedColor}}
        onPress={handleProceedToNextStep}>
        下一步
      </Button>
    </View>
  );
};

export default LotteryBetFooter;
