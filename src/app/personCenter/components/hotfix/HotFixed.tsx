import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import { useHotUpdate } from './useHotfiex';
 

const HotFixed: React.FC = () => {
    const { message } = useHotUpdate();
  return (
    <View className="bg-white p-4 rounded-lg mx-2 mb-2">
      <Text className="text-md">{message}</Text>
    </View>
  );
};

export default HotFixed;
