import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import ConsecutiveWins from './consecutiveWins';
import StatItem from './statItem';
import FollowButton from './followButton';
import Deadline from './deadline';
import { AvatarVIP } from '@/p138-react-common/components';
import { router } from 'expo-router';

const ListItem = ({ item }: { item: CommonFollowHall.FollowOrder }) => {
  const goFollowUser = () => {
    router.push({
      pathname:`/follow/user`,
      params:{
        userId:item.userID,
        shopCode:item.shopCode
      }
        })
      }
  return (
    <TouchableOpacity onPress={() => router.push(`/follow/betInfo/${item.orderNo}`)} activeOpacity={1} style={styles.card}>
      <View style={styles.row}>
      <AvatarVIP avatar={item.avatar} vipIndex={item.vipLevel}    onPress={goFollowUser}/>
        <View style={styles.nameContainer}>
          <View className='flex-row'>
            <Text style={styles.name}>{item.nickname}</Text>
            <ConsecutiveWins
              consecutiveWins={item.winStreak}
              followers={item.followWin}
            />
          </View>
          <Text style={styles.expectedReturn}>
            预计回报
            <Text style={styles.expectedReturnNumber}>
              {(Number(item.returnMultiple)*100).toFixed(0)}
            </Text>{' '}
            %
          </Text>
        </View>
        <View style={styles.winRateContainer}>
          <Text style={styles.winRate}>{item.winStreak}场</Text>
          <Text style={styles.winRateExplanation}>连赢场次</Text>
        </View>
      </View>

      <Text style={styles.description}>{item.declaration}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.stats}>
          <StatItem
            label={'竞彩足球'}
            value={item.bettingString}
            style={styles.statDivider}
          />
          <StatItem
            label={'自购'}
            value={item.betAmount?.toString() + '元'}
            style={styles.statDivider}
          />
          <StatItem
            label={'跟单金额'}
            value={item.followAmount?.toString() + '元'}
            style={styles.statDivider}
          />
          <StatItem
            label={'跟单人数'}
            value={item.followNum?.toString() + '人'}
            style={styles.statDivider}
          />
        </View>
        <FollowButton onPress={() => router.push(`/follow/betInfo/${item.orderNo}`)} />
      </View>

      <Deadline item={item} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 12,
    fontWeight: '300',
    color: '#333',
  },
  expectedReturn: {
    fontSize: 9,
    marginTop: 5,
  },
  expectedReturnNumber: {
    fontSize: 14,
    color: '#f44336',
    fontWeight: 'bold',
  },
  winRateContainer: {
    alignItems: 'center',
  },
  winRate: {
    fontSize: 20,
    color: '#f44336',
    fontWeight: 'bold',
  },
  winRateExplanation: {
    fontSize: 10,
  },
  description: {
    fontSize: 12,
    marginVertical: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noStats: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 10,
  },
  statDivider: {
    borderRightWidth: 2,
    borderRightColor: '#fff', // 分隔线为白色
  },
});

export default ListItem;
