import React from 'react';
import {View, Text} from 'react-native';
import {useFucai3DStore} from '../store';
import BaseNumberGrid from '../../shared/components/BaseNumberGrid';
import BetControls from '../../shared/components/BetControls';
import {Fucai3DPlayEnum, Fucai3DSubPlayEnum} from '../shared/enums';
import { DigitalBallSize } from 'src/app/lottery/components/DigitalBall';

interface Fucai3DGridProps {
  onQuickPick?: () => void;
  onQuickPick5?: () => void;
}

const Fucai3DGrid: React.FC<Fucai3DGridProps> = ({
  onQuickPick,
  onQuickPick5,
}) => {
  const {
    positions,
    getUIConfig,
    toggleNumber,
    showMissNumbers,
    onMiss,
    playMode,
    subPlayMode,
  } = useFucai3DStore();

  const config = getUIConfig();

  const getRequirementText = (index: number) => {
    // 直选
    if (
      playMode === Fucai3DPlayEnum.DirectSelection &&
      subPlayMode === Fucai3DSubPlayEnum.PositioningDuplex
    ) {
      return [
        <Text key={index}>
          每位至少选中<Text className="text-red-500">1</Text>个号码，奖金
          <Text className="text-red-500">346</Text>元
        </Text>,
      ];
    }

    // 组三单式
    if (playMode === Fucai3DPlayEnum.GroupThree) {
      if (subPlayMode === Fucai3DSubPlayEnum.Single) {
        return [
          <Text key={index}>
            选择<Text className="text-red-500">1</Text>个重号
            <Text className="text-red-500">1</Text>个单号，奖金
            <Text className="text-red-500">346</Text>元
          </Text>,
        ][index];
      }
      if (subPlayMode === Fucai3DSubPlayEnum.Duplex) {
        return [
          <Text key={index}>
            至少选择<Text className="text-red-500">2</Text>个号码，奖金
            <Text className="text-red-500">346</Text>元
          </Text>,
        ][index];
      }
    }

    // 组六
    if (
      playMode === Fucai3DPlayEnum.GroupSix &&
      subPlayMode === Fucai3DSubPlayEnum.Duplex
    ) {
      return (
        <Text key={index}>
          至少选择<Text className="text-red-500">3</Text>个号码,奖金
          <Text className="text-red-500">173</Text>元
        </Text>
      );
    }

    // 1D
    if (playMode === Fucai3DPlayEnum.OneD) {
      if (subPlayMode === Fucai3DSubPlayEnum.OneD) {
        return [
          <Text key={index}>
            选择<Text className="text-red-500">1</Text>个区，每个号码
            <Text className="text-red-500">3</Text>注
          </Text>,
        ];
      }
      if (subPlayMode === Fucai3DSubPlayEnum.GuessOneD) {
        return `至少选1个`;
      }
    }

    // 2D
    if (playMode === Fucai3DPlayEnum.TwoD) {
      if (subPlayMode === Fucai3DSubPlayEnum.TwoD) {
        return [
          <Text key={index}>
            选择<Text className="text-red-500">2</Text>个区，每个号码
            <Text className="text-red-500">3</Text>注
          </Text>,
        ];
      }
      if (subPlayMode === Fucai3DSubPlayEnum.GuessTwoDDiff) {
        return `至少选3个`;
      }
      if (subPlayMode === Fucai3DSubPlayEnum.GuessTwoDSame) {
        return `至少选2个`;
      }
    }

    return '至少选1个';
  };

  return (
    <View className="flex-1">
      {config.labels.map((labelConfig, index) => (
        <View
          key={index}
          style={{width: '100%'}}
          className="px-3 bg-white justify-between items-center w-full overflow-hidden mb-3 rounded-lg">
          <View className="bg-white p-3 rounded-lg flex-row justify-between items-center w-full">
            <Text className="text-gray-600 text-sm">
              {getRequirementText(index)}
            </Text>

            {/* 机选控制按钮 */}
            {index === 0 && (
              <View className="mt-3">
                <BetControls
                  showQuickPick={true}
                  showQuickFivePick={false}
                  showMissControl={true}
                  showMiss={showMissNumbers}
                  onQuickPick={onQuickPick}
                  onQuickPick5={onQuickPick5}
                  onMiss={onMiss}
                />
              </View>
            )}
          </View>

          <View className="flex-row justify-between items-center w-full py-2">
            <View>
              <Text className="text-xl font-500 mx-1">{labelConfig.label}</Text>
            </View>
            <BaseNumberGrid
              numbers={labelConfig.numbers}
              selected={positions[index] || []}
              onToggle={number => toggleNumber(index, number)}
              color={labelConfig.color}
              size={DigitalBallSize.Large}
              needZero={labelConfig.needZero}
              showDissmiss={showMissNumbers}
              getDisplayValue={e => {
                if (
                  playMode === Fucai3DPlayEnum.GroupThree &&
                  subPlayMode === Fucai3DSubPlayEnum.Single &&
                  index === 0
                ) {
                  return `${e}${e}`;
                }else if(playMode === Fucai3DPlayEnum.TwoD && subPlayMode === Fucai3DSubPlayEnum.GuessTwoDSame){
                  return `${e}${e}`;
                }
                return e;
              }}
              className="bg-white rounded-b-lg pt-0 w-full flex-1"
              // dismissArray={dismissArrayData?.[index]} // 遗漏数据需要从API获取
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default Fucai3DGrid;
