import React from 'react';
import {View, Text} from 'react-native';
import Button from '@/p138-react-common/components/Button';
import {StatusBarProps} from '../../types';

export const StatusBar: React.FC<StatusBarProps> = ({
  betCount,
  betAmount,
  onContact,
  onNext,
}) => {
  return (
    <View className="bg-white border-t border-gray-200 px-4 py-3">
      {/* 左侧清空按钮 */}
      <Button
        title="🗑️"
        type="text"
        onPress={() => {}}
        className="absolute left-4 top-3 w-10 h-10 p-0"
        size="small"
      />
      
      {/* 中间状态信息 */}
      <View className="items-center mb-4 mt-5">
        <Text className="text-base font-bold text-red-500">
          已选: {betCount}注 共{betAmount}元
        </Text>
      </View>
      
 
      
      {/* 底部下一步按钮 */}
      <Button
        title="下一步"
        type="primary"
        onPress={onNext}
        className="bg-red-500 mt-2 py-4 rounded-lg"
        block
        size="large"
      />
    </View>
  );
};
