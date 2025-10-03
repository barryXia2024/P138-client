import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import {AppHeader} from '@/p138-react-common/components';
import CustomAlertDialog from '@/p138-react-common/components/CustomAlertDialog';
import {getUserWallet} from 'src/api/interface/wallets';
import {useLocalSearchParams} from 'expo-router/build/hooks';
import {useUserStore} from 'src/store/user';
import {router, useFocusEffect} from 'expo-router';
import {useLotteryInfoStore} from 'src/modules/lottery/store';

import {formatCurrency} from '@/p138-react-common/utils';
import {themeRedColor} from '@/p138-react-common/utils/styles/color';

import {createLotteryOrder} from 'src/api/interface/orders-bet';

import iconBetBox from 'src/assets/imgs/lottery/icon_bet_box.png';
import { useDigitalBetStore } from '../store/useDigitalBet';

const PayConfirm = () => {
  const {betProgram} = useLocalSearchParams<{betProgram: string}>();

  const creatOrderCommand = JSON.parse(
    betProgram,
  ) as ServerCoreOrder.CreateOrderCommand;

  const {shopInfo, loginInfo, userInfo} = useUserStore();
  const {lotteryInfo} = useLotteryInfoStore();
  const [walletInfo, setWalletInfo] = useState<ServerCoreWallet.Wallet>();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const {clearAllTickets } =
  useDigitalBetStore();

  useFocusEffect(
    useCallback(() => {
      getUserWallet({
        userID: loginInfo?.userID,
        username: userInfo?.username,
      }).then(res => {
        setWalletInfo(res.data);
      });
    }, [loginInfo?.userID, userInfo?.username]),
  );

  const commmit = () => {
    const amount = Number(creatOrderCommand.betAmount);
    if (
      parseFloat(walletInfo?.balance ?? '0') - parseFloat(amount.toString()) <
      0
    ) {
      // globalThis.Toast.show('余额不足，请充值后购买');
      setIsModalVisible(true);
      return;
    }
     

    // 提交订单
    createLotteryOrder(creatOrderCommand).then(res => {
      let url = '';
      if (Number(creatOrderCommand.chaseNumber) > 1) {
        url = '/order/bet/chaseRecord';
      } else {
        url = '/order/bet/record';
      }
      if (res.success) {
        clearAllTickets()
        router.push({
          pathname: '/lottery/slip/betSuccess',
          params: {
            redirectUrl: url,
          },
        });
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
          <Text style={styles.value}>{lotteryInfo?.lotteryChineseName} </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>订单金额：</Text>
          <Text
            style={[styles.value, styles.amount]}
            className="font-bold text-xl">
            {formatCurrency(Number(creatOrderCommand.betAmount))}
          </Text>
        </View>
      </View>

      <View style={styles.paymentMethod}>
        <Image style={styles.icon} source={iconBetBox} />
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
        {/* <TouchableOpacity style={styles.payButton} onPress={commmit}>
          <Text style={styles.payButtonText}>立即支付</Text>
        </TouchableOpacity> */}
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
