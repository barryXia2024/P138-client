import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import AppHeader from '@/p138-react-common/components/AppHeader';
import {useFocusEffect} from '@react-navigation/native';
import {getUserWallet} from 'src/api/interface/wallets';
import {useLocalSearchParams} from 'expo-router/build/hooks';
import {useUserStore} from 'src/store/user';
import {router} from 'expo-router';
import {createFollowOrder} from 'src/api/interface/orders-bet';


import {IMAGE_SIZE} from '@/p138-react-common/utils/styles/theme';
import {lotteryChineseNameMap} from '@/p138-react-common/constants/LotteryCommon';
import CustomAlertDialog from '@/p138-react-common/components/CustomAlertDialog';

const PayConfirm: React.FC = () => {
  const {orderInfo, multiplier} = useLocalSearchParams();
  const orderInfoData: CoreFollowHall.GetTrackingOrderItemResult = JSON.parse(
    orderInfo as string,
  );

  const {shopInfo, loginInfo, userInfo} = useUserStore();
  const [walletInfo, setWalletInfo] = useState<WalletWalletCommon.Wallet>();

  const [isModalVisible, setIsModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getUserWallet({
        userID: loginInfo?.userID,
        username: userInfo?.username,
      }).then(res => {
        setWalletInfo(res.data);
      });
    }, []),
  );

  const commmit = () => {
    // 计算实际投注金额
    const betAmount =
      (Number(orderInfoData?.betAmount) / Number(orderInfoData?.betMultiple)) *
      Number(multiplier);

    // 获取钱包余额，确保是数字类型
    const walletBalance = Number(walletInfo?.balance ?? 0);
    
    // 使用数字比较，避免字符串转换的精度问题
    if (walletBalance < betAmount) {
      setIsModalVisible(true);
      return;
    }

    createFollowOrder({
      betAmount: betAmount.toFixed(2), // 转换为字符串用于API调用
      buyEndTime: orderInfoData?.buyEndTime,
      shopLotteryID: orderInfoData?.shopLotteryID,
      betMultiple: Number(multiplier),
      lotteryName: orderInfoData?.lotteryName as CoreCommonEnum.LotteryName,
      followOrderNo: orderInfoData?.orderNo,


      userID: userInfo?.id,
      shopCode: loginInfo?.shopCode,
    }).then(res => {
      if (res.success) {
        router.push({
          pathname: '/lottery/slip/betSuccess',
          params: {
            redirectUrl: '/follow',
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
          <Text style={styles.value}>
            {lotteryChineseNameMap[orderInfoData?.lotteryName]}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>订单金额：</Text>
          <Text style={[styles.value, styles.amount]}>
            {(Number(orderInfoData?.betAmount) /
              Number(orderInfoData?.betMultiple)) *
              Number(multiplier)}
            元
          </Text>
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.paymentMethod}>
        <Image
          style={IMAGE_SIZE.IMAGE_SIZE30}
          source={require('src/assets/imgs/lottery/icon_bet_box.png')}
        />
        <Text style={styles.paymentText}>{`钱包余额支付(可用：${
          walletInfo?.balance ?? 0
        }元)`}</Text>
        <Text style={styles.checkmark}>✔</Text>
      </View>

      {/* Footer */}
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
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  amount: {
    color: '#f53b57',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
  },

  paymentText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 10,
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
