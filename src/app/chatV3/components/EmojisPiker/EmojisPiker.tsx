import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Pressable } from 'react-native';
import type { EmojisPikerProps } from './types';
import emojisData from './emojis.json';

const DEFAULT_COLUMNS = 8;

const keyExtractor = (item: string, index: number) => `${item}-${index}`;

const EmojisPiker: React.FC<EmojisPikerProps> = ({ visible, onClose, onSelect, columns }) => {
  const data = React.useMemo<string[]>(() => {
    if (Array.isArray(emojisData)) return emojisData as string[];
    // 兼容对象结构 { emojis: string[] }
    const arr = (emojisData as any)?.emojis;
    return Array.isArray(arr) ? arr : [];
  }, []);

  const numColumns = columns || DEFAULT_COLUMNS;

  const renderItem = React.useCallback(({ item }: { item: string }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onSelect(item)}
        style={{ width: `${100 / numColumns}%` as unknown as number }}
      >
        <View className="items-center justify-center py-2">
          <Text style={{ fontSize: 24 }}>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  }, [numColumns, onSelect]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose}>
        <View className="mt-auto bg-white rounded-t-2xl overflow-hidden">
          <View className="px-4 py-3 border-b border-gray-100 flex-row items-center justify-between">
            <Text className="text-base text-gray-800">选择表情</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text className="text-base text-gray-500">关闭</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={data}
            keyExtractor={keyExtractor}
            numColumns={numColumns}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 12, paddingTop: 8 }}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

export default EmojisPiker;


