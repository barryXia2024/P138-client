import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {themeRedColor} from 'p138-react-common/utils/styles/color';
import AppHeader from '@/p138-react-common/components/AppHeader';
import dayjs from 'dayjs';
import {
  customerCancelOrder,
  getChaseNumberRecordDetail,
  getOrderOrSchemeDetailsByOrderId,
  stopChaseNumber,
} from 'src/api/interface/orders-bet';
import {Redirect, router, useLocalSearchParams} from 'expo-router';
import {FONT_SIZES, ICON_SIZES} from 'p138-react-common/utils/styles/theme';
import {LotteryIconMap} from 'src/modules/lottery/constants/LotteryCommon';
import {formatCurrency, formatDateTime} from '@/p138-react-common/utils';
import statusUnwinImg from 'src/assets/imgs/gendan/status_unwin.png';
import status2Img from 'src/assets/imgs/gendan/status2.png';
import CountdownTimer from '../components/CountdownTimer';
import CustomAlertDialog from '@/p138-react-common/components/CustomAlertDialog';
import {
  lotteryChineseNameMap,
  LotteryName,
} from '@/p138-react-common/constants/LotteryCommon';
import {
  ArrangedFiveTicket,
  ArrangedThreeTicket,
  DoubleBallTicket,
  Fucai3DTicket,
  SevenStarTicket,
  SevenHappyTicket,
  SuperLottoTicket,
} from '../components/DigitalTicketList/ticketItem';
import {useMqttStore} from 'src/store/mqtt';
import {debounce} from 'p138-react-common/utils';
import {FlatList} from '@/p138-react-common/components/FlatList';

