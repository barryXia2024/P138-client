import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import deleteImg from 'src/assets/imgs/gendan/delete.png';
import {SuperLottoTicket} from '../../../core';

interface Props {
  ticket: SuperLottoTicket;
  onRemove: (betId: string) => void;
}

export const SuperLottoRenderer: React.FC<Props> = ({ticket, onRemove}) => {
  const formatNumbers = (numbers: number[]) => {
    return numbers.sort((a, b) => a - b).join(' ');
  };
  
  const getModeText = () => {
    if (ticket.mode === 'normal') {
      return ticket.betCount === 1 ? '单式' : '复式';
    }
    return '胆拖';
  };
  
  const getContentText = () => {
    if (ticket.mode === 'normal') {
      return `${formatNumbers(ticket.red)} | ${formatNumbers(ticket.blue)}`;
    }
    const redDan = formatNumbers(ticket.redDan);
    const redTuo = formatNumbers(ticket.redTuo);
    const blueDan = formatNumbers(ticket.blueDan);
    const blueTuo = formatNumbers(ticket.blueTuo);
    return `${redDan}*${redTuo} | ${blueDan}*${blueTuo}`;
  };
  
  return (
    <View className="bg-white p-4 mb-3 rounded-lg">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-black">大乐透</Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm text-gray-600">{getModeText()}</Text>
          <TouchableOpacity onPress={() => onRemove(ticket.betId)}>
            <Image
              source={deleteImg}
              className="w-5 h-5"
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text className="text-base text-gray-800 mb-2">{getContentText()}</Text>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-gray-600">
          共{ticket.betCount}注 {ticket.betAmount}元
        </Text>
      </View>
    </View>
  );
};
