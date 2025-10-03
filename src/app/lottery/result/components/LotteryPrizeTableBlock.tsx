import { formatCurrency } from '@/p138-react-common/utils';
import React from 'react';
import {View, Text} from 'react-native';

// // 金额格式化
// const formatAmount = (num?: number | string): string => {
//   if (num == null) return '-';
//   const number = typeof num === 'string' ? parseFloat(num) : num;
//   return number.toLocaleString(undefined, {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2,
//   });
// };

interface LotteryPrizeTableBlockProps {
  prizeList: LotteryDrawAnnouncement.LotteryPrize[] | null;
  salesAmount?: number | string;
  jackpotAmount?: number | string;
  style?: any;
}

const LotteryPrizeTableBlock: React.FC<LotteryPrizeTableBlockProps> = ({
  prizeList,
  salesAmount,
  jackpotAmount,
  style,
}) => {
  return (
    <View
      className="w-full bg-white mt-4 rounded-md overflow-hidden border border-gray-100"
      style={style}>
      {/* 表头 */}
      <View className="flex-row bg-gray-100 border-b border-gray-200">
        <Text className="flex-1 text-center py-2 font-bold">奖级</Text>
        <Text className="flex-1 text-center py-2 font-bold">中奖注数(注)</Text>
        <Text className="flex-1 text-center py-2 font-bold">中奖金额(元)</Text>
      </View>

      {/* 表体 */}
      {prizeList?.map((item, index) => (
        <View
          key={index}
          className="flex-row border-b border-gray-100 bg-white">
          <Text className="flex-1 text-center py-2">{item.name}</Text>
          <Text className="flex-1 text-center py-2">{item.num}</Text>
          <Text className="flex-1 text-center py-2">
            {item.amount}
          </Text>
        </View>
      ))}

      {/* 销量与奖池 */}
      <View className="flex-row justify-around items-center px-4 py-3 bg-white">
        <View className="flex-1 items-center">
          <Text className="text-gray-500 text-sm">本期销量(元)</Text>
          <Text className="text-red-500 text-base font-semibold mt-1">
            {salesAmount}
          </Text>
        </View>

        <View className="flex-1 items-center">
          <Text className="text-gray-500 text-sm">奖池(元)</Text>
          <Text className="text-red-500 text-base font-semibold mt-1">
            {jackpotAmount}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LotteryPrizeTableBlock;
