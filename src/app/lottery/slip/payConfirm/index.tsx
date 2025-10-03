import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import {AppHeader} from '@/p138-react-common/components';
import CustomAlertDialog from '@/p138-react-common/components/CustomAlertDialog';
import {getUserWallet} from 'src/api/interface/wallets';
import {useLocalSearchParams} from 'expo-router/build/hooks';
import {useUserStore} from 'src/store/user';
import {router, useFocusEffect} from 'expo-router';
import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';
import {
  SportLotteryTypeEnum,
  SportPlayNameMap,
} from 'src/modules/lottery/constants';
import {useCreateOrder} from '../store/createOrder';
import {formatCurrency} from '@/p138-react-common/utils';
import {themeRedColor} from '@/p138-react-common/utils/styles/color';
import betBoxIcon from 'src/assets/imgs/lottery/icon_bet_box.png';

const PayConfirm = () => {
  const {play, jcBetsInfoString} = useLocalSearchParams<{
    play: string;
    jcBetsInfoString: string;
  }>();
  const {multiplier, betPlayActiveTab} = useBetInfoStore();
  const {creatOrder} = useCreateOrder();

  const jcBetsInfo = JSON.parse(jcBetsInfoString);

  const {shopInfo, loginInfo} = useUserStore();
  const {lotteryInfo} = useLotteryInfoStore();
  const [walletInfo, setWalletInfo] = useState<WalletWalletCommon.Wallet>();
  const [betsInfo, setBetsInfo] = useState<CompetionBet.BetAmount>({
    betsCount: 0,
    maxPayout: 0,
    minPayout: 0,
    betsAmount: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // 页面获取焦点时执行的逻辑
      getUserWallet({
        userID: loginInfo?.userID,
        username: loginInfo?.username,
      }).then(res => {
        setWalletInfo(res.data);
      });
    }, []),
  );
  useEffect(() => {
    setBetsInfo(jcBetsInfo);
  }, [jcBetsInfoString]);

  const commmit = () => {
    const orderAmount = betsInfo.betsCount * multiplier * 2;
    // const ix
    const amount =
      lotteryInfo?.lotteryType === SportLotteryTypeEnum.Sport
        ? betsInfo.betsAmount * multiplier
        : orderAmount;
    if (
      parseFloat(walletInfo?.balance ?? '0') - parseFloat(amount.toString()) <
      0
    ) {
      // globalThis.Toast.show('余额不足，请充值后购买');
      setIsModalVisible(true);

      return;
    }

    creatOrder({
      amount,
      betAmount: betsInfo,
      play,
    }).then(res => {
      if (res.success) {
        router.push('/lottery/slip/betSuccess');
      }
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader title="支付确认页" />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>店铺名称：</Text>
          <Text style={styles.value}>{shopInfo?.shopName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>投注彩种：</Text>
          <Text style={styles.value}>
            {lotteryInfo?.lotteryChineseName}{' '}
            {SportPlayNameMap[betPlayActiveTab]}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>订单金额：</Text>
          <Text
            style={[styles.value, styles.amount]}
            className="font-bold text-xl">
            {formatCurrency(betsInfo.betsAmount * multiplier)}
          </Text>
        </View>
      </View>

      <View style={styles.paymentMethod}>
        <Image style={styles.icon} source={betBoxIcon} />
        <Text style={styles.paymentText}>
          钱包余额支付(可用：
          <Text style={{color: themeRedColor}} className="font-bold text-xl">
            {formatCurrency(walletInfo?.balance)}
          </Text>
          )
        </Text>
        <Text style={styles.checkmark}>✔</Text>
      </View>

      <View style={styles.footer}>
        <CustomAlertDialog
          open={isModalVisible}
          trigger={
            <TouchableOpacity style={styles.payButton} onPress={commmit}>
              <Text style={styles.payButtonText}>立即支付</Text>
            </TouchableOpacity>
          }
          title="提示"
          description="余额不足！！！！"
          confirmText="充值"
          cancelText="已知晓"
          onConfirm={() => {
            setIsModalVisible(false);
            router.push('/wallet/recharge');
          }}
          onCancel={() => setIsModalVisible(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },

  content: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#333',
    fontSize: 14,
  },
  value: {
    color: '#333',
    fontSize: 14,
  },
  amount: {
    color: '#f53b57',
    fontWeight: 'bold',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  paymentText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  checkmark: {
    color: '#f53b57',
    fontSize: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#f53b57',
    paddingVertical: 10,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PayConfirm;
