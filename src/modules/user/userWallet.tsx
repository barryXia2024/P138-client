 
import {router} from 'expo-router';
import RightTextButton from '@/p138-react-common/components/RightTextButton';
 
import {
  themePinkColor,
  themeRedColor,
} from 'p138-react-common/utils/styles/color';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';

import useMineStore from './store/mine';
import { formatCurrency } from '@/p138-react-common/utils';

const UserWallet: React.FC = () => {
  const {walletInfo} = useMineStore();

  return (
    <View>
      <ImageBackground
        source={require('src/assets/imgs/mine/bg_vip_luck.webp')}
        style={styles.backgroundImage}>
        <TouchableOpacity
          style={styles.vipSection}
          onPress={() => router.push('/personCenter/vip')}>
          <View style={styles.vipContent}>
            <Text style={styles.vipTitle}>VIP会员</Text>
            <Text style={styles.vipSubtitle}>查看新权益＞</Text>
          </View>
          <Image
            source={require('src/assets/imgs/mine/icon_vip.png')}
            style={styles.vipIcon}
          />
        </TouchableOpacity>
        <View style={styles.luckSection}>
          <View style={styles.luckContent}>
            <Text style={styles.luckTitle}>Luck币</Text>
            <Text style={styles.luckSubtitle}>0 币</Text>
          </View>
          <Image
            source={require('src/assets/imgs/mine/icon_luck.png')}
            style={styles.luckIcon}
          />
        </View>
      </ImageBackground>
      <View style={styles.walletSection}>
        <View style={styles.walletHeader}>
          <Text style={styles.walletTitle}>我的钱包</Text>
          <RightTextButton
            onPress={() => router.push('/order/transaction/list')}
            textStyle={{color: '#666'}}
            title="交易明细"
          />
        </View>
        <View style={styles.walletInfo}>
          <View style={styles.walletColumn}>
            <Text style={styles.walletLabel}>账户总额 </Text>
            <Text style={styles.walletAmount}>{formatCurrency(walletInfo?.balance)}</Text>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flexDirection: 'row',
    height: 100,
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginHorizontal: 10,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  vipSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },
  vipContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  vipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vipSubtitle: {
    fontSize: 12,
    color: 'red',
    fontWeight:'300'
  },
  vipIcon: {
    width: 35,
    height: 35,
  },
  luckSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  luckContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  luckTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  luckSubtitle: {
    fontSize: 12,
    color: 'red',
  },
  luckIcon: {
    width: 35,
    height: 35,
  },
  walletSection: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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
    gap: 10,
  },
  walletColumn: {
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',

  },
  walletAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  walletLabel: {
    fontSize: 14,
    color: '#999',
  },
  walletButtons: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    flex: 1,
    gap: 10,
  },
  walletButton: {
    backgroundColor: '#f44336',
    borderRadius: 5,
    // paddingVertical: 5,
    // paddingHorizontal: 25,
    flex: 1,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default UserWallet;
