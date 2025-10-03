import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
 
import {RightTextButton} from '@/p138-react-common/components';
import {router} from 'expo-router';
 
import {themeRedColor} from 'p138-react-common/utils/styles/color';
 
import useMineStore from './store/mine';

const UserBetRecord: React.FC = () => {
  const {betRecord: data} = useMineStore();
  const goBettingRecord = (tab: CoreCommonEnum.OrderStatus | 0) => {
    router.push({
      pathname: '/order/bet/record',
      params: {
        tabType: tab,
      },
    });
  };

  return (
    <View style={styles.recordSection}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.recordHeader}
        onPress={() => goBettingRecord(0)}>
        <Text style={styles.recordTitle}>投注记录</Text>
        <RightTextButton title="全部记录" onPress={() => goBettingRecord(0)} />
      </TouchableOpacity>
      <View style={styles.recordStats}>
        <TouchableOpacity
          style={styles.recordItem}
          onPress={() => goBettingRecord(1)}>
          <Text style={styles.recordNumber}>
            {data?.pendingTicketCount ?? 0}
          </Text>
          <Text style={styles.recordLabel}>待出票</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.recordItem}
          onPress={() => goBettingRecord(2)}>
          <Text style={styles.recordNumber}>{data?.toBeAwardedCount ?? 0}</Text>
          <Text style={styles.recordLabel}>待开奖</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.recordItem}
          onPress={() => goBettingRecord(4)}>
          <Text style={styles.recordNumber}>{data?.winCount ?? 0}</Text>
          <Text style={styles.recordLabel}>已中奖</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recordItem}
          onPress={() => goBettingRecord(4)}>
          <Text style={styles.recordNumber}>{data?.todayWinAmount ?? 0}</Text>
          <Text style={styles.recordLabel}>今日中奖</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recordSection: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 10,
    padding: 10,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  recordLink: {
    fontSize: 12,
    color: '#999',
  },
  recordStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  recordItem: {
    alignItems: 'center',
  },
  recordNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themeRedColor,
  },
  recordLabel: {
    fontSize: 12,
    color: '#000',
  },
});

export default UserBetRecord;
