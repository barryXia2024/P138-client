import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import DigitalBall from 'src/app/lottery/components/DigitalBall';
import MultiplierSection from 'src/app/lottery/digital/components/MultiplierSection';
import closeImg from 'src/assets/imgs/home/close.png';
import {calculatorRegistry} from 'src/app/lottery/digital/calc';
import {SuperLottoTicket} from 'src/app/lottery/digital/core/types';

import { AppendFlagEnum } from '../../../shared/types';
import { SuperLottoPlayEnum } from '../../../shared/enums';

const SuperLottoSlipItem: React.FC<{
  item: SuperLottoTicket;
  append: AppendFlagEnum; // '1' 追加，'2' 不追加
  ticketsMultiplier: Record<string, number>;
  setTicketsMultiplier: (multiplier: Record<string, number>) => void;
  removeTicket: (betId: string) => void;
  setMultiplierModal: (modal: {
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: SuperLottoTicket;
  }) => void;
}> = ({
  item,
  append,
  ticketsMultiplier,
  setTicketsMultiplier,
  removeTicket,
  setMultiplierModal,
}) => {
  const {betCount} = calculatorRegistry[item.lotteryName](item);
  const multiplier = ticketsMultiplier[item.betId] || 1;
  const perBetAmount = append === AppendFlagEnum.Append ? 3 : 2;
  const totalAmount = perBetAmount * betCount * multiplier;

  const DantuoItem = () => (
    <>
      <View className="flex-row flex-wrap">
        {item.positions[0].map((v: number, index: number) => (
          <DigitalBall key={index} value={v} color="red" needZero selected size="medium" />
        ))}
        <DigitalBall key={'dan'} value={'拖'} color="red" selected size="medium" />
        {item.positions[1].map((v: number, index: number) => (
          <DigitalBall key={index} value={v} color="red" needZero selected size="medium" />
        ))}
      </View>
      <View className="flex-row flex-wrap">
        {item.positions[2].map((v: number, index: number) => (
          <DigitalBall key={index} value={v} color="blue" needZero selected size="medium" />
        ))}
        <DigitalBall key={'tuo'} value={'拖'} color="blue" selected size="medium" />
        {item.positions[3].map((v: number, index: number) => (
          <DigitalBall key={index} value={v} color="blue" needZero selected size="medium" />
        ))}
      </View>
    </>
  );

  const NormalItem = () => (
    <>
      <View className="flex-row flex-wrap">
        {item.positions[0].map((v: number, index: number) => (
          <DigitalBall key={index} value={v} color="red" selected needZero size="medium" />
        ))}
      </View>
      <View className="flex-row flex-wrap">
        {item.positions[1].map((v: number, index: number) => (
          <DigitalBall key={index} value={v} color="blue" selected needZero size="medium" />
        ))}
      </View>
    </>
  );

  return (
    <View className="bg-white p-4 rounded-xl mx-2 mt-4">
      <TouchableOpacity className="absolute right-0 top-0 p-2 z-[9999]" activeOpacity={1} onPress={() => removeTicket(item.betId)}>
        <Image source={closeImg} className="w-8 h-8" resizeMode="contain" style={{width: 32, height: 32}} />
      </TouchableOpacity>
 

      {item.playMode === SuperLottoPlayEnum.NORMAL ? (
        <NormalItem />
      ) : (
        <DantuoItem />
      )}

      <View className="flex-row justify-between items-center">
        <Text className="text-lg">
          {(() => {
            const {betPlay} = calculatorRegistry[item.lotteryName](item);
            const label = betPlay ? `[${betPlay}]` : '';
            return `${label} ${betCount}注 ${multiplier}倍`;
          })()}
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

export default SuperLottoSlipItem;


