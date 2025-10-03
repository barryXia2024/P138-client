import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

import MultiplierSection from 'src/app/lottery/digital/components/MultiplierSection';
import closeImg from 'src/assets/imgs/home/close.png';

import {SlipItemProps} from '../types';
import {AppendFlagEnum, SuperLottoPlayEnum} from '../../types';
import DigitalBall, {
  DigitalBallSize,
} from 'src/app/lottery/components/DigitalBall';

const SuperLottoSlipItem: React.FC<SlipItemProps> = ({
  ticket,
  append,
  ticketsMultiplier,
  setTicketsMultiplier,
  removeTicket,
  setMultiplierModal,
}) => {
  const multiplier = ticketsMultiplier[ticket.betId] || 1;
  const perBetAmount = append === AppendFlagEnum.Append ? 3 : 2;
  const totalAmount = perBetAmount * ticket.betCount * multiplier;

  const DantuoItem = () => (
    <>
      <View className="flex-row flex-wrap">
        {ticket.positions[0].map((v: string, index: number) => (
          <DigitalBall
            key={index}
            value={v}
            color="red"
            needZero
            selected
            size={DigitalBallSize.Medium}
          />
        ))}
        <DigitalBall
          key={'dan'}
          value={'拖'}
          color="red"
          selected
          size={DigitalBallSize.Medium}
        />
        {ticket.positions[1].map((v: string, index: number) => (
          <DigitalBall
            key={index}
            value={v}
            color="red"
            needZero
            selected
            size={DigitalBallSize.Medium}
          />
        ))}
      </View>
      <View className="flex-row flex-wrap">
        {ticket.positions[2].map((v: string, index: number) => (
          <DigitalBall
            key={index}
            value={v}
            color="blue"
            needZero
            selected
            size={DigitalBallSize.Medium}
          />
        ))}
        <DigitalBall
          key={'tuo'}
          value={'拖'}
          color="blue"
          selected
          size={DigitalBallSize.Medium}
        />
        {ticket.positions[3].map((v: string, index: number) => (
          <DigitalBall
            key={index}
            value={v}
            color="blue"
            needZero
            selected
            size={DigitalBallSize.Medium}
          />
        ))}
      </View>
    </>
  );

  const NormalItem = () => (
    <View className="flex-row flex-wrap">
      {ticket.positions.map((item, i) =>
        item.map((v: string, index: number) => (
          <DigitalBall
            key={index}
            value={v}
            color={i > 0 ? 'blue' : 'red'}
            selected
            needZero
            size={DigitalBallSize.Medium}
          />
        )),
      )}
    </View>
  );

  return (
    <View className="bg-white p-4 rounded-xl mx-2 mt-4">
      <TouchableOpacity
        className="absolute right-0 top-0 p-2 z-[9999]"
        activeOpacity={1}
        onPress={() => removeTicket(ticket.betId)}>
        <Image
          source={closeImg}
          className="w-8 h-8"
          resizeMode="contain"
          style={{width: 32, height: 32}}
        />
      </TouchableOpacity>

      {ticket.playMode === SuperLottoPlayEnum.NORMAL ? (
        <NormalItem />
      ) : (
        <DantuoItem />
      )}

      <View className="flex-row justify-between items-center">
        <Text className="text-lg">
          {(() => {
            // const {betPlay} = ticket.betCount
            // const label = betPlay ? `[${betPlay}]` : '';
            return `${''} ${ticket.betCount}注 ${multiplier}倍`;
          })()}
          <Text className="text-red-500 font-bold">{totalAmount}元</Text>
        </Text>
        <MultiplierSection
          title=""
          multiplier={multiplier}
          setMultiplier={value =>
            setTicketsMultiplier({...ticketsMultiplier, [ticket.betId]: value})
          }
          toggleMultiplierModal={() =>
            setMultiplierModal({
              isVisiable: true,
              value: multiplier,
              type: 'multiplier',
              ticket: ticket,
            })
          }
        />
      </View>
    </View>
  );
};

export default SuperLottoSlipItem;
