import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LOTTERY_CONFIG} from '../constants';
import { betPlayColorBlue } from '@/p138-react-common/utils/styles/color';

interface LeftComponentProps {
  handicapDto: LotteryDataSource.HandicapDto;
  lotteryName: string;
}

const LeftComponent: React.FC<LeftComponentProps> = ({
  handicapDto,
  lotteryName,
}) => {
  const config = LOTTERY_CONFIG[lotteryName as keyof typeof LOTTERY_CONFIG];
  if (!config) return null;

  if (lotteryName === 'FootballLottery') {
    const backgroundColor =
      config.colorMap[
        handicapDto.playChineseName! as keyof typeof config.colorMap
      ];

    return (
      <View className='flex-row h-full'>
        <View style={[styles.leftComponentContainer, {backgroundColor}]}>
          {handicapDto.playChineseName!.split('').map((char, index) => (
            <Text key={index} style={styles.verticalText}>
              {char}
            </Text>
          ))}
        </View>
        {/* <View>
          <Text style={{height:42*3,lineHeight:42,backgroundColor:betPlayColorBlue}}>胜</Text>
          <Text style={{height:42,lineHeight:42}}>平</Text>
          <Text style={{height:42,lineHeight:50}}>负</Text>
        </View> */}
      </View>
    );
  }

  if (lotteryName === 'BeijingSingleMatch') {
    return (
      <View style={styles.leftComponentContainer}>
        {config.buttons?.map((button, index) => (
          <Text
            key={index}
            style={[
              button.style === 'small'
                ? styles.verticalButtonSmall
                : styles.verticalButton,
              {backgroundColor: button.color},
            ]}>
            {button.text}
          </Text>
        ))}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  leftComponentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalText: {
    writingDirection: 'rtl',
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
    width: 30,
  },
  verticalButton: {
    height: 80,
    lineHeight: 80,
    color: 'white',
    width: 35,
    textAlign: 'center',
  },
  verticalButtonSmall: {
    height: 40,
    lineHeight: 40,
    color: 'white',
    width: 35,
    textAlign: 'center',
  },
});

export default LeftComponent;