const BetDetails: React.FC = () => {
  const {orderId} = useLocalSearchParams();
  const [orderInfo, setOrderInfo] =
    useState<ServerCoreOrder.GetChaseNumberRecordDetailResult>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const {lastMessage} = useMqttStore();

  const digitalTicketContent = (betItem: string, betPlay: string) => {
    if (orderInfo?.lotteryName == LotteryName.SuperLotto) {
      return SuperLottoTicket(betItem, betPlay);
    } else if (orderInfo?.lotteryName == LotteryName.SevenStar) {
      return SevenStarTicket(betItem, betPlay);
    } else if (orderInfo?.lotteryName == LotteryName.ArrangedThree) {
      return ArrangedThreeTicket(betItem, betPlay);
    } else if (orderInfo?.lotteryName == LotteryName.ArrangedFive) {
      return ArrangedFiveTicket(betItem, betPlay);
    } else if (orderInfo?.lotteryName == LotteryName.SevenHappy) {
      return SevenHappyTicket(betItem, betPlay);
    } else if (orderInfo?.lotteryName == LotteryName.DoubleBall) {
      return DoubleBallTicket(betItem, betPlay);
    } else if (orderInfo?.lotteryName === LotteryName.Fucai3D) {
      return Fucai3DTicket(betItem, betPlay);
    } else if (orderInfo?.lotteryName === LotteryName.Happy8) {
      return SevenHappyTicket(betItem, betPlay);
    }
    return (
      <Text style={{fontWeight: 'bold'}}>
        <Text className="  font-blod">
          {betItem.split('#').map(num => num.split('|').map(num => num + ' '))}
        </Text>
      </Text>
    );
  };
  const fetchOrderInfo = () => {
    setLoading(true);
    getChaseNumberRecordDetail({chaseNumberRecordID: orderId as string})
      .then(res => {
        if (res.success) {
          setOrderInfo(res.data);
        }
        const createTime = dayjs().diff(res.data?.createdAt, 'seconds');

        if (createTime < 5 * 60) {
          setCountdown(300 - createTime);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const debounceFetchOrderInfo = debounce(() => {
    fetchOrderInfo();
  }, 2000);
  useEffect(() => {
    debounceFetchOrderInfo();
  }, [orderId]);

  const [countdown, setCountdown] = useState(0);

  // useEffect(() => {
  //   if (lastMessage && lastMessage.payload.msgType == '1') {
  //     debounceFetchOrderInfo();
  //   }
  // }, [lastMessage]);

  return (
    <View style={styles.container}>
      <AppHeader
        title="追号方案详情"
        rightComponent={
          <CustomAlertDialog
            open={isModalVisible}
            trigger={
              orderInfo?.isStop ? null : (
                <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                  <Text style={{color: '#fff'}}>终止追号</Text>
                </TouchableOpacity>
              )
            }
            title=" "
            description="您确定要终止追号吗？"
            confirmText="确定"
            cancelText="取消"
            onConfirm={() => {
              setIsModalVisible(false);
              stopChaseNumber({
                chaseNumberRecordID: orderInfo?.chaseNumberRecordID,
              }).then(res => {
                if (res.success) {
                  Toast.show('终止追号成功');
                  fetchOrderInfo();
                }
              });
            }}
            onCancel={() => setIsModalVisible(false)}
          />
        }
      />
      <ScrollView>
        <View className="flex-row items-center  bg-white p-4 gap-2">
          {orderInfo?.lotteryName && (
            <Image
              style={{width: ICON_SIZES.large, height: ICON_SIZES.large}}
              source={
                LotteryIconMap[
                  orderInfo?.lotteryName as CoreCommonEnum.LotteryName
                ]
              }
            />
          )}
          <Text style={styles.icon}>
            {lotteryChineseNameMap[orderInfo?.lotteryName]}
          </Text>

          {orderInfo?.orderStatus == 11 && (
            <Image
              source={statusUnwinImg}
              style={{
                position: 'absolute',
                right: 15,
                top: 15,
                width: 100,
                height: 25,
              }}
            />
          )}
          {[10, 12].includes(orderInfo?.orderStatus || 0) && (
            <Image
              source={status2Img}
              style={{
                position: 'absolute',
                right: 15,
                top: 15,
                width: 100,
                height: 25,
              }}
            />
          )}
        </View>
        {/* Overview */}
        <View style={styles.overview}>
          <View className="items-center border border-gray-200 rounded-md p-2 flex-1">
            <Text style={styles.amount}>
              {formatCurrency(orderInfo?.amount)}
            </Text>
            <Text style={{fontSize: FONT_SIZES.medium}}>方案金额</Text>
          </View>
          <View className="items-center border border-gray-300 rounded-md p-2 flex-1">
            <Text
              style={[
                styles.status,
                {
                  color:
                    Number(orderInfo?.orderStatus) < 9
                      ? 'black'
                      : Number(orderInfo?.orderStatus) === 10
                        ? 'green'
                        : 'red',
                },
              ]}>
              {orderInfo?.orderStatusChinese}
            </Text>
            <Text style={{fontSize: FONT_SIZES.medium}}>方案状态</Text>
          </View>
          <View className="items-center border border-gray-300 rounded-md p-2 flex-1">
            <Text style={styles.amount}>{`${
              orderInfo?.calcAmount && Number(orderInfo?.calcAmount) > 0
                ? formatCurrency(orderInfo?.calcAmount)
                : '--'
            }`}</Text>
            <Text style={{fontSize: FONT_SIZES.medium}}>税后奖金</Text>
          </View>
        </View>

        {/* Bet Information */}
        <View className="bg-white mb-2">
          <View className="flex-row items-center p-2">
            <Text className="text-lg font-bold">投注信息</Text>
          </View>
          <View className="flex-row border-b border-gray-100 gap-[2px]">
            <Text
              className="text-center bg-[#f5f5f5] py-3 text-lg font-bold"
              style={{width: 70}}>
              玩法
            </Text>
            <Text className="flex-1 text-center bg-[#f5f5f5] py-3 text-lg font-bold">
              投注
            </Text>
            <Text
              className="text-center bg-[#f5f5f5] py-3 text-lg font-bold  "
              style={{width: 100}}>
              倍数/金额
            </Text>
          </View>
          {orderInfo?.betContentDigitalLotteryList?.map((bet, index) => (
            <View key={index} className="flex-row border-b border-gray-100">
              <View
                className="  items-center justify-center border border-gray-100"
                style={{width: 70}}>
                <Text
                  className="text-center text-gray-700 text-lg"
                  style={{fontWeight: 'bold'}}>
                  {bet.betPlay}
                </Text>
              </View>
              <View className="flex-1 items-center justify-center">
                <Text className="text-center text-gray-700 text-lg">
                  {digitalTicketContent(bet.betItem, bet.betPlay)}
                </Text>
              </View>

              <View
                style={{width: 100}}
                className="items-center justify-center">
                <Text
                  className="text-center text-lg "
                  style={{fontWeight: 'bold'}}>
                  {bet.betMultiple} 倍
                </Text>
                <Text
                  className="text-center text-lg text-red-500 "
                  style={{fontWeight: 'bold'}}>
                  {formatCurrency(bet.betAmount)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Chase Status */}
        <View className="bg-white mb-2">
          <View className="flex-row items-center  gap-2 p-2">
            <Text className="text-lg font-bold">追号情况</Text>
            <View className="px-2 py-1 rounded-md border border-blue-600">
              <Text className="text-sm text-blue-600">
                第
                {orderInfo?.chaseNumberRecordList?.findIndex(
                  item => item.orderStatus > 4,
                ) + 1 || 0}
                期/共{orderInfo?.chaseNumberRecordList?.length || 0}期
              </Text>
            </View>
          </View>
          <View className="flex-row border-b border-gray-100 gap-[2px]">
            <Text
              className="text-center bg-[#f5f5f5] py-3 text-lg font-bold"
              style={{width: 80}}>
              期数
            </Text>
            <Text
              className="text-center bg-[#f5f5f5] py-3 text-lg font-bold"
              style={{width: 80}}>
              购买日期
            </Text>
            <Text
              className="text-center bg-[#f5f5f5] py-3 text-lg font-bold"
              style={{width: 80}}>
              投注金额
            </Text>
            <Text className="flex-1 text-center bg-[#f5f5f5] py-3 text-lg font-bold">
              开奖号码
            </Text>
            <Text
              className="text-center bg-[#f5f5f5] py-3 text-lg font-bold"
              style={{width: 100}}>
              状态
            </Text>
          </View>
          <FlatList
            className="flex-1"
            data={orderInfo?.chaseNumberRecordList?.sort(
              (a, b) => Number(a.termNo) - Number(b.termNo),
            )}
            renderItem={({item: chase, index}) => (
              <View key={index} className="flex-row border-b border-gray-100">
                <View
                  className="items-center justify-center border border-gray-100"
                  style={{width: 80}}>
                  <Text className="text-center text-gray-700 text-lg">
                    {chase.termNo}期
                  </Text>
                </View>
                <View
                  className="items-center justify-center border border-gray-100"
                  style={{width: 80}}>
                  <Text className="text-center text-gray-700 text-md">
                    {formatDateTime(chase.estimatedBettingTime)}
                  </Text>
                </View>
                <View
                  className="items-center justify-center border border-gray-100"
                  style={{width: 80}}>
                  <Text className="text-center text-gray-700 text-lg">
                    {formatCurrency(chase.amount)}
                  </Text>
                </View>
                <View className="flex-1 items-center justify-center">
                  <Text className="text-center text-gray-700 text-lg">
                    {chase.lotteryNumber || '--'}
                  </Text>
                </View>
                <View
                  className="items-center justify-center border border-gray-100"
                  style={{width: 100}}>
                  {chase.orderStatus > 4 ? (
                    <TouchableOpacity
                      className="px-2 py-1 rounded  "
                      onPress={() => {
                        // 跳转到详情页面
                        router.push(
                          `/order/bet/detail?orderId=${chase.orderID}`,
                        );
                      }}>
                      <Text className="text-lg text-blue-500">查看{'>'}</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text className="text-center text-gray-700 text-lg">
                      {chase.orderStatusChinese}
                    </Text>
                  )}
                </View>
              </View>
            )}
          />
        </View>

        {[4, 5].includes(orderInfo?.winStatus || 0) && (
          <CountdownTimer
            seconds={countdown} // 倒计时 2 分钟
            onConfirm={() => {
              customerCancelOrder({
                orderID: orderInfo?.orderNo || '',
              }).then(res => {
                if (res.success) {
                  Toast.show('撤销成功');
                  getOrderOrSchemeDetailsByOrderId({
                    orderId: orderId as string,
                  }).then(res => {
                    if (res.data) {
                      setOrderInfo(res.data);
                      const createTime = dayjs().diff(
                        res.data?.createdAt,
                        'seconds',
                      );

                      if (createTime < 5 * 60) {
                        setCountdown(300 - createTime);
                      }
                    }
                  });
                }
              });
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default BetDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },

  overview: {
    flexDirection: 'row',
    // padding: 16,
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
  },

  icon: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  amount: {
    color: themeRedColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'orange',
  },
});
