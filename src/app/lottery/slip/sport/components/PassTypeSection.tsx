import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  SportLotteryType,
  SportLotteryTypeEnum,
} from 'src/modules/lottery/constants';
import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';
import {useSlipStore} from '../../store/slipStore';
import { ArrowIcon, Button } from '@/p138-react-common/components';

const PassTypeSection: React.FC = () => {
  const {selectedPassTypes} = useBetInfoStore();
  const {lotteryInfo} = useLotteryInfoStore();
  const {togglePassTypeModal} = useSlipStore();

  const isSportLottery = SportLotteryType[lotteryInfo?.lotteryName as keyof typeof SportLotteryType] === SportLotteryTypeEnum.Sport;

  if (!isSportLottery) {
    return null;
  }

  return (
    <View style={styles.passTypeContainer}>
      {selectedPassTypes.map(t => (
        <TouchableOpacity
          key={t}
          onPress={togglePassTypeModal}
          style={styles.passTypeButton}>
          <Text style={styles.passTypeText}>
            {t} <Text>↓</Text>
          </Text>
  
        </TouchableOpacity>
      ))}
     <Button title="更多" type='primary' onPress={togglePassTypeModal}/>
    </View>
  );
};

const styles = StyleSheet.create({
  passTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    // maxWidth: '80%',
 
  },
  passTypeButton: {
    width: 55,
    height: 42,
 
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  passTypeText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 28,
  },
});

export default PassTypeSection; 