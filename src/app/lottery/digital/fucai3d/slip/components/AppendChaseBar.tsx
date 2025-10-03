import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
 
import {AppendFlagEnum} from 'src/app/lottery/digital/shared/types';

interface AppendChaseBarProps {
  append: AppendFlagEnum;
  onToggleAppend: () => void;
  chaseNumber: number;
  onOpenChase: () => void;
}

const SLAppendChaseBar: React.FC<AppendChaseBarProps> = ({
 
  chaseNumber,
  onOpenChase,
}) => {
  return (
    <View className="flex-row justify-center py-3 items-center bg-white ">
 
      <TouchableOpacity onPress={onOpenChase}>
        <Text>
          追号<Text className="text-red-500 font-bold">{chaseNumber}</Text>期
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SLAppendChaseBar;


