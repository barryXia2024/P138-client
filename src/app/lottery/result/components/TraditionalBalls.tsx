import React from 'react';
import {View, Text} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

interface LotteryResult {
  redBalls: string[];
  blueBalls: string[];
}


const Ball: React.FC<{value: string; color: 'red' | 'blue'}> = ({
  value,
  color,
}) => {
  const gradientColors: [string, string, ...string[]] =
    color === 'red' ? ['#fe7168', '#f82d31'] : ['#64b6ff', '#3183f8'];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={{
        width: 18,
        height: 30,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 3,
        marginBottom: 8,
      }}>
      <Text
        style={{
          color: '#fff',
          fontSize: 14,
          lineHeight: 25,
          textAlign: 'center',
        }}>
        {value}
      </Text>
    </LinearGradient>
  );
};

const TraditionalBalls: React.FC<{balls: LotteryResult}> = ({balls}) => {
  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {balls.redBalls.map((ball, idx) => (
        <Ball key={`red-${idx}`} value={ball} color="red" />
      ))}
      {balls.blueBalls.map((ball, idx) => (
        <Ball key={`blue-${idx}`} value={ball} color="blue" />
      ))}
    </View>
  );
};

export default TraditionalBalls;
