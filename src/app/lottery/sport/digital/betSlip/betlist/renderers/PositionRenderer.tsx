import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import deleteImg from 'src/assets/imgs/gendan/delete.png';
import {PositionTicket, LOTTERY_CONFIGS} from '../../../core';

interface Props {
  ticket: PositionTicket;
  onRemove: (betId: string) => void;
}

export const PositionRenderer: React.FC<Props> = ({ticket, onRemove}) => {
  const lotteryName = LOTTERY_CONFIGS[ticket.lotteryName].name;
  const array = ['第一位', '第二位', '第三位', '第四位', '第五位', '第六位', '第七位'];
  
  const formatPosition = (position: number[], index: number) => {
    const sorted = position.sort((a, b) => a - b);
    return `${array[index]}: ${sorted.join(' ')}`;
  };
  
  const getPlayType = () => {
    return ticket.betCount === 1 ? '单式' : '复式';
  };
  
  return (
    <View className="bg-white p-4 mb-3 rounded-lg">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-black">{lotteryName}</Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm text-gray-600">{getPlayType()}</Text>
          <TouchableOpacity onPress={() => onRemove(ticket.betId)}>
            <Image
              source={deleteImg}
              className="w-5 h-5"
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View className="mb-2">
        {ticket.positions.map((position, index) => (
          <Text key={index} className="text-base text-gray-800">
            {formatPosition(position, index)}
          </Text>
        ))}
      </View>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-gray-600">
          共{ticket.betCount}注 {ticket.betAmount}元
        </Text>
      </View>
    </View>
  );
};
