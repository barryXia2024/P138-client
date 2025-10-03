import AppHeader from '@/p138-react-common/components/AppHeader';
import {router, useLocalSearchParams} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AvatarVIP } from '@/p138-react-common/components';
import {Table, Row, Rows} from 'react-native-table-component';
import {Button} from 'tamagui';
import {themeRedColor} from '@/p138-react-common/utils/styles/color';
import {getTrackingOrderItem} from 'src/api/interface/orders-follow-hall';
import {DEFAULT_IMAGE} from '@/p138-react-common/config';
import CustomerMultiplier from 'src/app/lottery/slip/sport/components/CustomerMultiplier';

import BetInfoItem from './components/betInfoItem';
import {getUserInfo} from 'src/api/interface/users-auth';
import {useUserStore} from 'src/store';
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import { IMAGE_SIZE } from '@/p138-react-common/utils/styles/theme';
import { useSlipStore } from 'src/app/lottery/slip/store/slipStore';
import { useBetInfoStore } from 'src/modules/lottery/store';

const endStatus = [7, 8];

const UserFollowInfoDetail = () => {
  const {orderNo } = useLocalSearchParams();
  const {multiplier,setMultiplier,resetStore} = useBetInfoStore();
  // const [userFollowInfo, setUserFollowInfo] = useState<UserFollowInfo>(initialUserFollowInfo);
 

  // 使用store管理弹窗状态
  const { toggleMultiplierModal,showMultiplierModal} = useSlipStore();
  const [orderInfo, setOrderInfo] =
    useState<CoreFollowHall.GetTrackingOrderItemResult>();
  const [userInfo, setUserInfo] =
    useState<ServerCoreAuth.GetUserInfoResult>();
  const [isMine, setIsMine] = useState<boolean>(false);
  const loginInfo = useUserStore(state => state.loginInfo);
  // const [orderInfoC, setOrderInfoC] = useState<ServerCommonOrder.LotteryOrder>();

  const tableHead = ['用户名', '跟单金额', '税后奖金', '佣金'];
  const tableData = orderInfo?.trackingOrderUsers?.map(item => [
    item.nickname ?? item.username,
    Number(item.betAmount).toFixed(1),
    endStatus.includes(orderInfo?.orderStatus!)
      ? Number(item.calcAmount).toFixed(1)
      : '',
    endStatus.includes(orderInfo?.orderStatus!)
      ? Number(item.commission).toFixed(1)
      : '',
  ]);

  const followOrder = async () => {
    router.push({
      pathname: '/follow/payConfirm',
      params: {
        orderInfo: JSON.stringify(orderInfo),
        multiplier: multiplier,
      },
    });
  };
  useEffect(() => {
    orderNo &&
      getTrackingOrderItem({
        orderNo: orderNo as string,
      }).then(res => {
        console.log(res.data);
        setOrderInfo(res.data);
        res.data?.userID &&
          getUserInfo(
            {
              userID: res.data?.userID,
            },
            {
              'X-User-Type': 1,
              'X-Username': res.data?.userID ?? '',
            },
          ).then(res => {
            setUserInfo(res.data);
            setIsMine(res.data?.userID === loginInfo?.userID);
          });
      });

      return () => {
        resetStore();
      }
  }, []);

  // const isEnd = dayjs().isAfter(dayjs(orderInfo?.buyEndTime));
  const isEnd = false;
  return (
    <View className="bg-white flex-1">
      <AppHeader
        title={orderInfo?.nickname ?? ''}
        rightComponent={
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => router.push({
              pathname: '/follow/betInfo/share',
              params: {
                orderInfo: JSON.stringify(orderInfo),
                userInfo: JSON.stringify(userInfo),
              },
            })}>
            <OSSImage
              source={require('src/assets/imgs/follow/icon_share.png')}
              style={IMAGE_SIZE.IMAGE_SIZE30}
            />
          </TouchableOpacity>
        }
      />
      <ScrollView className="flex-1 h-full pb-[80px] bg-[#f0f0f0]">
        <Text
          style={{
            backgroundColor: '#fdf6ec',
            color: '#f9ae3d',
            textAlign: 'center',
            fontSize: 14,
            paddingVertical: 4,
          }}>
          比赛变化莫测，请控制金额理性跟单
        </Text>
        <View className="p-2 bg-white">
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <AvatarVIP
              avatar={userInfo?.avatar ?? DEFAULT_IMAGE}
              vipIndex={8}
            />
            <Text>{orderInfo?.nickname}</Text>
            <Text
              style={{
                backgroundColor: '#fdf6ec',
                color: '#f9ae3d',
                textAlign: 'center',
                fontSize: 14,
                borderRadius: 10,
                paddingHorizontal: 10,
              }}>
              总场次 {orderInfo?.totalFdCount}
            </Text>
            <Text
              style={{
                backgroundColor: 'rgba(240, 75, 73, .1)',
                color: '#f04b49',
                textAlign: 'center',
                fontSize: 14,
                borderRadius: 10,
                paddingHorizontal: 10,
              }}>
              {orderInfo?.winStreak}连红
            </Text>
          </View>
          <View className="mt-2 borde-2">
            <Text style={{fontSize: 16, color: '#333', lineHeight: 24}}>
              {orderInfo?.declaration}
            </Text>
          </View>

          <View className="mt-2 flex-row flex-wrap gap-2">
            <View className="flex-1 justify-center items-center border border-gray-300 rounded-md p-2">
              <Text>总命中率</Text>
              <Text className="text-red-500">
                {(Number(orderInfo?.totalHitRate) * 100).toFixed(2)}%
              </Text>
            </View>
            <View className="flex-1 justify-center items-center border border-gray-300 rounded-md p-2">
              <Text>总盈利率</Text>
              <Text className="text-red-500">
                {(Number(orderInfo?.totalProfitability) * 100).toFixed(2)}%
              </Text>
            </View>
            <View className="flex-1 justify-center items-center border border-gray-300 rounded-md p-2">
              <Text>最长连红</Text>
              <Text className="text-red-500">{orderInfo?.winStreak}场</Text>
            </View>
            <View className="flex-1 justify-center items-center border border-gray-300 rounded-md p-2">
              <Text>最长连黑</Text>
              <Text className="text-gray-500">{orderInfo?.loseStreak}场</Text>
            </View>
          </View>
          <View className="mt-4 flex-row flex-wrap gap-2 border-t border-gray-100 pt-4">
            <View className="flex-1 justify-center items-center border border-gray-300 rounded-md p-2">
              <Text className="text-red-500">{orderInfo?.betAmount} 元</Text>
              <Text>方案金额</Text>
            </View>
            <View className="flex-1 justify-center items-center border border-gray-300 rounded-md p-2">
              <Text className="text-red-500">
                {orderInfo?.orderStatusChinese==='待开奖'?'已出票':orderInfo?.orderStatusChinese}
              </Text>
              <Text>方案状态</Text>
            </View>
            <View className="flex-1 justify-center items-center border border-gray-300 rounded-md p-2">
              <Text className="text-red-500">
                {endStatus.includes(orderInfo?.orderStatus!)
                  ? orderInfo?.calcAmount + '元'
                  : '--'}{' '}
              </Text>

              <Text>税后奖金</Text>
            </View>
          </View>
          <BetInfoItem orderInfo={orderInfo} />

          <View className="border-t-[20px] border-gray-100 pt-4 mt-4">
            <Text style={{fontSize: 16, lineHeight: 24}}>
              跟单用户
              <Text className="text-gray-500">
                （共{orderInfo?.trackingOrderUserCount ?? 0}人，默认展示前10人）
              </Text>
            </Text>
            {(tableData?.length ?? 0) > 0 ? (
              <Table borderStyle={{borderWidth: 1, borderColor: '#ccc'}}>
                <Row
                  data={tableHead}
                  style={styles.head}
                  textStyle={styles.text}
                />
                <Rows data={tableData ?? []} textStyle={styles.text} />
              </Table>
            ) : (
              <Text className="text-center text-gray-500 leading-[100px]">
                暂无跟单用户
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      {!isEnd && !isMine && (
        <View className="flex-row justify-between items-center fixed bottom-0 left-0 right-0 bg-[#fff] h-[80px] px-4">
          <TouchableOpacity
            onPress={() => toggleMultiplierModal()}
            className="flexs-1 flex-row items-center gap-2">
            <Text style={{fontSize: 16, color: '#333', lineHeight: 24}}>
              投
            </Text>
            <View
              style={{
                paddingHorizontal: 32,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: '#f53b57',
                borderRadius: 6,
                marginHorizontal: 4,
                backgroundColor: '#fff',
              }}>
              <Text style={{color: '#f53b57', fontSize: 14}}>{multiplier}</Text>
            </View>
            <Text style={{fontSize: 16, color: '#333', lineHeight: 24}}>
              倍
            </Text>
          </TouchableOpacity>
          <View className="gap-2 flex-row justify-between items-center">
            <Text className="   rounded-md p-1 font-bold">
              <Text className="text-red-500 ">
                {(
                  (Number(orderInfo?.betAmount) /
                    Number(orderInfo?.betMultiple)) *
                  multiplier
                ).toFixed(2)}
              </Text>
              元
            </Text>
            <Button
              color="#fff"
              style={{backgroundColor: themeRedColor}}
              onPress={() => followOrder()}>
              立即跟单
            </Button>
          </View>
        </View>
      )}

      <CustomerMultiplier
        multiplier={multiplier}
        setMultiplier={setMultiplier}
        toggleMultiplierModal={toggleMultiplierModal}
        showMultiplierModal={showMultiplierModal}
      />
    </View>
  );
};

export default UserFollowInfoDetail;

const styles = StyleSheet.create({
  head: {
    height: 40,
    backgroundColor: '#f0f0f0',
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
});
