import React, {ReactNode, useCallback} from 'react';
import {View, Text} from 'react-native';
import BaseNumberGrid from './BaseNumberGrid';
import BetControls from '../bet-controls/BetControls';
import {
  DigitalLotteryNames,
  UIUnit,
} from '../../lotteryTypes/configs/lotteryConfigs';
import {LabelConfig} from '../../lotteryTypes/superLotto/uiConfig';
import {useSuperLottoStore} from '../../lotteryTypes';
import {superLottoPlayAllDissmiss} from '../../lotteryTypes/utils/combination';
import {useBetlistStore} from '../../betSlip';
import {SuperLottoPlayEnum, SuperLottoSubPlayEnum} from '../../types';

// 七星彩选号网格
type SevenStarGridProps = {
  getNumbers: (positionIndex: number) => number[];
  getSelected: (positionIndex: number) => number[];
  onToggle: (positionIndex: number, n: number) => void;
  showDissmiss: boolean;
  dismissArray: string[][];
};

export const SevenStarGrid: React.FC<SevenStarGridProps> = ({
  getNumbers,
  getSelected,
  onToggle,
  showDissmiss,
  dismissArray,
}) => {
  const labels = ['一', '二', '三', '四', '五', '六', '七'];
  return (
    <>
      {Array.from({length: 7}).map((_, index) => (
        <View
          key={index}
          style={{width: '100%'}}
          className={`p-3 bg-white flex-row justify-between items-center w-full overflow-hidden mb-3  ${index === 0 ? 'rounded-b-lg' : 'rounded-lg'}`}>
          <View>
            <Text className="text-lg font-bold">第{labels[index]}位</Text>
          </View>
          <BaseNumberGrid
            numbers={getNumbers(index)}
            selected={getSelected(index)}
            onToggle={n => onToggle(index, n)}
            color="red"
            size="large"
            needZero={index === 6} // 第七位需要0
            showDissmiss={showDissmiss}
            dismissArray={dismissArray[index]}
          />
        </View>
      ))}
    </>
  );
};

// 排列三选号网格
type ArrangedThreeGridProps = {
  getNumbers: (positionIndex: number) => number[];
  getSelected: (positionIndex: number) => number[];
  onToggle: (positionIndex: number, n: number) => void;
};

export const ArrangedThreeGrid: React.FC<ArrangedThreeGridProps> = ({
  getNumbers,
  getSelected,
  onToggle,
}) => {
  const labels = ['百', '十', '个'];
  return (
    <>
      {Array.from({length: 3}).map((_, index) => (
        <View
          key={index}
          style={{width: '100%'}}
          className="p-3 bg-white flex-row justify-between items-center w-full overflow-hidden mb-3 rounded-lg">
          <View>
            <Text className="text-xl font-bold">{labels[index]}位</Text>
          </View>
          <BaseNumberGrid
            numbers={getNumbers(index)}
            selected={getSelected(index)}
            onToggle={n => onToggle(index, n)}
            color="red"
            size="large"
            needZero={false}
          />
        </View>
      ))}
    </>
  );
};

// 排列五选号网格
type ArrangedFiveGridProps = {
  getNumbers: (positionIndex: number) => number[];
  getSelected: (positionIndex: number) => number[];
  onToggle: (positionIndex: number, n: number) => void;
};

export const ArrangedFiveGrid: React.FC<ArrangedFiveGridProps> = ({
  getNumbers,
  getSelected,
  onToggle,
}) => {
  const labels = ['万', '千', '百', '十', '个'];
  return (
    <>
      {Array.from({length: 5}).map((_, index) => (
        <View
          key={index}
          style={{width: '100%'}}
          className="p-3 bg-white flex-row justify-between items-center w-full overflow-hidden mb-3 rounded-lg">
          <View>
            <Text className="text-xl font-bold">{labels[index]}位</Text>
          </View>
          <BaseNumberGrid
            numbers={getNumbers(index)}
            selected={getSelected(index)}
            onToggle={n => onToggle(index, n)}
            color="red"
            size="large"
            needZero={false}
          />
        </View>
      ))}
    </>
  );
};

