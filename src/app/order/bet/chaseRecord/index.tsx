import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import dayjs from 'dayjs';
import {router, useLocalSearchParams} from 'expo-router';
import {useUserStore} from 'src/store/user';

import AppHeader from '@/p138-react-common/components/AppHeader';
import TabSwitcher from '@/p138-react-common/components/TabSwitcher';
import {FONT_SIZES} from 'p138-react-common/utils/styles/theme';

import {FlatList, FlatListRef} from 'p138-react-common/components/FlatList';
import {lotteryChineseNameMap} from '@/p138-react-common/constants/LotteryCommon';
import {
  SportLotteryType,
  SportLotteryTypeEnum,
} from 'src/modules/lottery/constants';
import {listChaseNumberRecord} from 'src/api/interface/orders-bet';
/**
 * 投注记录
 */
export const OrderStatusTabs: {
  label: string;
  key: number;
}[] = [
  {label: '全部', key: 0},
  {label: '进行中', key: 1},
  {label: '已结束/停止', key: 2},
];

// 抽取的投注记录条目组件
const BettingRecordItem: React.FC<{
  item: ServerCoreOrder.ChaseNumberRecord;
}> = ({item}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      key={item.id}
      onPress={() =>
        router.push({
          pathname: '/order/bet/chaseRecord/detail',
          params: {orderId: item.id},
        })
      }
      style={styles.recordItem}>
      <View style={styles.recordContent}>
        <Text style={[styles.recordType, {fontSize: FONT_SIZES.medium}]}>
          {lotteryChineseNameMap[item.lotteryName]}
          <Text style={{fontSize: FONT_SIZES.medium}}>
            {SportLotteryType[item.lotteryName] ==
            SportLotteryTypeEnum.Sport ? (
              <Text>[{item.playName}]</Text>
            ) : null}
          </Text>
        </Text>
        <Text
          style={[
            styles.recordStatus,
          ]}>{`第${item.currentChaseNumber}/${item.totalNumber}期`}</Text>
      </View>
      <View style={styles.recordInfo}>
        <Text style={styles.recordAmount}>
          购买金额：
          <Text style={styles.highlight}>
            {Number(item.totalBetAmount) / item.totalNumber}元
          </Text>
        </Text>
        <Text style={styles.recordTime}>
          {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const BettingRecord = () => {
  const [tab, setTab] = useState<number>(0);

  const {loginInfo} = useUserStore();
  const flatListRef =
    useRef<FlatListRef<ServerCoreOrder.ChaseNumberRecord>>(null);

  useEffect(() => {
    console.log('tab', 111111);
    flatListRef.current?.refresh();
  }, [tab]);

  const getChaseList = useCallback(
    (params: ServerCoreOrder.ListChaseNumberCommand) => {
      return listChaseNumberRecord(params, params);
    },
    [],
  );

  return (
    <View style={styles.container}>
      <AppHeader title="追号记录" />
      <TabSwitcher<number>
        tabs={OrderStatusTabs}
        activeTab={tab}
        onTabPress={setTab}
      />
      <FlatList
        ref={flatListRef}
        keyExtractor={item => item.id}
        style={[styles.flatList, {flex: 1}]}
        requestParams={{
          userID: loginInfo?.userID,
          chaseNumberStatusList: [[1,2,3,4], [2], [3, 4]][
            tab
          ] as CoreCommonEnum.ChaseNumberStatus[],
          pageSize: 30,
          current: 1,
        }}
        // requestFunction={getBetList}
        requestFunction={getChaseList}
        renderItem={({item}) => <BettingRecordItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },

  recordItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  recordContent: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordType: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  recordAmount: {
    fontSize: 16,
  },
  highlight: {
    color: '#f53b57',
    fontWeight: 'bold',
  },
  recordInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordTime: {
    fontSize: 16,
  },
  noMoreText: {
    textAlign: 'center',
    padding: 10,
    color: '#999',
    fontSize: 12,
  },

  flatList: {
    marginTop: 8,
  },
});

export default BettingRecord;
