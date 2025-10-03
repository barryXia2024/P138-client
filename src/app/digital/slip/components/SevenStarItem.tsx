import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

import DigitalBall, {
  DigitalBallSize,
} from 'src/app/lottery/components/DigitalBall';

import MultiplierSection from 'src/app/lottery/slip/sport/components/MultiplierSection';
import closeImg from 'src/assets/imgs/home/close.png';

import {SlipItemProps} from '../types';

const SevenStarItem: React.FC<SlipItemProps> = (props: SlipItemProps) => {
  const {
    ticket,
    ticketsMultiplier,
    setTicketsMultiplier,
    removeTicket,
    setMultiplierModal,
    append,
  } = props;
  const multiplier = ticketsMultiplier[ticket.betId] || 1;
  // 基础金额：每注2元，追加后每注3元
  const perBetAmount = append === '1' ? 3 : 2;
  const totalAmount = perBetAmount * (ticket.betCount || 1) * multiplier;
  const array = [
    '第一位',
    '第二位',
    '第三位',
    '第四位',
    '第五位',
    '第六位',
    '第七位',
  ];
  return (
    <View className="bg-white p-4 rounded-xl mx-2 mt-4">
      <TouchableOpacity
        className="absolute right-0 top-0 p-2 "
        style={{zIndex: 9999}}
        onPress={() => removeTicket(ticket.betId)}>
        <Image
          source={closeImg}
          className="w-8 h-8"
          resizeMode="contain"
          style={{width: 32, height: 32}}
        />
      </TouchableOpacity>
      {ticket.positions?.map((pos: string[], idx: number) => (
        <View key={idx} className="flex-row flex-wrap mb-1">
          <Text className="mr-2 text-lg">{array[idx]}</Text>
          {pos
            .sort((a, b) => a.localeCompare(b))
            .map((v: string, i: number) => (
              <DigitalBall
                key={i}
                value={v}
                color="red"
                selected
                size={DigitalBallSize.Medium}
              />
            ))}
        </View>
      ))}
      <View className="flex-row justify-between items-center">
        <Text className="text-lg">
          {ticket.betCount > 1 ? '[复式]' : '[单式]'} {ticket.betCount}注{' '}
          {multiplier}倍{' '}
          <Text className="text-red-500  d">{totalAmount}元</Text>
          {append === '1' && (
            <Text className="text-xs text-gray-500"> (追加投注)</Text>
          )}
        </Text>
        <MultiplierSection
          title=""
          multiplier={multiplier}
          setMultiplier={value => {
            setTicketsMultiplier({...ticketsMultiplier, [ticket.betId]: value});
          }}
          toggleMultiplierModal={() => {
            setMultiplierModal({
              isVisiable: true,
              value: multiplier,
              type: 'multiplier',
              ticket: ticket,
            });
          }}
        />
      </View>
    </View>
  );
};

export default SevenStarItem;
