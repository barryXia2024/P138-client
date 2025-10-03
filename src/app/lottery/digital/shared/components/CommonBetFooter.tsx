import {Button} from '@/p138-react-common/components';
import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import deleteImg from 'src/assets/imgs/gendan/delete.png';

type CommonBetFooterProps = {
  summary: React.ReactNode;
  betCount: number;
  betAmount: number;
  canProceed: boolean;
  onClear: () => void;
  onNextStep: () => void;
};

const CommonBetFooter: React.FC<CommonBetFooterProps> = ({
  summary,
  betCount,
  betAmount,
  canProceed,
  onClear,
  onNextStep,
}) => {
  const handleNext = () => {
    if (!canProceed) return;
    onNextStep();
  };

  return (
    <View className="bg-white">
      <View>{summary}</View>
      <View className="flex-row items-center justify-between bg-white border-t border-ccc p-3">
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
          size='small'
          onPress={handleNext}
          disabled={!canProceed}
        />
      </View>
    </View>
  );
};

export default CommonBetFooter;
