import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

import DigitalBall from 'src/app/lottery/components/DigitalBall';

import MultiplierSection from 'src/app/lottery/slip/sport/components/MultiplierSection';
import closeImg from 'src/assets/imgs/home/close.png';
import {DigitalTicket} from '../../../core';
import {ArrangedFivePlayEnum, ArrangedFiveSubPlayEnum} from '../../constants';

const RowSlipItem = ({
  item,
  ticketsMultiplier,
  setTicketsMultiplier,
  removeTicket,
  setMultiplierModal,
}: {
  item: DigitalTicket;
  ticketsMultiplier: Record<string, number>;
  setTicketsMultiplier: (multiplier: Record<string, number>) => void;
  removeTicket: (betId: string) => void;
  setMultiplierModal: (modal: {
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: any;
  }) => void;
}) => {
  const {betCount, betAmount} = item;
  const multiplier = ticketsMultiplier[item.betId] || 1;
  const DantuoItem = () => {
    return (
      <>
        <View className="flex-row flex-wrap">
          {item.positions.map((numbers, index) => (
            <View className="flex-row flex-wrap" key={index}>
              {numbers.map((number, index) => (
                <DigitalBall
                  key={index}
                  value={number}
                  color="red"
                  selected
                  size="medium"
                />
              ))}
            </View>
          ))}
        </View>
      </>
    );
  };

  return (
    <View className="bg-white p-4 rounded-xl mx-2 mt-4">
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
          {item.playMode === ArrangedFivePlayEnum.DirectPositioningDuplex
            ? '单式'
            : '复式'}
          [
          {item.subPlayMode === ArrangedFiveSubPlayEnum.PositioningDuplex
            ? '标准'
            : item.subPlayMode}
          ]{betCount}注 {multiplier}倍
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
