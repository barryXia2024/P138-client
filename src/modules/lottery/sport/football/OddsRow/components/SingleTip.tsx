import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const SingleTip: React.FC<{
  handicapDto: LotteryDataSource.HandicapDto;
  showSingleTip: boolean;
}> = ({handicapDto, showSingleTip}) => {
  if (handicapDto.single === '1' && showSingleTip) {
    return (
      <View style={styles.singleTip} pointerEvents="none">
        <Text style={styles.singleTipText}>单关</Text>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  singleTip: {
    position: 'absolute',
    left: '50%',
    top: -6,
    borderRadius: 4,
    backgroundColor: '#10b981',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  singleTipText: {
    color: 'white',
    fontSize: 14,
  },
});

export default React.memo(SingleTip);
