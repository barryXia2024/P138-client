import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import RightTextButton from '@/p138-react-common/components/RightTextButton';

import { router } from 'expo-router';
import { getBetRecord } from 'src/api/interface/orders-bet';
import { themeRedColor } from 'p138-react-common/utils/styles/color';
import { useUserStore } from 'src/store';

const RecordSection: React.FC = () => {
  const {loginInfo} = useUserStore();
  const [data, setData] = useState<ServerCommonOrder.GetBetRecordCountResult>();
  const goBettingRecord = (tab: CommonCommonEnum.OrderStatus | 0) => {
    router.push({
      pathname: '/bet/record/list',
      params: {
        tabType: tab,
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      // 页面回到前台时执行的代码
      getBetRecord({
        userID: loginInfo?.userID!,
      }).then(res => {
        res.data && setData(res.data);
      });
      return () => {};
    }, [loginInfo]),
  );
  return (
    <View style={styles.recordSection}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.recordHeader}
        onPress={() => goBettingRecord(0)}>
        <Text style={styles.recordTitle}>投注记录</Text>
        <RightTextButton title="全部记录" onPress={() => goBettingRecord(0)}/>
      </TouchableOpacity>
      <View style={styles.recordStats}>
        <TouchableOpacity
          style={styles.recordItem}
          onPress={() => goBettingRecord(4)}>
          <Text style={styles.recordNumber}>
            {data?.pendingTicketCount ?? 0}
          </Text>
          <Text style={styles.recordLabel}>待出票</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.recordItem}
          onPress={() => goBettingRecord(6)}>
          <Text style={styles.recordNumber}>{data?.toBeAwardedCount ?? 0}</Text>
          <Text style={styles.recordLabel}>待开奖</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.recordItem}
          onPress={() => goBettingRecord(8)}>
          <Text style={styles.recordNumber}>{data?.winCount ?? 0}</Text>
          <Text style={styles.recordLabel}>已中奖</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recordSection: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical:8,
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

export default RecordSection;
