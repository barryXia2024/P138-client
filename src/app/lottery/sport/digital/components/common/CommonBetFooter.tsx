import {Button} from '@/p138-react-common/components';
import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import deleteImg from 'src/assets/imgs/gendan/delete.png';

type Props = {
  summary: React.ReactNode;
  betCount: number;
  betAmount: number;
  canProceed: boolean;
  onClear: () => void;
  onNextStep: () => void;
};

const CommonBetFooter: React.FC<Props> = ({
  summary,
  betCount,
  betAmount,
  canProceed,
  onClear,
  onNextStep,
}) => {
  const handleNext = () => {
 
    onNextStep();
  };

  return (
    <View className="bg-white">
      <View>{summary}</View>
      <View className="flex-row items-center justify-between bg-white  p-3">
        <View className="flex-row gap-2">
          <TouchableOpacity className="center" onPress={onClear}>
            <Image
              className="w-8 h-8"
              source={deleteImg}
            />
          </TouchableOpacity>
          <View>
            <Text className="text-base font-bold text-black text-md">
              已选:<Text className="text-red-500">{betCount}</Text>注 共
              <Text className="text-red-500">{betAmount}</Text>元
            </Text>
          </View>
        </View>
        <Button
          title="下一步"
          type="primary"
          onPress={handleNext}
 
          size='small'
          style={{ padding:0,height:30,width:80}}
          textStyle={{fontSize: 14}}
        />
      </View>
    </View>
  );
};

export default CommonBetFooter;


