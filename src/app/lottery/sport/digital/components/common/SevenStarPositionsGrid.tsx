import React from 'react';
import {View, Text} from 'react-native';
import BaseNumberGrid from './BaseNumberGrid';

// 七星彩位置式选号网格
type SevenStarPositionsGridProps = {
  positions: number;
  getNumbers: (positionIndex: number) => number[];
  getSelected: (positionIndex: number) => number[];
  onToggle: (positionIndex: number, n: number) => void;
  labels?: string[];
  color?: 'red' | 'blue';
  size?: 'small' | 'medium' | 'large';
  needZero?: boolean;
};

const SevenStarPositionsGrid: React.FC<SevenStarPositionsGridProps> = ({
  positions,
  getNumbers,
  getSelected,
  onToggle,
  labels,
  color = 'red',
  size = 'large',
  needZero,
}) => {
  const cnLabels = labels ?? ['一', '二', '三', '四', '五', '六', '七'];
  return (
    <>
      {Array.from({length: positions}).map((_, index) => (
        <View
          key={index}
          style={{width: '100%'}}
          className="p-3 bg-white flex-row justify-between items-center w-full overflow-hidden mb-3 rounded-lg">
          <View>
            <Text className="text-xl font-bold">第{cnLabels[index]}位</Text>
          </View>
          <BaseNumberGrid
            numbers={getNumbers(index)}
            selected={getSelected(index)}
            onToggle={n => onToggle(index, n)}
            color={color}
            size={size}
            needZero={index === 6} // 第七位需要0
          />
        </View>
      ))}
    </>
  );
};

// 默认导出七星彩位置网格组件
export default SevenStarPositionsGrid;
