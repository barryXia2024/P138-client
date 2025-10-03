import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {NativeCheckbox} from '@/p138-react-common/components/checkBox';
 

interface AppendChaseBarProps {
  append: boolean;
  onToggleAppend: () => void;
  chaseNumber: number;
  onOpenChase: () => void;
  showAppend?: boolean;
}

const AppendChaseBar: React.FC<AppendChaseBarProps> = ({
  append,
  onToggleAppend,
  chaseNumber,
  onOpenChase,
  showAppend,
}) => {
  return (
    <View className="flex-row justify-center py-3 items-center bg-white ">
      {showAppend && (
        <NativeCheckbox
          label="追加（最高可中1800万）"
          checked={append}
          onCheckedChange={onToggleAppend}
          checkboxStyle={{padding: 0, height: 16, width: 16}}
          labelStyle={{fontSize: 12}}
        />
      )}
      <TouchableOpacity onPress={onOpenChase}>
        <Text>
          追号<Text className="text-red-500 font-bold">{chaseNumber}</Text>期
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppendChaseBar;
