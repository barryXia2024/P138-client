import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CELL_WIDTH, CELL_HEIGHT, FONT_SIZE_MISSING} from '../../config/constants';

interface TrendNumber {
  num: string;
  prize: boolean | null;
}

interface BigSmallRowProps {
  numbers: TrendNumber[];
  posCols: number; // 插入位（排位与大小比之间）
  mergedSpan?: number; // 插入位需要合并的列数，默认 3
  resolveHitColor?: (index: number, posCols: number) => string; // 命中底色
}

const defaultResolveHitColor = (index: number, posCols: number): string => {
  // 玩法默认配色：插入位之后（比值区）用蓝色；前面奇偶分区按偶/奇不同颜色
  if (index > posCols + 2) return '#39f';
  return index % 2 === 0 ? '#ff6b6bb5' : '#9ca9e4b5';
};

const BigSmallRow: React.FC<BigSmallRowProps> = ({
  numbers,
  posCols,
  mergedSpan = 3,
  resolveHitColor = defaultResolveHitColor,
}) => {

    
  return (
    <>
      {numbers?.map((item, index) => {
        const isWinning = !!item.prize;
        const widthStyle = index === posCols ? {width: CELL_WIDTH * mergedSpan} : undefined;
        const bgStyle = isWinning ? {backgroundColor: resolveHitColor(index, posCols)} : undefined;
        return (
          <View key={`cell-${index}`} style={[styles.cell, widthStyle, bgStyle]}>
            <Text style={[styles.missingText, isWinning && {color: '#fff'}]}>{item.num}</Text>
          </View>
        );
      })}
    </>
  );
};

export default BigSmallRow;

const styles = StyleSheet.create({
  cell: {
    width: CELL_WIDTH*1.5,
    height: CELL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    backgroundColor: 'transparent',
  },
  missingText: {
    fontSize: FONT_SIZE_MISSING,
    color: '#666',
  },
});


