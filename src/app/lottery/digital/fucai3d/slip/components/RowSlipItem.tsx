import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

import DigitalBall from 'src/app/lottery/components/DigitalBall';

import MultiplierSection from 'src/app/lottery/slip/sport/components/MultiplierSection';
import closeImg from 'src/assets/imgs/home/close.png';
import {Fucai3DTicket} from '../../core/types';

import {f3dGenerateBetPlay} from '../../calc/f3dCalculator';
import {isEmpty} from '@/p138-react-common/utils';
import {Fucai3DPlayEnum, Fucai3DSubPlayEnum} from '../../shared/enums';

const RowSlipItem = ({
  item,
  ticketsMultiplier,
  setTicketsMultiplier,
  removeTicket,
  setMultiplierModal,
}: {
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
}) => {
  const {betCount, betAmount} = item;
  const multiplier = ticketsMultiplier[item.betId] || 1;

  const DantuoItem = () => {
    return (
      <View className="flex-row flex-wrap">
        {item.positions.map((numbers, index) => (
          <View className="flex-row flex-wrap" key={index}>
            {numbers.map((number, i) => (
              <DigitalBall
                key={i}
                value={
                  item.playMode === Fucai3DPlayEnum.GroupThree &&
                  item.subPlayMode === Fucai3DSubPlayEnum.Single &&
                  index === 0
                    ? `${number}${number}`
                    : number
                }
                color="red"
                selected
                size="medium"
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

  const playType = () => {
    const {playMode, subPlayMode} = f3dGenerateBetPlay(item);

    return isEmpty(subPlayMode) ? `${playMode}` : `${playMode}[${subPlayMode}]`;
  };

  return (
    <View className="bg-white p-4 rounded-xl mx-2 mt-4 relative">
      <TouchableOpacity
        className="absolute right-0 top-0 "
        style={{
          width: 40,
          height: 40,
          zIndex: 1000,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        activeOpacity={1}
        onPress={() => removeTicket(item.betId)}>
        <Image
          source={closeImg}
          className="w-8 h-8"
          resizeMode="contain"
          style={{width: 32, height: 32}}
        />
      </TouchableOpacity>
      <DantuoItem />
      <View className="flex-row justify-between items-center">
        <Text className="text-lg">
          {playType()} {betCount}注 {multiplier}倍
          <Text className="text-red-500 font-bold">
            {betAmount * multiplier}元
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

export default RowSlipItem;
