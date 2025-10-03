import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Counter from './Counter';

const MultiplierSection: React.FC<{
  multiplier: number;
  setMultiplier: (multiplier: number) => void;
  toggleMultiplierModal: () => void;
  title?: string;
}> = ({multiplier, setMultiplier, toggleMultiplierModal, title = '倍数'}) => {
  const handleIncrement = () => setMultiplier(multiplier + 1);
  const handleDecrement = () => setMultiplier(Math.max(1, multiplier - 1));

  return (
    <View style={styles.multiplierContainer}>
      <Text style={styles.multiplierLabel}>{title}</Text>
      <Counter
        multiplier={multiplier}
        showMultiplier={toggleMultiplierModal}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  multiplierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  
   
    justifyContent: 'flex-end',
  },
  multiplierLabel: {
    marginRight: 8,
  },
});

export default MultiplierSection;
