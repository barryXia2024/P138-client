import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import { useUserStore } from 'src/store/user';

import dayjs from 'dayjs';
import { listWalletTransaction } from 'src/api/interface/wallets-transactions';
import { getUserWallet } from 'src/api/interface/wallets';
import { betPlayColorGreen, themeRedColor } from 'p138-react-common/utils/styles/color';
import TabSwitcher from '@/p138-react-common/components/TabSwitcher';
import { FlatList } from 'p138-react-common/components/FlatList';
export const transactionTabs: {
  label: string;
  key: ServerCommonWallet.TransactionType | '';
}[] = [
    { label: '全部', key: '' },
    { label: '充值', key: 1 },
    { label: '投注', key: 10 },
    { label: '返奖', key: 4 },
    { label: '提款', key: 2 },
    { label: '其他', key: 9 },
  ];


const TransactionList = () => {
  const [data, setData] =
    useState<ServerCommonWallet.GetUserWalletTransactionResult>();
  const { loginInfo } = useUserStore();
  const [activeTab, setActiveTab] = useState<
    ServerCommonWallet.TransactionType | ''
  >('');
  const [walletID, setWalletID] = useState<string>('');
  const [page, setPage] = useState<{
    current: number;
    pageSize: number;
  }>({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    getUserWallet({
      userID: loginInfo?.userID!,
      username: null,
    }).then(i => {
      i.data &&
        listWalletTransaction(
          {
            walletID: i.data?.id!,
          },
          { transactionType: activeTab === '' ? undefined : activeTab },
        ).then(res => {
          console.log(res);
          setData(res.data);
          setWalletID(i.data?.id!);
        });
    });
  }, [loginInfo, activeTab]);
  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader title="资金交易明细" />
      <TabSwitcher<ServerCommonWallet.TransactionType | ''>
        tabs={transactionTabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />

      {/* Record List */}
      <FlatList
        style={{ marginTop: 10 }}
        data={data?.list ?? []}
        keyExtractor={item => item.id}
        onLoadMore={() => {
          return listWalletTransaction({
            walletID: walletID,

          },
            {
              transactionType: activeTab === '' ? undefined : activeTab,
              current: page.current + 1,
              pageSize: page.pageSize,
            },
          ).then(res => {
            setData({
              ...data,
              list: [...data?.list, ...res.data?.list ?? []],
              total: res.data?.total ?? 0,
            });
            setPage({
              current: page.current + 1,
              pageSize: page.pageSize,
            });
          });
        }}
        hasMore={(data?.list?.length ?? 0) < (data?.total ?? 0)}
        onRefresh={() => {
          return listWalletTransaction({
            walletID: walletID,
          },
            {
              transactionType: activeTab === '' ? undefined : activeTab,
              current: 1,
              pageSize: page.pageSize,
            },
          ).then(res => {
            setData(res.data);
            setPage({
              current: 1,
              pageSize: page.pageSize,
            });
          });
        }}
        renderItem={({ item }) => (
          <View style={styles.recordItem}>
            <View style={styles.recordContent}>
              <Text style={styles.recordType}>
                {item.transactionDescription}
              </Text>
              <Text
                style={[
                  styles.recordStatus,
                  {
                    color:
                      parseFloat(item.amount) > 0
                        ? betPlayColorGreen
                        : themeRedColor,
                  },
                ]}>
                {parseFloat(item.amount) > 0 ? `+${item.amount}` : item.amount}{' '}
                元
              </Text>
            </View>
            <View style={styles.recordInfo}>
              <Text style={styles.recordAmount}>
                剩余金额：
                <Text style={styles.highlight}>{item.postBalance}元</Text>
              </Text>
              <Text style={styles.recordTime}>
                {dayjs(item.transactionTime).format('MM-DD HH:mm')}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={<Text style={styles.noMoreText}>没有更多了</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#f53b57',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  tabItem: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#f53b57',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#f53b57',
    fontWeight: 'bold',
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
    fontSize: 14,
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
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#f53b57',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default TransactionList;
