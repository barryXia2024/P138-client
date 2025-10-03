import React from 'react';
import {View, Text} from 'react-native';

import {
  DigitalLotteryNames,
  UIUnit,
} from '../../lotteryTypes/configs/lotteryConfigs';

import BaseNumberGrid from '../../components/common/BaseNumberGrid';
import {ArrangedFivePlayEnum, ArrangedFiveSubPlayEnum} from '../constants';
import BetControls from './BetControls';
import {useArrangedFiveStore} from '../store/useArrangedFiveStore';

// 大乐透单式选号网格
type ArrangedFiveGridProps = {
  activeUI: UIUnit;

  playMode: ArrangedFivePlayEnum;
  subPlayMode: ArrangedFiveSubPlayEnum;
  getNumbers: (positionIndex: number) => number[];
  getSelected: (positionIndex: number) => number[];
  onToggle: (positionIndex: number, n: number) => void;
  getDisplayValue?: (positionIndex: number, n: number) => string | number;
  lotteryName?: CoreCommonEnum.LotteryName;
};

const ArrangedFiveGrid: React.FC<ArrangedFiveGridProps> = ({
  activeUI,
  playMode,
  subPlayMode,
  getNumbers,
  getSelected,
  onToggle,
  getDisplayValue,
}) => {
  const {quickPick} = useArrangedFiveStore();

  // 获取当前玩法的奖金说明
  const getPrizeInfo = () => {
    if (!activeUI) return '';
    
    if (playMode === ArrangedFivePlayEnum.DirectCombinationDuplex) {
      if (subPlayMode === ArrangedFiveSubPlayEnum.CombinationFiveDifferent)
        return <Text>请选择5~8个不同号码（ABCDE）</Text>;
      if (subPlayMode === ArrangedFiveSubPlayEnum.TwoSame)
        return <Text>请选择2个相同号码，3~9个不同号码（AABCD）</Text>;
      if (subPlayMode === ArrangedFiveSubPlayEnum.ThreeSame)
        return <Text>请选择3个相同号码，2~9个不同号码（AAABC）</Text>;
      if (subPlayMode === ArrangedFiveSubPlayEnum.TwoGroupTwoSame)
        return <Text>请选择2组相同号码，2~9个不同号码（AABBC）</Text>;
      if (subPlayMode === ArrangedFiveSubPlayEnum.FourSame)
        return <Text>请选择4个相同号码，1~9个不同号码（AAAAB）</Text>;
      if (subPlayMode === ArrangedFiveSubPlayEnum.ThreeTwoSame)
        return <Text>请选择3个相同号码，1~9个不同号码（AAABB）</Text>;
    }
    return (
      <Text> 每位至少选中一个号码，奖金10万元 </Text>
    );
  };

  return (
    <>
      {activeUI.labels.map((item, index) => (
        <View
          key={index}
          style={{width: '100%'}}
          className="p-3 bg-white justify-between items-center w-full overflow-hidden mb-3 rounded-lg">
          {index === 0 && (
            <View className="bg-white p-3 rounded-lg flex-row justify-between items-center w-full">
              <Text className="text-gray-600 text-sm">{getPrizeInfo()}</Text>
              {/* 机选控制按钮 */}
              <View className="mt-3">
                <BetControls onQuickPick={quickPick} />
              </View>
            </View>
          )}

          <View className="flex-row justify-between items-center w-full">
            <View>
              <Text className="text-2xl font-bold">{item.label}</Text>
            </View>
            <BaseNumberGrid
              numbers={getNumbers(index)}
              selected={getSelected(index)}
              onToggle={n => onToggle(index, n)}
              color={item.color}
              size="large"
              getDisplayValue={
                getDisplayValue
                  ? (n: number) => getDisplayValue(index, n)
                  : undefined
              }
            />
          </View>
        </View>
      ))}
    </>
  );
};
export default ArrangedFiveGrid;
