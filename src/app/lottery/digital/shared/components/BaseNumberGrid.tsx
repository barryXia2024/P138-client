import React from 'react';
import {View} from 'react-native';
import DigitalBall, { DigitalBallSize } from 'src/app/lottery/components/DigitalBall';
import {formatNumberWithZero} from '@/p138-react-common/utils';

type BaseNumberGridProps = {
  numbers: number[];
  selected: number[];
  onToggle: (number: number) => void;
  color?: 'red' | 'blue' | 'gray';
  size?: DigitalBallSize;
  needZero?: boolean;
  className?: string;
  getDisplayValue?: (n: number) => string | number;
  dismissArray?: string[];
  showDissmiss?: boolean;
};

const BaseNumberGrid: React.FC<BaseNumberGridProps> = ({
  numbers,
  selected,
  onToggle,
  color = 'red',
  size = DigitalBallSize.Large,
  needZero,
  className = 'bg-white my-3 pl-6 rounded-lg flex-1',
  getDisplayValue,
  dismissArray,
  showDissmiss,
}) => {
 
  return (
    <View className={className} style={{width: '100%'}}>
      <View className="flex-row flex-wrap gap-4" style={{width: '100%' }}>
        {numbers.map(n => (
          <View key={`${color}-${n}`}>
            <DigitalBall
              key={`DigitalBall-${color}-${n}`}
              value={
                getDisplayValue
                  ? getDisplayValue(n)
                  : needZero
                    ? formatNumberWithZero(n)
                    : n
              }
              color={color}
              size={size}
              selected={selected.includes(n)}
              onClick={() => onToggle(n)}
              needZero={needZero}
            />
            {showDissmiss && (
              <DigitalBall
                key={`DigitalBall-miss-${color}-${n}`}
                value={dismissArray?.[n] || 0}
                color="gray"
                size={size}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default BaseNumberGrid;
