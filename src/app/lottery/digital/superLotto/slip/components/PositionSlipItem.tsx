import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import DigitalBall from 'src/app/lottery/components/DigitalBall';
import MultiplierSection from 'src/app/lottery/digital/components/MultiplierSection';
import closeImg from 'src/assets/imgs/home/close.png';
import {PositionTicket, DigitalTicket} from 'src/app/lottery/sport/digital/core';
import { AppendFlagEnum } from '../../../shared/types';

const PositionSlipItem: React.FC<{
  item: PositionTicket;
  append: AppendFlagEnum;
  ticketsMultiplier: Record<string, number>;
  setTicketsMultiplier: (multiplier: Record<string, number>) => void;
  removeTicket: (betId: string) => void;
  setMultiplierModal: (modal: {
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: DigitalTicket;
  }) => void;
}> = ({item, ticketsMultiplier, setTicketsMultiplier, removeTicket, setMultiplierModal, append}) => {
  const multiplier = ticketsMultiplier[item.betId] || 1;
  const perBetAmount = append ===AppendFlagEnum.Append  ? 3 : 2;
  const totalAmount = perBetAmount * (item.betCount || 1) * multiplier;

  return (
    <View className="bg-white p-4 rounded-xl mx-2 mt-4">
      <TouchableOpacity className="absolute right-0 top-0 p-2" onPress={() => removeTicket(item.betId)}>
        <Image source={closeImg} className="w-8 h-8" resizeMode="contain" style={{width: 32, height: 32}} />
      </TouchableOpacity>
      {item.positions?.map((pos: number[], idx: number) => (
        <View key={idx} className="flex-row flex-wrap mb-1">
          <Text className="mr-2">第{idx + 1}位</Text>
          {pos
            .sort((a, b) => a - b)
            .map((v: number, i: number) => (
              <DigitalBall key={i} value={v} color="red" selected size="small" />
            ))}
        </View>
      ))}
      <View className="flex-row justify-between items-center">
        <Text className="text-lg">
          {item.betCount > 1 ? '[复式]' : '[单式]'} {item.betCount}注 {multiplier}倍{' '}
          <Text className="text-red-500 font-bold">{totalAmount}元</Text>
        </Text>
        <MultiplierSection
          title=""
          multiplier={multiplier}
          setMultiplier={value => setTicketsMultiplier({...ticketsMultiplier, [item.betId]: value})}
          toggleMultiplierModal={() => setMultiplierModal({isVisiable: true, value: multiplier, type: 'multiplier', ticket: item})}
        />
      </View>
    </View>
  );
};

export default PositionSlipItem;


