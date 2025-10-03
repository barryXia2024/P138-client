import React from 'react';
import {View, Text} from 'react-native';

import {
  DigitalLotteryNames,
  UIUnit,
} from '../../lotteryTypes/configs/lotteryConfigs';

import BaseNumberGrid from '../../components/common/BaseNumberGrid';
import {ArrangedThreePlayEnum, ArrangedThreeSubPlayEnum} from '../constants';
import BetControls from './BetControls';
import {useArrangedThreeStore} from '../store/useArrangedThreeStore';

// 大乐透单式选号网格
type ArrangedThreeGridProps = {
  activeUI: UIUnit;

  playMode: ArrangedThreePlayEnum;
  subPlayMode: ArrangedThreeSubPlayEnum;
  getNumbers: (positionIndex: number) => number[];
  getSelected: (positionIndex: number) => number[];
  onToggle: (positionIndex: number, n: number) => void;
  arrangedThreePlayAllDissmiss: (dissmissArray: string[]) => string[][];
  getDisplayValue?: (positionIndex: number, n: number) => string | number;
  lotteryName?: CoreCommonEnum.LotteryName;
};

const ArrangedThreeGrid: React.FC<ArrangedThreeGridProps> = ({
  activeUI,
  playMode,
  subPlayMode,
  getNumbers,
  getSelected,
  onToggle,
  getDisplayValue,
  arrangedThreePlayAllDissmiss
}) => {
  const {quickPick,showMissNumbers,setShowMissNumbers} = useArrangedThreeStore();

   

  const headerTitle = {
    // 直选
    [ArrangedThreePlayEnum.DirectSelection]: {
      [ArrangedThreeSubPlayEnum.PositioningDuplex]: [
        <Text key={ArrangedThreeSubPlayEnum.PositioningDuplex}>
          每位至少选择<Text className="text-red-500">1</Text>个号码,奖金
          <Text className="text-red-500">1040</Text>元
        </Text>,
      ],
      [ArrangedThreeSubPlayEnum.CombinationDifferent]: [
        <Text key={ArrangedThreeSubPlayEnum.CombinationDifferent}>
          至少选择<Text className="text-red-500">3</Text>个号码,奖金
          <Text className="text-red-500">1040</Text>元
        </Text>,
      ],
      [ArrangedThreeSubPlayEnum.SumValue]: [
        <Text key={ArrangedThreeSubPlayEnum.SumValue}>
          每位至少选择<Text className="text-red-500">1</Text>个号码,奖金
          <Text className="text-red-500">1040</Text>元
        </Text>,
      ],
      [ArrangedThreeSubPlayEnum.CombinationDrag]: [
        <Text key={ArrangedThreeSubPlayEnum.CombinationDrag}>
          <Text className='text-xl font-bold'>胆码</Text> 选择个<Text className="text-red-500">1-2</Text>个号码 ,奖金
          <Text className="text-red-500">1040</Text>元
        </Text>,
        <Text key={ArrangedThreeSubPlayEnum.CombinationDrag}>
        <Text className='text-xl font-bold'>拖码</Text> 胆码与拖码数量之和大于等于<Text className="text-blue-500">4</Text>
           
        </Text>,
      ],
      [ArrangedThreeSubPlayEnum.SpanDuplex]: [
        <Text key={ArrangedThreeSubPlayEnum.SpanDuplex}>
          至少选择<Text className="text-red-500">1</Text>个跨度值(
          <Text className="text-red-500">1-9</Text>),奖金
          <Text className="text-red-500">1040</Text>元
        </Text>,
      ],
    },
    [ArrangedThreePlayEnum.GroupThree]: {
      [ArrangedThreeSubPlayEnum.Single]: [
        <Text key={ArrangedThreeSubPlayEnum.Single}>
          只能选择<Text className="text-red-500">1</Text>个重号
          <Text className="text-red-500">1</Text>个单号 ,奖金
          <Text className="text-red-500">346</Text>元
        </Text>,
      ],
      [ArrangedThreeSubPlayEnum.Duplex]: [
        <Text key={ArrangedThreeSubPlayEnum.Duplex}>
          至少选择<Text className="text-red-500">2</Text>个号码,奖金
          <Text className="text-red-500">346</Text>元
        </Text>,
      ],
      [ArrangedThreeSubPlayEnum.CourageDragged]: [
        <Text key={ArrangedThreeSubPlayEnum.CourageDragged}>
        <Text className='text-xl font-bold'>胆码</Text> 选择<Text className="text-red-500">1</Text>个号码
        </Text>,
        <Text key={ArrangedThreeSubPlayEnum.CourageDragged}>
        <Text className='text-xl font-bold'>拖码</Text> 选择<Text className="text-red-500">2</Text>个以上与胆码不同的号码
        </Text>,
      ],
      [ArrangedThreeSubPlayEnum.SpanDuplex]: [
        <Text key={ArrangedThreeSubPlayEnum.SpanDuplex}>
          至少选择<Text className="text-red-500">1</Text>个跨度值 ,奖金
          <Text className="text-red-500">346</Text>元
        </Text>,
      ],
    },
    [ArrangedThreePlayEnum.GroupSix]: {
      [ArrangedThreeSubPlayEnum.Duplex]: [
        <Text key={ArrangedThreeSubPlayEnum.Duplex}>
          至少选择<Text className="text-red-500">3</Text>个号码,奖金
          <Text className="text-red-500">173</Text>元
        </Text>,
      ],
      [ArrangedThreeSubPlayEnum.CourageDragged]: [
        <Text key={ArrangedThreeSubPlayEnum.CourageDragged}>
          胆码 选择<Text className="text-red-500">1-2</Text>个号码
        </Text>,
        <Text key={ArrangedThreeSubPlayEnum.CourageDragged}>
          拖码 选择<Text className="text-red-500">2</Text>
          个以上与胆码不同的号码
        </Text>,
      ],
      [ArrangedThreeSubPlayEnum.SpanDuplex]: [
        <Text key={ArrangedThreeSubPlayEnum.SpanDuplex}>
          至少选择<Text className="text-red-500">1</Text>个跨度值
        </Text>,
      ],
    },
    [ArrangedThreePlayEnum.Group]: {
      [ArrangedThreeSubPlayEnum.GroupSumValue]: [
        <Text key={ArrangedThreeSubPlayEnum.SumValue}>
          至少选择<Text className="text-red-500">1</Text>个和值,奖金
          <Text className="text-red-500">1040</Text>元
        </Text>,
      ],
      [ArrangedThreeSubPlayEnum.GroupTwoCode]: [
        <Text key={ArrangedThreeSubPlayEnum.GroupTwoCode}>
          选择<Text className="text-red-500">2</Text>个号码
        </Text>,
      ],
    },
  } as const;

  // 获取当前玩法的奖金说明
  const getPrizeInfo = (index: number) => {
    if (!activeUI) return '';
    const rules = activeUI.positionRules;
    if (!rules || rules.length === 0) return '奖金1040元';
    const array = headerTitle[playMode][subPlayMode];

    return array[index];
  };

  return (
    <>
      {activeUI.labels.map((item, index) => (
        <View
          key={index}
          style={{width: '100%'}}
          className="px-3 bg-white justify-between items-center w-full overflow-hidden mb-3 rounded-lg">
          <View className="bg-white p-3 rounded-lg flex-row justify-between items-center w-full">
            <Text className="text-gray-600 text-sm ">
              {getPrizeInfo(index)}
            </Text>
            {/* 机选控制按钮 */}
            {index === 0 && (
              <View className="mt-3">
                <BetControls
                  onQuickPick={quickPick}
                  
                  onMiss={() => setShowMissNumbers(!showMissNumbers)}
                  showMissControl={item.showMissControl}
                  showQuickPick={item.showQuickPick}
                  showQuickFivePick={item.showQuickFivePick}
                />
              </View>
            )}
          </View>

          <View className="flex-row justify-between items-center w-full">
            <View>
              <Text className="text-xl font-500">{item.label}</Text>
            </View>
            <BaseNumberGrid
              numbers={getNumbers(index)}
              selected={getSelected(index)}
              onToggle={n => onToggle(index, n)}
              color={item.color}
              size="large"
              needZero={item.needZero}
              showDissmiss={showMissNumbers}
              dismissArray={arrangedThreePlayAllDissmiss()[index]}
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
export default ArrangedThreeGrid;
