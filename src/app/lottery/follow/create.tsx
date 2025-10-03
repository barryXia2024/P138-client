import AppHeader from '@/p138-react-common/components/AppHeader';
import {router, useFocusEffect, useLocalSearchParams} from 'expo-router';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';
import {useCreateOrder} from '../slip/store/createOrder';
 
import {SportPlayNameMap} from 'src/modules/lottery/constants';
import {useCreateOrderData} from 'src/modules/follow/hooks';
import {useCreateOrderStore} from 'src/modules/follow/store';
import {
  DeclarationTags,
  FollowBillingPublic,
} from 'src/modules/follow/components';
import CustomAlertDialog from '@/p138-react-common/components/CustomAlertDialog';
 

export default function CreateOrderScreen() {
  const {isPublic, declaration, setDeclaration} = useCreateOrderStore();

  const {walletInfo, fetchTags} = useCreateOrderData();
  const {betPlayActiveTab, multiplier} = useBetInfoStore();
  const {lotteryInfo} = useLotteryInfoStore();
  const {betsInfo, commissionRate} = useLocalSearchParams();
  const [followBetsInfo, setFollowBetsInfo] =
    useState<CompetionBet.BetAmount>();
  const {creatFollowOrder} = useCreateOrder();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const followBetsInfoJson = JSON.parse(betsInfo as string);
    setFollowBetsInfo(followBetsInfoJson);
  }, [betsInfo]);

  useFocusEffect(
    useCallback(() => {
      fetchTags();
    }, []),
  );

  const handleCreateOrder = () => {
    const ammount = Number(followBetsInfo?.betsAmount) * multiplier;
    if (parseFloat(walletInfo?.balance ?? '0') - ammount < 0) {
      // globalThis.Toast.show('余额不足，请充值后购买');
      setIsModalVisible(true);

      return;
    }

    creatFollowOrder({
      amount: Number(followBetsInfo?.betsAmount),
      betAmount: followBetsInfo as CompetionBet.BetAmount,
      play: SportPlayNameMap[betPlayActiveTab],
      orderType: 4,
      declaration,
      commissionRate: commissionRate as string,
      programContent: isPublic ? 2 : 1,
    }).then(res => {
      if (res.success) {
        if(Platform.OS === 'web'){
          router.dismissAll()
        }
        router.dismissTo('/lottery/slip/betSuccess');
      }
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* 顶部按钮 */}
      <AppHeader title="立即发单" />
      <ScrollView className="flex-1 bg-[#f0f0f0]">
        {/* 投注信息 */}
        <View className="bg-white p-4">
          <Text className="text-lg">
            投注彩种: {lotteryInfo.lotteryChineseName}{' '}
            {SportPlayNameMap[betPlayActiveTab]}
          </Text>
          <Text className="text-lg mt-2">
            订单金额:{' '}
            <Text className="text-red-500">
              {Number(followBetsInfo?.betsAmount) * multiplier}元
            </Text>
          </Text>
        </View>
        <FollowBillingPublic />

        {/* 方案宣言 */}
        <View className="bg-white p-4 mt-4">
          <Text>方案宣言:</Text>
          <TextInput
            value={declaration}
            onChangeText={setDeclaration}
            multiline
            style={Styles.textInput}
          />

          {/* 标签选择 */}
          <Text className="mt-4">选择你感兴趣的标签(将自动添加到宣言框)</Text>
          <DeclarationTags />
        </View>

        {/* 确定发单按钮 */}
      </ScrollView>
      <View className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white">
        <CustomAlertDialog
          open={isModalVisible}
          trigger={
            <TouchableOpacity
              className="bg-red-500 p-3 rounded-md"
              onPress={handleCreateOrder}>
              <Text className="text-center text-white text-lg">确定发单</Text>
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
}

const Styles = StyleSheet.create({
  textInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 4,
    padding: 8,
    minHeight: 100,
    marginTop: 8,
  },
});
