import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CounterProps {
  multiplier?: number;
  handleIncrement?: () => void;
  handleDecrement?: () => void;
  showMultiplier?: () => void;
}

const Counter: React.FC<CounterProps> = ({
  multiplier = 1,
  handleIncrement,
  handleDecrement,
  showMultiplier,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleDecrement}
        style={[styles.button, styles.lfbutton]}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} onPress={showMultiplier}>
        <Text style={styles.countText}>{multiplier}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleIncrement}
        style={[styles.button, styles.rbutton]}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
  },
  button: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  lfbutton: {
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  rbutton: {
    borderLeftWidth: 1,
    borderColor: '#999',
    backgroundColor: '#f7f7f7',
  },
  buttonText: {
    fontSize: 28,
    color: '#333',
    lineHeight: 30,
  },
  countText: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 15,
  },
});

export default Counter;
