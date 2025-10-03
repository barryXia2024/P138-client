import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {getUserWallet, recharge} from 'src/api/interface/wallets';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {useUserStore} from 'src/store/user';
import {themeRedColor} from 'p138-react-common/utils/styles/color';
import {FONT_SIZES} from 'p138-react-common/utils/styles/theme';
import {Button} from 'tamagui';
import {
 
  listShopCustomerPaymentMethod,
} from 'src/api/interface/payment-customer';
export interface PayChannel {
  methodId: number;
  shopId: null;
  methodType: number;
  methodName: string;
  methodMaxAmount: string;
  methodMinAmount: string;
  methodSort: number;
  methodSwitch: number;
  methodDesc: string;
  methodUrl: string;
  channelName: string;
  oldFlag: number;
  openStartTime: string;
  openEndTime: string;
  openTime: string;
  paymentQrcodeOne: string;
  paymentQrcodeTwo: string;
  paymentQrcodeThree: string;
  warnDesc: null;
  createTime: null;
  vipLimit: number;
  pullLimit: number;
}

const RechargeScreen = () => {
  const [inputAmount, setInputAmount] = useState<string>('6050');
  const [selectedChannel, setSelectedChannel] = useState<string>();
  const {loginInfo} = useUserStore();
  const navigation = useNavigation();
  const rechargeAmounts = [224, 1951, 3632, 5771, 6666, 18888];
  const [paymentChannels, setPaymentChannels] =
    useState<ServerCorePayment.PaymentMethodInfo[]>();

  useEffect(() => {
    listShopCustomerPaymentMethod({
      shopCode: loginInfo?.shopCode || 0,
      hasOpenPay: 2,
      hasActivatePay: 2,
    }).then(res => {
      console.log(res);

      if (res.success) {
        const list: ServerCorePayment.PaymentMethodInfo[] = [];
        res.data?.list?.forEach(item => {
          item.paymentMethodList?.forEach(i => {
            list.push({
              ...i,
            });
          });
        });
        setPaymentChannels(list);
      }

      // setPaymentChannels(res.data?.list || []);
    });
  }, []);

  const commit = () => {
    getUserWallet({
      userID: loginInfo?.userID!,
      username: loginInfo?.username!,
      userType: loginInfo?.userType,
    }).then(i => {
      console.log(
        i.data?.id,
        inputAmount,
        loginInfo?.userID!,
        loginInfo?.username!,
        loginInfo?.userType,
      );
      recharge(
        {
          amount: inputAmount,
          currency: 'CNY',
          userID: loginInfo?.userID!,
        },
        {walletID: i.data?.id!},
      ).then(res => {
        console.log(res);
        if (res.success) {
          globalThis.Toast.show('充值成功');
          navigation.goBack();
        }
      });
    });
  };

  const renderAmountButton = (amount: number, index: number) => {
    const isSelected = amount === parseFloat(inputAmount);
    return (
      <TouchableOpacity
        key={index}
        style={[styles.amountButton, isSelected && styles.selectedAmountButton]}
        onPress={() => {
          //   setSelectedAmount(amount);
          setInputAmount(amount.toString());
        }}>
        <Text
          style={[styles.amountText, isSelected && styles.selectedAmountText]}>
          {amount} 元
        </Text>
        {index === 2 && <Text style={styles.hotTag}>热</Text>}
      </TouchableOpacity>
    );
  };

  const renderPaymentChannel = (channel: ServerCorePayment.PaymentMethodInfo) => {
    const isSelected = selectedChannel === channel.paymentMethodInfoID;
    return (
      <TouchableOpacity
        key={channel.paymentMethodInfoID}
        style={[styles.channelContainer, isSelected && styles.selectedChannel]}
        onPress={() => setSelectedChannel(channel.paymentMethodInfoID)}>
        <Text style={styles.channelName}>
          {channel.channelName}{' '}
          <Text style={styles.channelTime}>(开启时间:{channel.paymentMethodDetail?.openStartTime})</Text>
        </Text>
        <Text style={styles.channelLimit}>单笔限额：{channel.methodMinAmount}-{channel.methodMaxAmount}</Text>
        {isSelected && <Text style={styles.channelCheck}>✔</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 顶部标题 */}
      <AppHeader title="在线充值" />

      <ScrollView style={styles.content}>
        {/* 输入充值金额 */}
        <View style={styles.inputContainer}>
          <Text style={[{fontSize: FONT_SIZES.small, fontWeight: 'bold'}]}>
            请输入充值金额
          </Text>
          <View className="flex-row items-center justify-center mt-2 bg-[#F0F0F0] p-2 rounded-md">
            <Text>输入金额:</Text>
            <TextInput
              style={[styles.input, {fontSize: FONT_SIZES.medium}]}
              value={inputAmount}
              onChangeText={setInputAmount}
              keyboardType="numeric"
              placeholder="请输入金额"
            />
          </View>
        </View>

        {/* 选择充值金额 */}
        <View>
          <Text style={styles.sectionTitle}>选择充值金额</Text>
          <View style={styles.amountGroup}>
            {rechargeAmounts.map(renderAmountButton)}
          </View>
        </View>

        {/* 支付渠道 */}
        <View>
          <Text style={styles.sectionTitle}>选择支付方式</Text>
          {paymentChannels?.map(renderPaymentChannel)}
        </View>
        <Button
          onPress={commit}
          style={{backgroundColor: themeRedColor}}
          color="white">
          立即充值
        </Button>
        {/* 温馨提示 */}
        <View style={styles.notice}>
          <Text style={{color: themeRedColor, fontSize: FONT_SIZES.medium}}>
            温馨提示
          </Text>
          <Text style={styles.noticeText}>
            1、用户充值的金额只能用于本店消费，中奖金额可以提现
          </Text>
          <Text style={styles.noticeText}>
            2、平台为记账工具，您充值的金额将直接进入店主账户，出现资金问题请联系店主处理
          </Text>
          <Text style={styles.noticeText}>
            3、如果联系不上店主需要帮助，请在“我的”界面意见反馈里，描述您情况和诉求，平台客服会协助您
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    height: 50,
    backgroundColor: '#f53b57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    padding: 0,
    margin: 0,
    fontSize: 14,
    lineHeight: 20,
    height: 20,
    flex: 1,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#333',
    // marginVertical: 12,
    marginBottom: 10,
  },
  amountGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amountButton: {
    width: '30%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  selectedAmountButton: {
    borderColor: '#f53b57',
  },
  amountText: {
    fontSize: 16,
    color: '#333',
  },
  selectedAmountText: {
    color: '#f53b57',
  },
  hotTag: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#f53b57',
    color: '#fff',
    fontSize: 10,
    padding: 2,
    borderRadius: 3,
  },
  channelContainer: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    position: 'relative',
  },
  selectedChannel: {
    borderColor: '#f53b57',
  },
  channelName: {
    fontSize: 16,
    color: '#333',
  },
  channelTime: {
    fontSize: 14,
    color: '#999',
  },
  channelLimit: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  channelCheck: {
    position: 'absolute',
    right: 8,
    top: 8,
    color: '#f53b57',
    fontSize: 16,
  },
  notice: {
    // marginTop: 20,
    padding: 12,
    backgroundColor: '#fff9f9',
    borderRadius: 8,
    marginBottom: 50,
  },
  noticeText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
  },
  rechargeButton: {
    backgroundColor: '#f53b57',
    padding: 6,
    alignItems: 'center',
    borderRadius: 8,
    margin: 16,
  },
  rechargeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RechargeScreen;
