import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type FollowButtonProps = {
  onPress: () => void;
};

const FollowButton = ({ onPress }: FollowButtonProps) => {
  return (
    <View style={styles.buttonContainer}>
      <Text style={styles.buttonText} onPress={onPress}>
        立即{'\n'}跟单
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#f44336',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 15,
  },
});

export default FollowButton;