// 大乐透单式选号网格
type SuperLottoGridProps = {
  activeUI: UIUnit;
  
  activePlay: SuperLottoPlayEnum;
 
  getNumbers: (positionIndex: number) => number[];
  getSelected: (positionIndex: number) => number[];
  onToggle: (positionIndex: number, n: number) => void;
  getDisplayValue?: (positionIndex: number, n: number) => string | number;
  lotteryName: DigitalLotteryNames;
};
const headerTitle: Record<
  SuperLottoPlayEnum,
  Record<SuperLottoSubPlayEnum, ReactNode[]>
> = {
  // 直选
  [SuperLottoPlayEnum.NORMAL]: {
    [SuperLottoSubPlayEnum.DEFAULT]: [
      <Text key={SuperLottoSubPlayEnum.DEFAULT}>
        <Text>
          <Text className="text-xl font-bold">前区</Text>
          <Text>
            至少选<Text className="text-red-500">5</Text>个
          </Text>
        </Text>
      </Text>,
      <Text key={SuperLottoSubPlayEnum.DEFAULT}>
        <Text>
          <Text className="text-xl font-bold">后区</Text>
          <Text>
            至少选<Text className="text-red-500">2</Text>个
          </Text>
        </Text>
      </Text>,
    ],
  },
  [SuperLottoPlayEnum.DANTUO]: {
    [SuperLottoSubPlayEnum.DEFAULT]: [
      <Text key={SuperLottoSubPlayEnum.DEFAULT}>
        <Text>
          <Text className="text-xl font-bold">前区胆码</Text>
          <Text>
            可选<Text className="text-red-500">1-4</Text>个或不选
          </Text>
        </Text>
      </Text>,
      <Text key={SuperLottoSubPlayEnum.DEFAULT}>
        <Text>
          <Text className="text-xl font-bold">前区拖码</Text>
          <Text>
            至少选<Text className="text-red-500">2</Text>个
          </Text>
        </Text>
      </Text>,
      <Text key={SuperLottoSubPlayEnum.DEFAULT}>
        <Text>
          <Text className="text-xl font-bold">后区胆码</Text>
          <Text>
            可选<Text className="text-red-500">1</Text>个或不选
          </Text>
        </Text>
      </Text>,
      <Text key={SuperLottoSubPlayEnum.DEFAULT}>
        <Text>
          <Text className="text-xl font-bold">后区拖码</Text>
          <Text>
            至少选<Text className="text-red-500">2</Text>个
          </Text>
        </Text>
      </Text>,
    ],
  },
};

export const SuperLottoGrid: React.FC<SuperLottoGridProps> = ({
  activeUI,
  activePlay,
  getNumbers,
  getSelected,
  onToggle,
  getDisplayValue,
  lotteryName,
}) => {
  const {lotteryData} = useBetlistStore();

  // 获取当前玩法的奖金说明
  const getPrizeInfo = (index: number) => {
    return headerTitle[activePlay][SuperLottoSubPlayEnum.DEFAULT][index];
  };

  const {showDissmiss} = useSuperLottoStore();
  const dismissArray = useCallback(() => {
    return superLottoPlayAllDissmiss(
      activePlay,
      lotteryData?.omissionList || [],
    );
  }, [activePlay, lotteryData?.omissionList]);

  return (
    <>
      {activeUI.labels.map((item, index) => (
        <View
          key={index}
          style={{width: '100%'}}
          className="p-3 bg-white justify-between items-center w-full overflow-hidden mb-3 rounded-lg">
          <View className="  bg-white  rounded-lg flex-row justify-between items-center w-full">
            <Text className="text-gray-600 text-sm">{getPrizeInfo(index)}</Text>
            {/* 机选控制按钮 */}
            {index === 0 && activePlay === SuperLottoPlayEnum.NORMAL && (
              <View className="mt-3">
                <BetControls type={lotteryName} />
              </View>
            )}
          </View>

          <BaseNumberGrid
            numbers={getNumbers(index)}
            selected={getSelected(index)}
            onToggle={n => onToggle(index, n)}
            color={item.color}
            size="large"
            needZero={item.needZero}
            showDissmiss={showDissmiss}
            dismissArray={dismissArray()[index]}
            getDisplayValue={
              getDisplayValue
                ? (n: number) => getDisplayValue(index, n)
                : undefined
            }
          />
        </View>
      ))}
    </>
  );
};
