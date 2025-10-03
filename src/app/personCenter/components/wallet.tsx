import {useFocusEffect} from '@react-navigation/native';
import { router } from 'expo-router';
import RightTextButton from '@/p138-react-common/components/RightTextButton';
import { useUserStore } from 'src/store';
import { themePinkColor, themeRedColor } from 'p138-react-common/utils/styles/color';
import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {getUserWallet} from 'src/api/interface/wallets';


const WalletSection: React.FC= () => {
  const {loginInfo} = useUserStore();
  const [walletInfo, setWalletInfo] = useState<ServerCommonWallet.UserWallet>();

  useFocusEffect(
    useCallback(() => {
      // 页面回到前台时执行的代码
      getUserWallet({
        userID: loginInfo?.userID!,
        username: loginInfo?.username!,
      }).then(res => {
        setWalletInfo(res.data);
      });

      return () => {
        console.log('Screen lost focus');
      };
    }, [loginInfo]),
  );
  return (
    <View style={styles.walletSection}>
      <View style={styles.walletHeader}>
        <Text style={styles.walletTitle}>我的钱包</Text>
        <RightTextButton
          onPress={() => router.push('/wallet/transactionList')}
          title="交易明细"
        />
      </View>
      <View style={styles.walletInfo}>
        <View style={styles.walletColumn}>
          <Text style={styles.walletAmount}>{walletInfo?.balance}</Text>
          <Text style={styles.walletLabel}>账户总额(元)</Text>
        </View>
        <View style={styles.walletColumn}>
          <Text style={styles.walletAmount}>
            {walletInfo?.totalWinningAmount}
          </Text>
          <Text style={styles.walletLabel}>今日中奖(元)</Text>
        </View>
      </View>
      <View style={styles.walletButtons}>
        <TouchableOpacity
          style={styles.walletButton}
          onPress={() => router.push('/wallet/recharge')}>
          <Text style={styles.walletButtonText}>充值</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.walletButton, {backgroundColor: themePinkColor}]}
          onPress={() => router.push('/wallet/transfer')}>
          <Text style={[styles.walletButtonText, {color: themeRedColor}]}>
            转账
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.walletButton, {backgroundColor: themePinkColor}]}
          onPress={() => router.push('/wallet/withdraw')}>
          <Text style={[styles.walletButtonText, {color: themeRedColor}]}>
            提现
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  walletSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 12,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  walletDetails: {
    fontSize: 12,
    color: '#999',
  },
  walletInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  walletColumn: {
    alignItems: 'center',
  },
  walletAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  walletLabel: {
    fontSize: 12,
    color: '#999',
  },
  walletButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  walletButton: {
    backgroundColor: '#f44336',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 25,
  },
  walletButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default WalletSection;
