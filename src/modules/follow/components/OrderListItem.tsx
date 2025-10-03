import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {router} from 'expo-router';
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import {IMAGE_SIZE} from '@/p138-react-common/utils/styles/theme';
import {lotteryChineseNameMap} from '@/p138-react-common/constants/LotteryCommon';
import dayjs from 'dayjs';
import ResultStamp from './ResultStamp';
import { LotteryIconMap } from 'src/modules/lottery/constants/LotteryCommon';

const OrderListItem = ({
  item,
  onPress,
  tabIndex,
  isMine,
}: FollowProps.OrderListItemProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress(item);
    } else {
      router.push(`/follow/betInfo/${item.orderNo}`);
    }
  };

  console.log('isMine', isMine);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      className="p-2 bg-white">
      <View className="flex-row items-center gap-2">
        <OSSImage
          source={
            LotteryIconMap[item.lotteryName as CommonCommonEnum.LotteryName]
          }
          style={IMAGE_SIZE.IMAGE_SIZE30}
        />
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-[16px] flex-1">
              {lotteryChineseNameMap[item.lotteryName]}
              {!isMine && <Text className="text-[14px]">
                预计回报：
                <Text className="text-red-500">
                  {item.expectedReturn?.toFixed(2)}
                </Text>
                倍
              </Text>}
              {isMine && <Text className="text-[14px] ml-2">
                下单时间：
                <Text className="text-red-500">
                  {dayjs(item.createdAt).format('MM-DD')}
                </Text>
                
              </Text>}
            </Text>
            <Text style={{color: '#666'}} className="text-gray-100">
              {dayjs(item.buyEndTime).format('MM-DD HH:mm')}截止
            </Text>
          </View>
          <Text className="text-[14px]">玩法：{item.bettingString}</Text>
        </View>
      </View>
      <ResultStamp item={item} size={80} />
      <View style={styles.footer}>
        <View style={styles.amountRow}>
          <Text style={styles.amountText}>
            自购金额：<Text style={styles.highlight}>{item.betAmount} </Text>元
          </Text>
          {item.commission > 0 && (
            <Text style={styles.amountText}>
              跟单佣金：<Text style={styles.highlight}>{item.commission}</Text>{' '}
              元
            </Text>
          )}
        </View>
        {(tabIndex === 'plan' || (!isMine && tabIndex === 'follow')) && (
          <View style={styles.followRow}>
            <Text style={styles.amountText}>
              跟单金额：
              <Text style={styles.highlight}>{item.followAmount ?? 0} </Text>元
            </Text>
            <Text style={styles.amountText}>
              跟单人数：
              <Text style={styles.highlight}>{item.followNum ?? 0} </Text>人
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  footer: {
    marginTop: 8,
    gap: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  followRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  amountText: {
    fontSize: 14,
  },
  highlight: {
    color: '#ff4d4f',
    fontWeight: '500',
  },
});

export default OrderListItem;
