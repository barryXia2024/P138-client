import React from 'react';
import {View, Text} from 'react-native';

import DigitalBall from '../../components/DigitalBall';
import {formatNumberWithZero} from '@/p138-react-common/utils';

interface DigitalBallsProps {
  balls: {
    redBalls: string[];
    blueBalls: string[];
  };
  size?: 'small' | 'medium' | 'large' | 'xsmall';
  showSeparator?: boolean;
  className?: string;
  needZero?: boolean;
  disabled?: boolean;
}

export const DigitalBalls: React.FC<DigitalBallsProps> = ({
  balls,
  size = 'medium',
  needZero = false,
  className = '',
  disabled = false,
}) => {
  const {redBalls, blueBalls} = balls;

  return (
    <View className={`flex-row  items-center  w-full  ${className}`}>
      {/* 红球区域 */}
      <View className="flex-row flex-wrap w-full">
        {redBalls.map((ball, index) => (
          <DigitalBall
            key={`red-${index}-${ball}`}
            value={needZero ? formatNumberWithZero(ball) : ball}
            color="red"
            size={size}
            selected
            disabled={disabled}
          />
        ))}
        {blueBalls.map((ball, index) => (
          <DigitalBall
            key={`blue-${index}-${ball}`}
            value={needZero ? formatNumberWithZero(ball) : ball}
            color="blue"
            size={size}
            selected
            disabled={disabled}
          />
        ))}
      </View>
 
    </View>
  );
};

export default DigitalBalls;
