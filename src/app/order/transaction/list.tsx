import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {useUserStore} from 'src/store/user';

import dayjs from 'dayjs';
import {listWalletTransaction} from 'src/api/interface/wallets-transactions';
import {getUserWallet} from 'src/api/interface/wallets';
import {
  betPlayColorGreen,
  themeRedColor,
} from 'p138-react-common/utils/styles/color';
import TabSwitcher from '@/p138-react-common/components/TabSwitcher';
import {FlatList} from 'p138-react-common/components/FlatList';
import { formatCurrency } from '@/p138-react-common/utils';

export const transactionTabs: {
  label: string;
  key: CoreCommonEnum.TransactionType | '';
}[] = [
  {label: '全部', key: ''},
  {label: '充值', key: 1},
  {label: '投注', key: 10},
  {label: '返奖', key: 4},
  {label: '提款', key: 2},
  {label: '其他', key: 9},
];

// 抽取的交易记录条目组件
const TransactionItem: React.FC<{
  item: ServerCoreWallet.LotteryWalletTransaction;
}> = ({item}) => {
  return (
    <View style={styles.recordItem}>
      <View style={styles.recordContent}>
        <Text style={styles.recordType}>{item.transactionDescription}</Text>
        <Text
          style={[
            styles.recordStatus,
            {
              color:
                parseFloat(item.amount) >= 0 ? themeRedColor:'green' ,
            },
          ]}>
          {formatCurrency(item.amount)} 
        </Text>
      </View>
      <View style={styles.recordInfo}>
        <Text style={styles.recordAmount}>
          剩余金额：
          <Text style={styles.highlight}>{formatCurrency(item.postBalance)}</Text>
        </Text>
        <Text style={styles.recordTime}>
          {dayjs(item.transactionTime).format('MM-DD HH:mm')}
        </Text>
      </View>
    </View>
  );
};

const TransactionList = () => {
  const {loginInfo} = useUserStore();
  const [activeTab, setActiveTab] = useState<
    CoreCommonEnum.TransactionType | ''
  >('');
  const [walletID, setWalletID] = useState<string>('');

  useEffect(() => {
    getUserWallet({
      userID: loginInfo?.userID,
      username: null,
    }).then(i => {
      if (i.data?.id) {
        setWalletID(i.data?.id);
      }
    });
  }, [loginInfo]);
  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader title="资金交易明细" />
      <TabSwitcher<CoreCommonEnum.TransactionType | ''>
        tabs={transactionTabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />

      {/* Record List */}
      {walletID && (
        <FlatList
          style={{marginTop: 10, flex: 1}}
          requestParams={{
   
            transactionType: activeTab === '' ? undefined : activeTab,
            pageSize: 20,
            current: 1,
      
          
          }}
          keyExtractor={item => item.id}
          requestFunction={(
            params: ServerCoreWallet.GetUserWalletTransactionCommandQueryWithoutPath,
          ) =>
            listWalletTransaction(
              {
                walletID,
              },
              params,
            )
          }
          renderItem={({item}) => <TransactionItem item={item} />}
          ListFooterComponent={
            <Text style={styles.noMoreText}>没有更多了</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
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
});

export default TransactionList;
