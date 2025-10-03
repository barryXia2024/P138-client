import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {formatNumberWithZero} from '@/p138-react-common/utils';
export enum DigitalBallSize {
    Xsmall = 'xsmall',
  Small = 'small',
  Xmedium = 'xmedium',
  Medium = 'medium',
  Large = 'large',
}

interface BallProps {
  value: string | number;
  color: 'red' | 'blue' | 'gray';
  selected?: boolean;
  size?: DigitalBallSize;
  needZero?: boolean;
  disabled?: boolean; 
  onPress?: () => void;
  onClick?: () => void;
}

// 球体配置 - 使用常量对象，提高性能
const BALL_CONFIG = {
  red: {
    selectedColors: ['#fe7168', '#f82d31'],
    normalColors: ['#fff', '#fff'],
    selectedTextColor: '#fff',
    normalTextColor: '#f82d31',
    borderColor: '#f82d31',
  },
  blue: {
    selectedColors: ['#64b6ff', '#3183f8'],
    normalColors: ['#fff', '#fff'],
    selectedTextColor: '#fff',
    normalTextColor: '#3183f8',
    borderColor: '#3183f8',
  },
  gray: {
    selectedColors: ['#ccc', '#ccc'],
    normalColors: ['#ccc', '#ccc'],
    selectedTextColor: '#fff',
    normalTextColor: 'gray',
    borderColor: '#ccc',
  },
} as const;

// 尺寸配置
const SIZE_CONFIG: Record<DigitalBallSize, {
  ballSize: string;
  textSize: string;
  margin: string;
  lineHeight: string;
}> = {
  [DigitalBallSize.Xsmall]: {
    ballSize: 'w-4 h-4',
    textSize: 'text-[8px] font-bold',
    margin: 'mr-0.5 mb-0.5',
    lineHeight: 'leading-4',
  },
  [DigitalBallSize.Small]: {
    ballSize: 'w-6 h-6',
    textSize: 'text-[10px] font-bold',
    margin: 'mr-0.5 mb-0.5',
    lineHeight: 'leading-[14px]',
  },
  [DigitalBallSize.Xmedium]: {
    ballSize: 'w-[30px] h-[30px]',
    // ballSize: 'w-8 h-8',
    textSize: 'text-[11px] font-bold',
    margin: 'mr-0.5 mb-0.5',
    lineHeight: 'leading-[14px]',
  },
  [DigitalBallSize.Medium]: {
    ballSize: 'w-8 h-8',
    textSize: 'text-[12px] font-bold',
    margin: 'mr-1 mb-0.5',
    lineHeight: 'leading-[16px]',
  },
  [DigitalBallSize.Large]: {
    ballSize: 'w-10 h-10',
    textSize: 'text-[14px] font-bold',
    margin: 'mr-1 mb-0.5',
    lineHeight: 'leading-[18px]',
  },
} as const;

const DigitalBall: React.FC<BallProps> = ({
  value,
  color,
  selected = false,
  size = 'medium',
  onPress,
  onClick,
  needZero = false,
  disabled = false,
}) => {
  const config = BALL_CONFIG[color];
  const sc = SIZE_CONFIG[size];

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        onPress?.();
        onClick?.();
      }}
      activeOpacity={1}>
      {color === 'gray' ? (
        <View
          className={`${sc.ballSize} rounded-full justify-center items-center ${sc.margin} border border-solid`}
          style={{borderColor: config.borderColor, borderRadius: 140}}>
          <Text
            className={`font-500 ${sc.textSize} text-center ${sc.lineHeight} `}
            style={{color: config.normalTextColor}}>
            {needZero ? formatNumberWithZero(value || 0) : value}
          </Text>
        </View>
      ) : (
        <LinearGradient
          colors={selected ? config.selectedColors : config.normalColors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          className={`${sc.ballSize} rounded-full justify-center items-center ${sc.margin} border border-solid`}
          style={{
            borderColor: selected
              ? config.selectedTextColor
              : config.borderColor,
            borderRadius: 140,
          }}>
          <Text
            className={`font-500 ${sc.textSize} text-center ${sc.lineHeight} `}
            style={{
              color: selected
                ? config.selectedTextColor
                : config.normalTextColor,
            }}>
            {needZero ? formatNumberWithZero(value || 0) : value}
          </Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

export default DigitalBall;
