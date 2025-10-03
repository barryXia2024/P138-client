import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import dayjs from 'dayjs';
import {router, useLocalSearchParams} from 'expo-router';
import {useUserStore} from 'src/store/user';
import {
  getBetList,
  getOrderOrSchemeDetailsByOrderId,
} from 'src/api/interface/orders-bet';
import AppHeader from '@/p138-react-common/components/AppHeader';
import TabSwitcher from '@/p138-react-common/components/TabSwitcher';
import {FONT_SIZES} from 'p138-react-common/utils/styles/theme';

import {FlatList} from 'p138-react-common/components/FlatList';
import {
  lotteryChineseNameMap,
  LotteryName,
} from '@/p138-react-common/constants/LotteryCommon';
import {
  SportLotteryType,
  SportLotteryTypeEnum,
} from 'src/modules/lottery/constants';
import {isDev} from 'src/utils';

/**
 * 投注记录
 */
export const OrderStatusTabs: {
  label: string;
  key: number;
}[] = [
  {label: '全部', key: 0},
  {label: '待出票', key: 1},
  {label: '待开奖', key: 2},
  {label: '已开奖', key: 3},
  {label: '已中奖', key: 4},
];

// 抽取的投注记录条目组件
const BettingRecordItem: React.FC<{
  item: ServerCoreOrder.ListOrderRow;
}> = ({item}) => {
  const commission = item.betContentSportsLotteryList?.[0];
  const digital = item.betContentDigitalLotteryList?.[0];

  return (
    <TouchableOpacity
      activeOpacity={1}
      key={item.orderId}
      onPress={() =>
        router.push({
          pathname: '/order/bet/detail',
          params: {orderId: item.orderId},
        })
      }
      style={styles.recordItem}>
      <View style={styles.recordContent}>
        <Text style={[styles.recordType, {fontSize: FONT_SIZES.medium}]}>
          <Text className='text-lg font-bold'>
            {
              lotteryChineseNameMap[
                item.lotteryName as keyof typeof lotteryChineseNameMap
              ]
            }
          </Text>
          <Text style={{fontSize: FONT_SIZES.medium}}>
            ({['', '自购', '跟单', '追号', '发单'][item.orderType]})
            {item.lotteryName === LotteryName.HalfTimeFullTimeBet6 ||
            item.lotteryName === LotteryName.GameTotalGoalsBet4 ? null : (
              <Text>[{item.betPlay}]</Text>
            )}
          </Text>
        </Text>
        <Text
          style={[
            styles.recordStatus,
            {
              color: [
                '#999', // 0
                '#000', // 1
                '#f53b57', // 2
                '#000', // 3
                '#000', // 4
                '#000', // 5
                '#f53b57', // 6
                '#000', // 7
                '#f53b57', // 8
                '#000', // 9
                '#000', // 10
                '#000', // 11
                '#000', // 12
              ][item.orderStatus],
            },
          ]}>
          {item.orderStatusChinese}
        </Text>
      </View>
      <View style={styles.recordInfo}>
        <Text style={styles.recordAmount}>
          购买金额：
          <Text style={styles.highlight}>{item.betAmount}元</Text>
          {/* {SportLotteryType[item.lotteryName] == SportLotteryTypeEnum.Sport &&
          isDev ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.competitionText}>
                {' '}
                {dayjs(commission?.competitionTime).format('YYYY-MM-DD')}
              </Text>
              <Text style={styles.competitionText}>
                {' '}
                {commission?.competitionSessions}
              </Text>
              <Text style={styles.competitionText}> {commission?.home}</Text>
              <Text style={styles.competitionText}> VS</Text>
              <Text style={styles.competitionText}> {commission?.away}</Text>
            </View>
          ) : null} */}
        </Text>
        <Text style={styles.recordTime}>
          {dayjs(item.orderTime).format('YYYY-MM-DD HH:mm')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const BettingRecord = () => {
  const {tabType} = useLocalSearchParams<{tabType: string}>();

  const [tab, setTab] = useState<number>(Number(tabType || 0));

  const {loginInfo} = useUserStore();

  return (
    <View style={styles.container}>
      <AppHeader title="投注记录" />
      <TabSwitcher<number>
        tabs={OrderStatusTabs}
        activeTab={tab}
        onTabPress={setTab}
      />
      <FlatList
        keyExtractor={item => item.orderId}
        style={[styles.flatList, {flex: 1}]}
        requestParams={{
          userID: loginInfo?.userID,
          betRecordTabType:
            tab === 0 ? undefined : (tab as CoreCommonEnum.BetRecordTabType),
          pageSize: 30,
          current: 1,
          direction: 'asc',
          sort: 'createdAt',
        }}
        // requestFunction={getBetList}
        requestFunction={(params: ServerCoreOrder.ListOrderCommandQuery) => {
          return getBetList(params).then(res => {
            return res;
          });
        }}
        renderItem={({item}) => <BettingRecordItem item={item} />}
        ListFooterComponent={<Text style={styles.noMoreText}>没有更多了</Text>}
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
    color: '#333',
  },
  recordAmount: {
    fontSize: 12,
    color: '#666',
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
    fontSize: 12,
    color: '#666',
  },
  recordTime: {
    fontSize: 12,
    color: '#999',
  },
  noMoreText: {
    textAlign: 'center',
    padding: 10,
    color: '#999',
    fontSize: 12,
  },
  competitionText: {
    fontSize: 12,
    color: '#666',
  },
  flatList: {
    marginTop: 8,
  },
});

export default BettingRecord;
