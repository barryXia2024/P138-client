import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

import DigitalBall from 'src/app/lottery/components/DigitalBall';

import MultiplierSection from 'src/app/lottery/slip/sport/components/MultiplierSection';
import closeImg from 'src/assets/imgs/home/close.png';

import {SuperLottoPlayEnum} from '../../../types';
import {SuperLottoTicket} from './SlipItem';

const RowSlipItem = ({
  item,
  ticketsMultiplier,
  setTicketsMultiplier,
  removeTicket,
  setMultiplierModal,
}: {
  item: SuperLottoTicket;
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
  const dantuo = () => {};
  const DantuoItem = () => {
    const oneDantuo = item.playMode == SuperLottoPlayEnum.DANTUO;

    if (oneDantuo) {
      // positions: [前区胆码, 前区拖码, 后区胆码, 后区拖码]
      const [redDan = [], redTuo = [], blueDan = [], blueTuo = []] =
        item.positions || [];

      return (
        <View>
          {/* 第一行：红色 胆 + 拖 */}
          <View className="flex-row flex-wrap">
         
            {redDan.map((number, index) => (
              <DigitalBall
                key={`rDan-${index}`}
                value={number}
                color="red"
                selected
                size="medium"
              />
            ))}
            {redTuo.length > 0 && (
              <DigitalBall
                key={-2}
                value="拖"
                color="red"
                selected
                size="medium"
              />
            )}
            {redTuo.map((number, index) => (
              <DigitalBall
                key={`rTuo-${index}`}
                value={number}
                color="red"
                selected
                size="medium"
              />
            ))}
          </View>

          {/* 第二行：蓝色 胆 + 拖 */}
          <View className="flex-row flex-wrap mt-1">
             
            {blueDan.map((number, index) => (
              <DigitalBall
                key={`bDan-${index}`}
                value={number}
                color="blue"
                selected
                size="medium"
              />
            ))}
            {blueTuo.length > 0 && (
              <DigitalBall
                key={-4}
                value="拖"
                color="blue"
                selected
                size="medium"
              />
            )}
            {blueTuo.map((number, index) => (
              <DigitalBall
                key={`bTuo-${index}`}
                value={number}
                color="blue"
                selected
                size="medium"
              />
            ))}
          </View>
        </View>
      );
    }
    return (
      <View className="flex-row flex-wrap">
        {item.positions.map((numbers, positionIndex) => (
          <View className="flex-row flex-wrap" key={positionIndex}>
            {numbers.map((number, index) => (
              <DigitalBall
                key={index}
                value={number}
                color={positionIndex > 0 ? 'blue' : 'red'}
                selected
                size="medium"
              />
            ))}
          </View>
        ))}
      </View>
    );
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
          {item.playMode}[{item.subPlayMode}]{betCount}注 {multiplier}倍
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
