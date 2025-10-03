import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  CELL_WIDTH,
  CELL_HEIGHT,
  BALL_DIAMETER,
  FONT_SIZE_MISSING,
  FONT_SIZE_WINNING,
} from '../../config/constants';

interface TrendNumber {
  num: string;
  prize: boolean | null;
}

interface Props {
  numbers: TrendNumber[];
  redLen: number;
}

const TrendNumberRow: React.FC<Props> = ({numbers, redLen}) => {
  return (
    <>
      {numbers?.map((item, index) => {
        const isWinning = !!item.prize;
        const isBlue = index >= redLen;
        const display = String(parseInt(item.num, 10)).padStart(2, '0');
        return (
          <View key={`num-${index}`} style={local.cell}>
            {isWinning ? (
              <View style={[local.winningBall, isBlue && local.blueBall]}>
                <Text style={local.winningText}>{display}</Text>
              </View>
            ) : (
              <Text style={local.missingText}>{item.num}</Text>
            )}
          </View>
        );
      })}
    </>
  );
};

export default TrendNumberRow;

const local = StyleSheet.create({
  cell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    backgroundColor: 'transparent',
  },
  winningBall: {
    width: BALL_DIAMETER,
    height: BALL_DIAMETER,
    borderRadius: BALL_DIAMETER / 2,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueBall: {
    backgroundColor: '#4a90e2',
  },
  winningText: {
    fontSize: FONT_SIZE_WINNING,
    color: '#fff',
    fontWeight: 'bold',
  },
  missingText: {
    fontSize: FONT_SIZE_MISSING,
    color: '#666',
  },
});
