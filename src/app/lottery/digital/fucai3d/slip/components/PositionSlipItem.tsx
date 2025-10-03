import React, {useMemo, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

import DigitalBall from 'src/app/lottery/components/DigitalBall';

import MultiplierSection from 'src/app/lottery/slip/sport/components/MultiplierSection';
import closeImg from 'src/assets/imgs/home/close.png';
import {Fucai3DTicket} from '../../core/types';
import {f3dGenerateBetPlay} from '../../calc/f3dCalculator';
import {isEmpty} from '@/p138-react-common/utils';

const PositionSlipItem: React.FC<{
  item: Fucai3DTicket;
  ticketsMultiplier: Record<string, number>;
  setTicketsMultiplier: (multiplier: Record<string, number>) => void;
  removeTicket: (betId: string) => void;
  setMultiplierModal: (modal: {
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: Fucai3DTicket;
  }) => void;
}> = ({
  item,
  ticketsMultiplier,
  setTicketsMultiplier,
  removeTicket,
  setMultiplierModal,
}) => {
  const multiplier = ticketsMultiplier[item.betId] || 1;
  const {playMode, subPlayMode} = f3dGenerateBetPlay(item);
  const playType = isEmpty(subPlayMode)
    ? `${playMode}`
    : `${playMode}[${subPlayMode}]`;
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
      {item.positions?.map((pos: number[], idx: number) => {
        return (
         pos.length > 0 && <View key={idx} className="flex-row flex-wrap mb-1">
            <Text className="mr-2 text-lg">{['百位', '十位', '个位'][idx]}</Text>
            {pos
              .sort((a, b) => a - b)
              .map((v: number, i: number) => (
                <DigitalBall
                  key={i}
                  value={v}
                  color="red"
                  selected
                  size="small"
                />
              ))}
          </View>
        );
      })}
      <View className="flex-row justify-between items-center">
        <Text className="text-lg">
          {playType} {item.betCount}注 {multiplier}倍{' '}
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
