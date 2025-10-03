import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type CircularProgressProps = {
  size: number; // 圆的尺寸
  strokeWidth: number; // 圆环宽度
  progress: number; // 进度，0~1之间
  color: string; // 进度条颜色
  backgroundColor: string; // 圆环背景颜色
  text: string; // 中心文字
  subText: string; // 中心文字
};

const CircularProgress: React.FC<CircularProgressProps> = ({
  size,
  strokeWidth,
  progress,
  color,
  backgroundColor,
  text,
  subText,
}) => {
  const radius = (size - strokeWidth) / 2; // 半径
  const circumference = 2 * Math.PI * radius; // 周长
  const strokeDashoffset = circumference * (1 - progress); // 进度偏移量

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* 背景圆环 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* 进度圆环 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`} // 圆周的虚线样式
          strokeDashoffset={strokeDashoffset} // 偏移量
          strokeLinecap="round" // 圆角样式
        />
      </Svg>
      {/* 中心文字 */}
      <View style={styles.centerText}>
        <Text style={styles.progressText}>{text ?? Math.round(progress * 100)}</Text>
        <Text style={styles.subText}>{subText ?? '当前投注金额'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 12,
    color: '#999',
  },
});

export default CircularProgress;
