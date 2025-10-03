import React from 'react';
import {View, TouchableOpacity, ScrollView, Image, Text} from 'react-native';
import {useCreateOrderStore} from '../store/createOrderStore';
import {IMAGE_SIZE} from '@/p138-react-common/utils/styles/theme';

export const DeclarationTags = () => {
  const {tagList, selectedTag, setSelectedTag, setDeclaration} =
    useCreateOrderStore();

  return (
    <View className="flex-1 ">
      <ScrollView nestedScrollEnabled>
        <View className="flex-row flex-wrap mt-2">
          {tagList.map((tag, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedTag(tag);
                setDeclaration(tag.value);
              }}
              className="flex-row justify-center items-center"
              style={{
                backgroundColor: selectedTag?.id === tag.id ? 'red' : '#f2f2f2',
                paddingVertical: 6,
                borderRadius: 20,
                marginBottom: 8,
                width: '24%', // 4个一行
                marginRight: (index + 1) % 4 === 0 ? 0 : '1.33%', // 每行最后一个不加右间距
              }}>
              {tag.version === 3 && (
                <Image
                  source={
                    selectedTag?.id === tag.id
                      ? require('src/assets/imgs/follow/hot.png')
                      : require('src/assets/imgs/follow/hot1.png')
                  }
                  style={IMAGE_SIZE.IMAGE_SIZE16}
                />
              )}
              <Text
                style={{
                  color: selectedTag?.id === tag.id ? '#fff' : '#000',
                }}>
                {tag.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
