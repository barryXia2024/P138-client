import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Button,
} from 'react-native';
import {themeRedColor} from 'p138-react-common/utils/styles/color';

import AppHeader from '@/p138-react-common/components/AppHeader';

import dayjs from 'dayjs';
import JcBetInfo from './components/JcBetInfo';
import CtBetInfo from './components/ctBetInfo';

import ArrowIcon from '@/p138-react-common/components/Arrow';
import {
  customerCancelOrder,
  getOrderOrSchemeDetailsByOrderId,
} from 'src/api/interface/orders-bet';
import {Redirect, router, useLocalSearchParams} from 'expo-router';
import {FONT_SIZES, ICON_SIZES} from 'p138-react-common/utils/styles/theme';
import {lotteryChineseNameMap} from '@/p138-react-common/constants/LotteryCommon';
import FourSixBetInfo from './components/foursixBetInfo';

import {ROUTE_PATHS, SportLotteryTypeEnum} from 'src/modules/lottery/constants';
import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';
import CountdownTimer from './components/CountdownTimer';
import {generateOddsCellKey} from 'src/modules/lottery/utils/lottery';
import ImageUpload from '@/p138-react-common/components/Upload/ImageSelector';

import {LotteryIconMap} from 'src/modules/lottery/constants/LotteryCommon';

import {formatCurrency} from '@/p138-react-common/utils';
import DigitalTicketList from './components/DigitalTicketList';
import {useBetlistStore} from 'src/app/lottery/sport/digital/betSlip';
import {computeSuperLotto} from 'src/app/lottery/sport/digital/lotteryTypes';
import {DeviceIdGenerator} from 'src/utils/device';
import statusUnwinImg from 'src/assets/imgs/gendan/status_unwin.png';
import status2Img from 'src/assets/imgs/gendan/status2.png';
import {
  DigitalTicket,
  SuperLottoTicket,
} from 'src/app/lottery/sport/digital/core';
import {listCustomLotteryApi} from 'src/api/interface/lottery-lottery-type';
import {useUserStore} from 'src/store';
import {DigitalLotteryNames} from 'src/app/lottery/sport/digital/lotteryTypes/configs/lotteryConfigs';
import {useMqttStore} from 'src/store/mqtt';

