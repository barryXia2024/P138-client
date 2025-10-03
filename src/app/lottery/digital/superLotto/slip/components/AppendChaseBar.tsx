import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {NativeCheckbox} from '@/p138-react-common/components/checkBox';
import {AppendFlagEnum} from 'src/app/lottery/digital/shared/types';

interface AppendChaseBarProps {
  append: AppendFlagEnum;
  onToggleAppend: () => void;
  chaseNumber: number;
  onOpenChase: () => void;
}

const SLAppendChaseBar: React.FC<AppendChaseBarProps> = ({
  append,
  onToggleAppend,
  chaseNumber,
  onOpenChase,
}) => {
  return (
    <View className="flex-row justify-center py-3 items-center bg-white ">
      <NativeCheckbox
        label="追加（最高可中1800万）"
        checked={append === AppendFlagEnum.Append}
        onCheckedChange={onToggleAppend}
        checkboxStyle={{padding:0,height:16,width:16}}
        labelStyle={{fontSize: 12}}
      />
      <TouchableOpacity onPress={onOpenChase}>
        <Text>
          追号<Text className="text-red-500 font-bold">{chaseNumber}</Text>期
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SLAppendChaseBar;


