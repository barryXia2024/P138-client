import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type ConsecutiveWinsProps = {
  consecutiveWins: number;
  followers: number;
};

// 提取常量以便复用
const COLORS = {
  red: 'red',
  lightBlue: '#61CEEB',
  blue: '#1E90FF',
  lightBlueBg: '#E0FFFF',
  white: '#fff',
  pinkBg: '#FFF0F5',
  orange: '#FFA500',
  lightOrangeBg: '#FFF8E1',
};
export const TodayFd = ({todayFd}: {todayFd: boolean}) => {
  return (
    <View style={[styles.consecutiveWins, {borderWidth:0}]}>
      <Text
        style={[
          styles.consecutiveWinsNumber,
          todayFd
            ? {backgroundColor: COLORS.orange, color: COLORS.white}
            : {backgroundColor: COLORS.blue, color: COLORS.white},
        ]}>
        今日
      </Text>
      <Text
        style={[
          styles.consecutiveWinsLabel,
          todayFd
            ? {backgroundColor: COLORS.lightOrangeBg, color: COLORS.orange}
            : {backgroundColor: COLORS.lightBlue, color: COLORS.blue},
        ]}>
        {todayFd ? '已发单' : '未发单'}
      </Text>
    </View>
  );
};

export const ConsecutiveWinsItem = ({
  consecutiveWins,
}: {
  consecutiveWins: number;
}) => {
  return (
    <View style={[styles.consecutiveWins, {borderColor: COLORS.red}]}>
      <Text
        style={[styles.consecutiveWinsNumber, {backgroundColor: COLORS.red}]}>
        {consecutiveWins}
      </Text>
      <Text
        style={[styles.consecutiveWinsLabel, {backgroundColor: COLORS.pinkBg}]}>
        连红
      </Text>
    </View>
  );
};
const ConsecutiveWins = ({
  consecutiveWins,
  followers,
}: ConsecutiveWinsProps) => {
  return (
    <View style={styles.row}>
      <View
        style={[
          styles.consecutiveWins,
          {borderColor: COLORS.lightBlue, borderWidth: 0, gap: 5},
        ]}>
        <ConsecutiveWinsItem consecutiveWins={followers} />
        <Text
          style={[
            styles.consecutiveWinsNumber,
            {backgroundColor: COLORS.blue},
          ]}>
          带红人数
        </Text>
        <Text
          style={[
            styles.consecutiveWinsLabel,
            {backgroundColor: COLORS.lightBlueBg, color: COLORS.blue},
          ]}>
          {followers}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  consecutiveWins: {
    fontSize: 10,
    color: '#666',
    marginLeft: 5,
    borderWidth: 0.5,
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  consecutiveWinsLabel: {
    paddingHorizontal: 2,
    paddingVertical: 2,
    fontSize: 10,
  },
  consecutiveWinsNumber: {
    color: '#fff',
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});

export default ConsecutiveWins;