// 1: 保存方案, 2: 已删除, 3: 已取消, 4: 待接单(包含已下单), 5: 待出票, 6: 出票失败(包含已撤单,超时退票), 7: 已出票(待开奖), 8: 已取票, 10: 待派奖, 11: 未中奖, 12: 已派奖, 9: 已撤单
const BetDetails: React.FC = () => {
  const {orderId} = useLocalSearchParams();
  const [orderInfo, setOrderInfo] = useState<ServerCoreOrder.LotteryOrder>();
  const [isOrderDetailsCollapsed, setIsOrderDetailsCollapsed] = useState(true); // 控制订单详情的折叠状态
  const {addTicket, clearAll, setLotteryData} = useBetlistStore();
  const {loginInfo} = useUserStore();
  const {setLotteryInfo} = useLotteryInfoStore();
  const {setSelectedMatches, setMatchData} = useBetInfoStore();
  const {lastMessage} = useMqttStore();

  const toggleOrderDetails = () => {
    setIsOrderDetailsCollapsed(!isOrderDetailsCollapsed);
  };
  useEffect(() => {
    getOrderOrSchemeDetailsByOrderId({orderId: orderId as string}).then(res => {
      setOrderInfo(res.data);
      const createTime = dayjs().diff(res.data?.createdAt, 'seconds');

      if (createTime < 5 * 60) {
        setCountdown(300 - createTime);
      }
    });
  }, [orderId]);

  useEffect(() => {
    if (lastMessage && lastMessage.payload.msgSubTypeName == '出票成功') {
      if (orderInfo) {
        setOrderInfo({
          ...orderInfo,
          orderStatus: 7,
        });
      }
    }
  }, [lastMessage]);
  const handleBet = async () => {
    const matchDataArray: LotteryDataSource.MatchInfo[] = JSON.parse(
      orderInfo?.frontEndOnly ?? '[]',
    );
    const dict: Record<string, string[]> = {};
    matchDataArray.forEach(item => {
      setMatchData(item.competitionId.toString(), item);
      item.handicapDtos?.forEach(handicap => {
        handicap.competitionOddsDtos?.forEach(odds => {
          if (!dict[item.competitionId.toString()]) {
            // 如果比赛id不存在，则创建一个空数组
            dict[item.competitionId.toString()] = [];
          }

          if (orderInfo?.betContentTraditionalLotteryList) {
            orderInfo?.betContentTraditionalLotteryList.forEach(lottery => {
              if (lottery.competitionId === item.competitionId) {
                lottery.betPlayList?.forEach(betPlay => {
                  if (betPlay.betItem === odds.betItem) {
                    dict[item.competitionId.toString()].push(
                      generateOddsCellKey(item.competitionId, handicap, odds),
                    );
                    return;
                  }
                });
                return;
              }
            });
          }

          if (orderInfo?.betContentSportsLotteryList) {
            orderInfo?.betContentSportsLotteryList.forEach(lottery => {
              if (lottery.competitionId === item.competitionId) {
                lottery.betPlayList?.forEach(betPlay => {
                  if (betPlay.betItem === odds.betItem) {
                    dict[item.competitionId.toString()].push(
                      generateOddsCellKey(item.competitionId, handicap, odds),
                    );
                    return;
                  }
                });
                return;
              }
            });
          }

          // 数字彩不参与此处比赛选项映射
        });
      });
    });
    const lotteryInfo = await getLotteryInfo();

    if (lotteryInfo) {
      setLotteryInfo(lotteryInfo);
    }
    setSelectedMatches(dict);
    router.push({
      pathname: ROUTE_PATHS.BETTING_SLIP,
      params: {
        isSave: 1,
        lottery: orderInfo?.lotteryName,
        play: orderInfo?.playName,
        id: orderInfo?.id,
      },
    });
  };
  const handleDigitalBetPlan = async () => {
    // 构建票据并加入列表（含计算）
    const items = orderInfo?.betContentDigitalLotteryList || [];
    if (!items.length) {
      Toast.show('无数字彩投注内容');
      return;
    }
    clearAll();
    if (orderInfo?.frontEndOnly) {
      const lotteryData = JSON.parse(orderInfo?.frontEndOnly);
      if (lotteryData) {
        setLotteryData(lotteryData);
      }
    }

    const parseNumList = (s: string) =>
      Array.from(
        (s || '')
          .split(/[||]/)
          .map(v => Number(v))
          .filter(n => !Number.isNaN(n)),
      ).sort((a, b) => a - b);

    const generator = new DeviceIdGenerator();

    for (const it of items) {
      const betPlay: string = it.betPlay; // '单式' | '复式' | '胆拖'
      const betItem: string = it.betItem; // 形如 '1,2,3,4,5|1,2' 或 '2,3*4,5,6|1*2,3'

      // 支持两种格式：
      // 1) 红#蓝（例如 1|17|28|29|34#8|10）
      // 2) 红|蓝（例如 1,2,3,4,5|1,2）
      const [left, right] = String(betItem).includes('-')
        ? String(betItem).split('#')
        : String(betItem).split('|');
      let ticketData: DigitalTicket;

      if (betPlay === '胆拖') {
        const [redDanStr = '', redTuoStr = ''] = (left || '').split('#');
        const [blueDanStr = '', blueTuoStr = ''] = (right || '').split('#');
        const redDan = parseNumList(redDanStr);
        const redTuo = parseNumList(redTuoStr);
        const blueDan = parseNumList(blueDanStr);
        const blueTuo = parseNumList(blueTuoStr);
        ticketData = {
          lotteryName:
            orderInfo?.lotteryName || ('SuperLotto' as DigitalLotteryNames),
          mode: 'dantuo',
          positions: [redDan, redTuo, blueDan, blueTuo],
        };
      } else {
        const redStr = left || '';
        const blueStr = right || '';
        const red = parseNumList(redStr);
        const blue = parseNumList(blueStr);
        ticketData = {
          lotteryName:
            orderInfo?.lotteryName || ('SuperLotto' as DigitalLotteryNames),
          mode: 'normal',
          positions: [red, blue],
        };
      }

      const {betCount, betAmount} = computeSuperLotto(
        ticketData as SuperLottoTicket,
      );
      const betId = await generator.generateSnowflakeId();

      addTicket({
        ...ticketData,
        betId,
        betCount,
        betAmount,
      });
    }
    const lotteryInfo = await getLotteryInfo();

    if (lotteryInfo) {
      setLotteryInfo(lotteryInfo);
    }
    router.push({
      pathname: '/lottery/sport/digital/betlist',
      params: {
        isSave: 1,
        redirectUrl: '/order/bet/record',
      },
    });
  };
  const getLotteryInfo = async () => {
    if (loginInfo?.shopCode) {
      const res = await listCustomLotteryApi({
        shopCode: loginInfo.shopCode,
      });
      const lotteryInfo = res.data?.find(
        item => item.lotteryName === orderInfo?.lotteryName,
      );
      return lotteryInfo;
    } else {
      return null;
    }
  };
  const [countdown, setCountdown] = useState(0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader
        title={orderInfo?.orderStatus === 1 ? '保存详情' : '自购方案详情'}
      />
      <ScrollView className='flex-1'>
        <View className="flex-row items-center  bg-white p-4 gap-2">
          {orderInfo?.lotteryName && (
            <Image
              style={{width: ICON_SIZES.large, height: ICON_SIZES.large}}
              source={LotteryIconMap[orderInfo?.lotteryName]}
            />
          )}
          <Text style={styles.icon}>
            {lotteryChineseNameMap[orderInfo?.lotteryName ?? 'FootballLottery']}
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
 
        <View style={styles.overview}>
          <View className="items-center border border-gray-200 rounded-md p-2 flex-1">
            <Text style={styles.amount}>
              {formatCurrency(orderInfo?.betAmount)}
            </Text>
            <Text style={{fontSize: FONT_SIZES.medium}}>方案金额</Text>
          </View>
          <View className="items-center border border-gray-300 rounded-md p-2 flex-1">
            <Text
              style={[
                styles.status,
                {
                  color:
                    Number(orderInfo?.orderStatus) < 10
                      ? 'black'
                      : Number(orderInfo?.orderStatus) === 11
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

        {/* Order Details */}
        {orderInfo?.orderStatus !== 1 && (
          <View className="p-4 bg-white mt-2">
            <TouchableOpacity
              className="flex-row items-center justify-between"
              onPress={toggleOrderDetails}>
              <Text style={styles.sectionTitle}>订单详情</Text>
              <ArrowIcon
                isTap={isOrderDetailsCollapsed}
                style={{width: ICON_SIZES.xsmall, height: ICON_SIZES.xsmall}}
              />
            </TouchableOpacity>
            {!isOrderDetailsCollapsed && orderInfo && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>方案截止时间</Text>
                  <Text className="font-bold">
                    {dayjs(orderInfo.buyEndTime).format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>方案投注时间</Text>
                  <Text className="font-bold">
                    {dayjs(orderInfo.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>订单编号</Text>
                  <View style={styles.copyRow}>
                    <Text className="font-bold">{orderInfo.orderNo}</Text>
                    <TouchableOpacity>
                      {/* <Icon name="content-copy" size={16} color={themeRedColor} /> */}
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        )}

        {/* Bet Information */}
        <View style={styles.section}>
          {['GameTotalGoalsBet4', 'HalfTimeFullTimeBet6'].includes(
            orderInfo?.lotteryName ?? '',
          ) && <FourSixBetInfo orderInfo={orderInfo!} />}

          {orderInfo?.lotteryType === SportLotteryTypeEnum.Sport && (
            <JcBetInfo orderInfo={orderInfo!} />
          )}
          {orderInfo?.lotteryType === SportLotteryTypeEnum.Traditional && (
            <CtBetInfo orderInfo={orderInfo!} />
          )}
          {orderInfo?.lotteryType === SportLotteryTypeEnum.Digital &&
            orderInfo && <DigitalTicketList orderData={orderInfo} />}
        </View>

        {[4, 5].includes(orderInfo?.orderStatus || 0) && (
          <CountdownTimer
            seconds={countdown} // 倒计时 2 分钟
            onConfirm={() => {
              customerCancelOrder({
                orderID: orderInfo?.id || '',
              }).then(res => {
                if (res.success) {
                  Toast.show('撤销成功');
                  getOrderOrSchemeDetailsByOrderId({
                    orderId: orderId as string,
                  }).then(res => {
                    setOrderInfo(res.data);
                    const createTime = dayjs().diff(
                      res.data?.createdAt,
                      'seconds',
                    );

                    if (createTime < 5 * 60) {
                      setCountdown(300 - createTime);
                    }
                  });
                }
              });
            }}
          />
        )}

        {orderInfo?.ticketUrl && (
          <View className="bg-white p-4 mb-2">
            <Text className="text-gray-500">
              票据 （点击下图预览可保存图片）
            </Text>
            <ImageUpload
              userID={orderInfo?.userID ?? ''}
              canModify={false}
              className="justify-center items-start"
              showClearButton={false}
              style={{width: 80, height: 80}}
              previewImageClassName="w-full"
              source={orderInfo?.ticketUrl.split(',')}
              containerClassName="items-center justify-center"
              previewImageProps={{
                style: {
                  width: 80,
                  height: 80,
                },
              }}
            />
          </View>
        )}

        {orderInfo?.orderStatus !== 1 && (
          <View className="p-4 bg-white">
            <Text className="text-sm">温馨提示</Text>
            <Text className="text-gray-500 text-xs">
              1.此页面只展示订单状态，一切均以实体票为准，本平台不对此订单状态做任何担保;
            </Text>
            <Text className="text-gray-500 text-xs">
              2.如发现实体票照片于投注内容不符，请及时联系店主
            </Text>
            <Text className="text-gray-500 text-xs">
              3.若订单中奖，请您及时核对实体票样的奖金
            </Text>
          </View>
        )}
        {orderInfo?.orderStatus === 1 && (
          <View className="p-4">
            <Button
              color={themeRedColor}
              title="投注此方案"
              onPress={
                orderInfo?.lotteryType === SportLotteryTypeEnum.Digital
                  ? handleDigitalBetPlan
                  : handleBet
              }
            />
          </View>
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
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 50,
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

  section: {
    backgroundColor: '#fff',
    marginVertical: 8,
    // paddingHorizontal: 16,
    paddingVertical: 6,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  detailLabel: {
    color: '#666',
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
