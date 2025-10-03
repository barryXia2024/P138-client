import React from 'react';
import {View, Text, StyleSheet, StyleProp, ViewStyle} from 'react-native';

type StatItemProps = {
  label: string;
  value: string;
  style: StyleProp<ViewStyle>;
};

const StatItem = ({label, value, style}: StatItemProps) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.separator} />
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 2,
    backgroundColor: '#fff',
    width: '100%',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 5,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 5,
  },
});

export default StatItem;
