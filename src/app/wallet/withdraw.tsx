import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';

import AppHeader from '@/p138-react-common/components/AppHeader';
import {getUserWallet} from 'src/api/interface/wallets';
import {useUserStore} from 'src/store/user';

import {
  CheckboxWithLabel,
  NativeCheckbox,
  RadioGroupItemWithLabel,
} from '@/p138-react-common/components/checkBox';
import {router} from 'expo-router';
import {RadioGroup} from 'tamagui';
import {XStack} from 'tamagui';
import {kScreenWidth} from '@/p138-react-common/utils/styles';
import {CustomModal, ZTextInput} from '@/p138-react-common/components';
import {IMAGE_SIZE} from '@/p138-react-common/utils/styles/theme';
import Button from '@/p138-react-common/components/Button';
import {userWithdrawApplyFor} from 'src/api/interface/wallets-withdraw';
import { formatCurrency, formatPhoneNumber } from '@/p138-react-common/utils';

const WithdrawScreen: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [channel, setChannel] = useState<'支付宝' | '银行卡' | '平台提现'>(
    '平台提现',
  );
  const [bankName, setBankName] = useState('');
  const [bankAddress, setBankAddress] = useState('');
  const [bankCardNumber, setBankCardNumber] = useState('');
  const {loginInfo,userInfo} = useUserStore();
  const [walletInfo, setWalletInfo] = useState<ServerCoreWallet.UserWallet>();
  const [accountName, setAccountName] = useState(loginInfo?.username);
  const [modalVisible, setModalVisible] = useState<{
    isVisible?: boolean;
    title?: string;
    content?: string;
  }>({
    isVisible: false,
    title: '提交成功，正在审核中',
    content: `提现金额:${amount}元
提现渠道:${channel}
预计到账时间:
当天8:00到20:00之间的提现当天处理完成;20:00之后的现在第二天处理完成,`,
  });

  // 获取提现渠道对应的 PaymentMethod 枚举值
  const getWithdrawalType = (channel: string): CoreCommonEnum.PaymentMethod => {
    switch (channel) {
      case '支付宝':
        return 2;
      case '银行卡':
        return 6;
      case '平台提现':
        return 1;
      default:
        return 2;
    }
  };

  const getWalletInfo = () => {
    getUserWallet({
      userID: loginInfo?.userID,
      username: loginInfo?.username,
    }).then(i => {
      setWalletInfo(i.data);
    });
  };

  const handleWithdraw = () => {
    if (!amount || !password) {
      Toast.show('请输入金额和支付密码！');
      return;
    }

    // 根据渠道进行不同的验证
    if (
      channel === '银行卡' &&
      (!bankName || !bankAddress || !bankCardNumber)
    ) {
      Toast.show('请填写完整的银行卡信息！');
      return;
    }

    if (channel === '支付宝' && !bankCardNumber) {
      Toast.show('请输入支付宝账号！');
      return;
    }

    // 根据渠道构建不同的参数
    let account = '';
    let accountName = '';
    let params: Record<string, any> | null = null;

    if (channel === '银行卡') {
      account = bankCardNumber;
      accountName = walletInfo?.username || '';
      params = {
        bankName,
        bankAddress,
        bankCardNumber,
      };
    } else if (channel === '支付宝') {
      account = bankCardNumber; // 支付宝账号
      accountName = walletInfo?.username || '';
    } else if (channel === '平台提现') {
      account = walletInfo?.username || '';
      accountName = walletInfo?.username || '';
      // 平台提现不需要额外的账户信息
    }

    const withdrawalType = getWithdrawalType(channel);

    userWithdrawApplyFor(
      {
        amount,
        currency: 'CNY',
        withdrawalType,
        userType: loginInfo?.userType,
        shopCode: loginInfo?.shopCode,
        userWalletID: walletInfo?.id,
        account,
        accountName,

        params,
        paymentPassword: password
      },
      {
        amount,
        currency: 'CNY',
        withdrawalType,
        userType: loginInfo?.userType,
        shopCode: loginInfo?.shopCode,
        userWalletID: walletInfo?.id,
        account,
        accountName,
        paymentPassword: password,
        params,
      },
    )
      .then(res => {
        getWalletInfo()
        if (res.success) {

          setModalVisible({
            isVisible: true,
            title: '正在提交审核',
            content: `提现金额:${amount}元
  提现渠道:${channel}
  预计到账时间:
  当天8:00到20:00之间的提现当天处理完成;20:00之后的现在第二天处理完成,`,
          });
        } else {
          Toast.show(res.message);
        }
        getUserWallet({
          userID: loginInfo?.userID,
          username: loginInfo?.username,
        }).then(i => {
          setWalletInfo(i.data);
        });
      })
      .catch(error => {
        Toast.show('提现申请失败，请重试！');
      });
  };

  useEffect(() => {
    getWalletInfo();
  }, [loginInfo]);

  return (
    <View className="flex-1">
      <AppHeader title="提现" />
      <ScrollView className="bg-[#f0f0f0] p-6 gap-5 ">
        {/* 可提现金额 */}
        <View className="bg-white border-radius-8">
          <Text className="text-[#333] font-bold text-2xl mt-5 text-center">
            {formatCurrency(walletInfo?.withdrawBalance)}
          </Text>
          <Text className="text-[#999] text-center text-sm">可提现金额</Text>
          {/* 输入提现金额 */}
          <View className="bg-white border-radius-8 p-6 gap-5">
            <Text className="text-[#333] font-bold">输入提现金额:</Text>
            <View className="flex-row items-center justify-center    w-full  ">
              <ZTextInput
                placeholder={`点击输入(最多可提现${
                  formatCurrency(walletInfo?.withdrawBalance)
                }元)`}
                className="flex-1 border-radius-8 bg-[#f0f0f0] h-[45px]"
                keyboardType="numeric"
                value={amount}
                prefix={<Text className="text-[#333] text-base">¥</Text>}
                onChangeText={setAmount}
              />
              <TouchableOpacity
                onPress={() => setAmount(walletInfo?.withdrawBalance ?? '0')}>
                <Text className="text-[#f53b57] text-base">全部</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 用户名和提现渠道 */}
        <View className="bg-white border-radius-8 px-6 gap-5">
          <View className="flex-row">
            <Text className="text-[#333] font-bold w-20">开户账户名</Text>
            <ZTextInput
                placeholder="请输入开户账户名"
                className="flex-1 border-radius-8 bg-[#f0f0f0] h-[45px]"
                keyboardType="numeric"
                value={accountName}
             
                onChangeText={setAccountName}
              />
          </View>

           <View className="flex-row items-center justify-center">
            <Text className="text-[#333] font-bold w-20">提现渠道：平台提现</Text>
            {/* <RadioGroup
              defaultValue="支付宝"
              name="form"
              value={channel}
              onValueChange={value =>
                setChannel(value as '支付宝' | '银行卡' | '平台提现')
              }>
              <XStack width={kScreenWidth * 0.6} space="$2" flexWrap="wrap">
                <RadioGroupItemWithLabel
                  size="$3"
                  value="银行卡"
                  label="银行卡"
                />
                <RadioGroupItemWithLabel
                  size="$4"
                  value="支付宝"
                  label="支付宝"
                />

                <RadioGroupItemWithLabel
                  size="$4"
                  value="平台提现"
                  label="平台提现"
                />
              </XStack>
            </RadioGroup> */}
          </View>

          {/* 根据渠道动态展示输入框 */}
          {channel === '银行卡' && (
            <View className="gap-5">
              <View className="flex-row align-items-center justify-center">
                <Text className="text-[#333] font-bold w-20">开 户 行</Text>
                <ZTextInput
                  placeholder="如浦发银行"
                  className="flex-1 border-radius-8 bg-[#f0f0f0] h-[45px]"
                  value={bankName}
                  onChangeText={setBankName}
                />
              </View>
              <View className="flex-row align-items-center justify-center">
                <Text className="text-[#333] font-bold w-20">开 户 地</Text>
                <ZTextInput
                  placeholder="如广东省深圳市"
                  className="flex-1 border-radius-8 bg-[#f0f0f0] h-[45px]"
                  value={bankAddress}
                  onChangeText={setBankAddress}
                />
              </View>
              <View className="flex-row align-items-center justify-center">
                <Text className="text-[#333] font-bold w-20">银行卡号</Text>
                <ZTextInput
                  placeholder="银行卡号"
                  className="flex-1 border-radius-8 bg-[#f0f0f0] h-[45px]"
                  value={bankCardNumber}
                  onChangeText={setBankCardNumber}
                />
              </View>
            </View>
          )}
          {channel === '支付宝' && (
            <View className="flex-row align-items-center justify-center ">
              <Text className="text-[#333] font-bold w-20">支付宝</Text>
              <ZTextInput
                placeholder="请输入支付宝账号"
                className="flex-1 border-radius-8 bg-[#f0f0f0] h-[45px]"
                value={bankCardNumber}
                onChangeText={setBankCardNumber}
              />
            </View>
          )}
          {channel === '平台提现' && (
            <View className="flex-row align-items-center justify-center">
              <Text className="text-[#333] font-bold w-20">提现说明</Text>
              <Text className="flex-1 text-[#666] text-sm">
                平台提现将直接提现到您的平台账户，无需填写额外信息
              </Text>
            </View>
          )}
          {/* 支付密码 */}
          <View className="bg-white items-center justify-center flex-row pb-10">
            <Text className="text-[#333] font-bold w-20">支付密码</Text>
            <View className="flex-row items-center justify-center border-radius-8 bg-[#f0f0f0] flex-1">
              <ZTextInput
                placeholder="点击输入密码"
                className="flex-1 h-[45px]"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!isPasswordVisible)}>
                <Text className="text-[#f53b57] text-base">
                  {isPasswordVisible ? '隐藏' : '显示'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 手机号信息 */}
        <View className="flex-row  justify-between mt-2">
          <View className="flex-1">
            <Text className="text-[#999] text-md">
              你绑定的手机号码为：{formatPhoneNumber(userInfo?.phoneNumber||userInfo?.username||'')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/personCenter/updatePassWord',
                params: {type: 'pay'},
              })
            }>
            <Text className="text-[#f53b57]"> 设置支付密码</Text>
          </TouchableOpacity>
        </View>

        {/* 申请提现按钮 */}
        <Button
          title="申请提现"
          type="primary"
          style={{
            borderRadius: 8,
            height: 40,
            margin: 10,
          }}
          onPress={handleWithdraw}
        />
        <View style={styles.notice}>
          <Text className="text-items-center justify-center text-base text-red-500">
            温馨提示
          </Text>
          <Text>1、用户充值的金额只能用于本店消费，中奖金额可以提现</Text>
          <Text>
            2、平台为记账工具，您充值的金额将直接进入店主账户，出现资金问题请联系店主处理
          </Text>
          <Text>
            3、如果联系不上店主需要帮助，请在"我的"界面意见反馈里，描述您情况和诉求，平台客服会协助您
          </Text>
          {channel === '平台提现' && (
            <Text>4、平台提现将在1-3个工作日内处理完成，请耐心等待</Text>
          )}
        </View>
      </ScrollView>
      <CustomModal
        isVisible={modalVisible.isVisible}
        onClose={() => setModalVisible({isVisible: false})}>
        <View className="items-center justify-center bg-white rounded-2xl p-5 w-3/4">
          <Image
            source={require('src/assets/imgs/mine/withdraw_title.png')}
            style={IMAGE_SIZE.IMAGE_SIZE100}
            className="mt-[-60px]"
          />
          <Text className="text-left text-lg font-bold">
            {modalVisible.title}
          </Text>
          <Text className="text-left text-lg">{modalVisible.content}</Text>
        </View>
        <Button
          title="确定"
          onPress={() => setModalVisible({isVisible: false})}
          type="primary"
          style={{marginTop: -15, paddingHorizontal: 30}}
        />
      </CustomModal>
    </View>
  );
};

export default WithdrawScreen;
const styles = StyleSheet.create({
  width40: {
    width: 40,
  },
  width80: {
    width: 80,
    fontWeight: 'bold',
  },
  height40: {
    height: 40,
  },
  height80: {
    height: 80,
  },
  notice: {
    // marginTop: 20,
    padding: 12,
    backgroundColor: '#fff9f9',
    borderRadius: 8,
    marginBottom: 50,
  },
});