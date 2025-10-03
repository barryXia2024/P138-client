import React, {useMemo, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

import DigitalBall, { DigitalBallSize } from 'src/app/lottery/components/DigitalBall';

import MultiplierSection from 'src/app/lottery/slip/sport/components/MultiplierSection';
  import closeImg from 'src/assets/imgs/home/close.png';
  import {DigitalTicket, PositionTicket} from 'src/app/lottery/sport/digital/core';

const PositionSlipItem: React.FC<{
  item: PositionTicket;
  ticketsMultiplier: Record<string, number>;
  setTicketsMultiplier: (multiplier: Record<string, number>) => void;
  removeTicket: (betId: string) => void;
  setMultiplierModal: (modal: {
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: DigitalTicket;
  }) => void;
}> = ({
  item,
  ticketsMultiplier,
  setTicketsMultiplier,
  removeTicket,
  setMultiplierModal,
}) => {
  const multiplier = ticketsMultiplier[item.betId] || 1;
  return (
    <View className="bg-white p-4 rounded-xl mx-2 mt-4">
      <TouchableOpacity
        className="absolute right-0 top-0 p-2"
        onPress={() => removeTicket(item.betId)}>
        <Image
          source={closeImg}
          className="w-8 h-8"
          resizeMode="contain"
          style={{width: 32, height: 32}}
        />
      </TouchableOpacity>
      {item.positions?.map((pos: number[], idx: number) => (
        <View key={idx} className="flex-row flex-wrap mb-1">
          <Text className="mr-2 text-lg">{['百', '十', '个'][idx]}</Text>
          {pos
            .sort((a, b) => a - b)
            .map((v: number, i: number) => (
              <DigitalBall
                key={i}
                value={v}
                color="red"
                selected
                size={DigitalBallSize.Small}
              />
            ))}
        </View>
      ))}
      <View className="flex-row justify-between items-center">
        <Text className="text-lg">
          {item.playMode}[复式]{item.betCount}注 {multiplier}倍{' '}
          <Text className="text-red-500 font-bold">
            {item.betAmount * multiplier}元
          </Text>
        </Text>
        <MultiplierSection
          title=""
          multiplier={multiplier}
          setMultiplier={value => {
            setTicketsMultiplier({...ticketsMultiplier, [item.betId]: value});
          }}
          toggleMultiplierModal={() => {
            setMultiplierModal({
              isVisiable: true,
              value: multiplier,
              type: 'multiplier',
              ticket: item,
            });
          }}
        />
      </View>
    </View>
  );
};

export default PositionSlipItem;
