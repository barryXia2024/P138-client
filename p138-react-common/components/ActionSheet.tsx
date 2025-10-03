import {Text, TouchableOpacity, View} from 'react-native';
import CustomModal from './CustomModal';
import React from 'react';
import {kScreenWidth} from '../utils/fuc/fc.rn';
import {FONT_SIZES} from '../utils/styles/theme';

export interface CustomModalProps<T extends string> {
  actionSheetTitle?: string;
  actionSheetData: Record<T, string>;
  isVisible: boolean;
  onClose: () => void;
  onSelect: (key: T) => void;
}

// 使用泛型参数 T
export const ActionSheetModal = <T extends string>({
  isVisible,
  actionSheetTitle,
  actionSheetData,
  onClose,
  onSelect,
}: CustomModalProps<T>) => (
  <CustomModal isVisible={isVisible} onClose={onClose} position="bottom">
    <View
      className="bg-[#f0f0f0] rounded-lg items-center overflow-hidden"
      style={{width: kScreenWidth}}>
      {actionSheetTitle && (
        <View className="p-10 bg-white  items-center justify-center h-[45px] w-full">
          <Text className="text-lg">{actionSheetTitle}</Text>
        </View>
      )}
      {Object.keys(actionSheetData).map(key => (
        <TouchableOpacity
          key={key}
          onPress={() => {
            onSelect(key as T); // 这里需要断言 key 为 T 类型
            onClose();
          }}
          className="bg-white  border-b border-gray-300 w-full items-center justify-center py-10"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
            height: 50,
          }}>
          <Text style={{fontSize: FONT_SIZES.medium}}>
            {actionSheetData[key as T]}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        className="bg-white py-6 px-5 w-full items-center justify-center mt-3"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
          height: 50,
          marginTop: 10,
        }}
        onPress={onClose}>
        <Text style={{fontSize: FONT_SIZES.medium}}>取消</Text>
      </TouchableOpacity>
    </View>
  </CustomModal>
);
