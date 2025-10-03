import React, { useCallback } from 'react';
import {View, Text} from 'react-native';
import BaseNumberGrid from 'src/app/lottery/sport/digital/components/common/BaseNumberGrid';
import BetControls from './BetControls';

import {UIUnit} from 'src/app/lottery/sport/digital/lotteryTypes/configs/lotteryConfigs';
import { Happy8PlayEnum } from '../constants';
import { DigitalBallSize } from 'src/app/lottery/components/DigitalBall';

type BallsGridProps<T, K> = {
  activeUI: UIUnit;
  playMode: T;
  GridTitle: React.FC<{
    playMode: T;
    playSubMode: K;
    index: number;
  }>;
  playSubMode: K;
  getNumbers: (index: number) => number[];
  getSelected: (index: number) => number[];
  onToggle: (index: number, n: number) => void;
  getDisplayValue?: (index: number, n: number) => string | number;
  onQuickPick?: () => void;
  onQuickPick5?: () => void;
  onMiss?: () => void;
  onFullTuo?: () => void;
  showMissControl?: boolean;
  showMiss?: boolean;
  lotteryData?: LotteryDataSource.CharityLotteryDataSource;
};

const BallsGrid = <T, K>(props: BallsGridProps<T, K>) => {
  const {
    activeUI,
    playMode,
    playSubMode,
    GridTitle,
    getNumbers,
    getSelected,
    onToggle,
    onQuickPick,
    onQuickPick5,
    onMiss,
    onFullTuo,
    showMissControl,
    showMiss,
    lotteryData,
 
  } = props;
  console.log(activeUI,'activeUI');
  const dismissArray = useCallback(() => {
   return [
    lotteryData?.omissionList || [],
    lotteryData?.omissionList || [],
   ]
  }, [lotteryData?.omissionList]);

  return (
    <>
      {activeUI.labels.map((item, index) => (
        <View
          key={index}
          style={{width: '100%'}}
          className="px-3 bg-white justify-between items-center w-full overflow-hidden mb-3 rounded-lg">
          <View className="bg-white p-3 rounded-lg flex-row justify-between items-center w-full">
            <Text className="text-gray-600 text-sm ">
              <GridTitle
                playMode={playMode}
                playSubMode={playSubMode}
                index={index}
              />
            </Text>
            {/* 机选控制按钮 */}
            {index === 0 && (
              <View className="mt-3">
                <BetControls
                  onQuickPick={onQuickPick}
                  onQuickPick5={onQuickPick5}
                  onMiss={onMiss}
                  onFullTuo={onFullTuo}
                  showMiss={showMiss}
                  showQuickPick={true}
                  showFullTuo={playMode === Happy8PlayEnum.dantuo}
                  showMissControl={showMissControl}
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
              size={DigitalBallSize.Xmedium}
              needZero={item.needZero}
              showDissmiss={showMiss}
              dismissArray={dismissArray()[index]}
            />
          </View>
        </View>
      ))}
    </>
  );
};
export default BallsGrid;
