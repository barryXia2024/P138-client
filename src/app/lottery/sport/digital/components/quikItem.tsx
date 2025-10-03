import React from 'react';
import {View, Text, TouchableOpacity, ImageBackground} from 'react-native';
import xuanzhong from 'src/assets/imgs/follow/xuanzhong.webp';

type QuickItemData = { label: string; count?: number };
const QuickItem = ({item, selected, onPress}: {item: QuickItemData; selected?: boolean; onPress?: (item: QuickItemData) => void}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress?.(item);
      }}
    >
      {selected ? (
        <ImageBackground
          source={xuanzhong}
          style={{
            width: '100%',
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          resizeMode="stretch">
          <Text className="text-black text-center font-bold text-md">{item?.label}</Text>
        </ImageBackground>
      ) : (
        <View
          className="justify-center items-center bg-white border border-gray-300  "
          style={{
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text className="text-black text-center font-bold text-md">
            {item?.label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default QuickItem;
