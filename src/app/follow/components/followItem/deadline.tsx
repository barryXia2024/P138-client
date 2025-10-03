import dayjs from 'dayjs';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';


const Deadline = ({item}: {item: CommonFollowHall.FollowOrder}) => {
  return (
    <View style={styles.container}>
      <View style={styles.recentWinContainer}>
        <Text style={styles.recentWinText}>近10：</Text>
        {item.latestHit?.split(',').map((i, index) => (
          <Text
            key={index}
            style={[
              styles.recentWinDot,
              i=='true'
                ? {backgroundColor: 'red', color: '#fff'}
                : {backgroundColor: '#f0f0f0', color: 'black'},
            ]}>
            {i=='true' ? '中' : '未'}
          </Text>
        ))}
      </View>
      <Text style={styles.deadlineText}>
        截止时间：{dayjs(item.buyEndTime).format('MM-DD HH:mm')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  recentWinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  recentWinText: {
    fontSize: 12,
  },
  recentWinDot: {
    width: 15,
    height: 15,
    borderRadius: 15,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 15,
  },
  deadlineText: {
    fontSize: 14,
  },
});

export default Deadline;
