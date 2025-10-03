import React from 'react';
import {View, Text} from 'react-native';
import {Button} from '@/p138-react-common/components';

interface SummaryBarProps {
  isSave?: boolean;
  ticketsCount: number;
  totalAmount: number;
  chaseNumber: number;
  onSave?: () => void;
  onConfirm: () => void;
}

const SummaryBar: React.FC<SummaryBarProps> = ({
  isSave,
  ticketsCount,
  totalAmount,
  chaseNumber,
  onSave,
  onConfirm,
}) => {
  return (
    <View className="flex-row justify-between border-t border-gray-300 p-4 bg-white">
      {!isSave && onSave && (
        <View>
          <Button
            title="保存"
            className="border-red-500 border"
            textStyle={{color: 'red', fontSize: 16, fontWeight: 'bold'}}
            size="small"
            onPress={onSave}
          />
        </View>
      )}

      <View className=" items-center justify-center">
        <Text>
          <Text className="text-md text-red-500 font-bold">{totalAmount}</Text>
          元
        </Text>
        <Text>
          <Text className="  text-red-500  ">{ticketsCount}</Text>注{' '}
          <Text className="  text-red-500  ">{chaseNumber}</Text>期
        </Text>
      </View>
      <Button
        title="确认投注"
        type="primary"
        onPress={onConfirm}
        textStyle={{  fontWeight: 'bold'}}
        size="small"
        style={{ padding:0,height:35,width:80}}
    
      />
    </View>
  );
};

export default SummaryBar;
