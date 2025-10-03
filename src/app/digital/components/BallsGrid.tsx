import React from 'react';
import {View, Text} from 'react-native';
 
import BaseNumberGrid from './BaseNumberGrid';
import {DigitalBallSize} from 'src/app/lottery/components/DigitalBall';
import { UIConfig } from '../types';

interface BallsGridProps {
  config: UIConfig;
  rowTitle:(index:number)=> React.ReactNode;
  betControls: React.ReactNode;
  positions: string[][];
  toggleNumber: (index: number, number: string) => void;
  showMiss: boolean;
  dismissArray: (i: number) => string[];
}

const BallsGrid: React.FC<BallsGridProps> = ({
  config,
  rowTitle,
  betControls,
  positions,
  toggleNumber,
  showMiss,
  dismissArray,
}) => {
  const getDisplayValue = (num: string) => {
    return num;
  };
 

  return (
    <View className="flex-1">
      {config.labels.map((labelConfig, index) => (
        <View
          key={index}
          style={{width: '100%'}}
          className="px-3 bg-white justify-between items-center w-full overflow-hidden mb-3 rounded-lg">
          <View className="bg-white p-3 rounded-lg flex-row justify-between items-center w-full">
            <Text className="text-gray-600 text-sm">{rowTitle(index)}</Text>
            {/* 机选控制按钮 */}
            {index === 0 && betControls}
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
              showDissmiss={showMiss}
              getDisplayValue={getDisplayValue}
              className="bg-white rounded-b-lg pt-0 flex-1"
              dismissArray={dismissArray(index)} 
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default BallsGrid;
