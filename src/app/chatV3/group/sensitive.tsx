/**
 * 敏感词设置（占位：本地保存/未来接后端）
 */

import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {useLocalSearchParams, router} from 'expo-router';
import {AppHeader} from '@/p138-react-common/components';
import {ToastService} from '@/p138-react-common/components/toast/ToastService';

const GroupSensitivePage: React.FC = () => {
  const {groupID} = useLocalSearchParams<{groupID: string}>();
  const [tags, setTags] = React.useState('');

  const handleSave = async () => {
    if (!groupID) return ToastService.show('群ID缺失');
    // TODO: 接后端接口；当前先本地提示
    ToastService.show('已保存敏感词（占位）');
    router.back();
  };

  return (
    <View className="flex-1 bg-[#f8f9fa]">
      <AppHeader title="敏感词标签" />
      <View className="m-4 p-4 bg-white rounded-lg">
        <Text className="text-[14px] text-gray-700 mb-2">敏感词（以逗号分隔）</Text>
        <TextInput
          className="border border-gray-200 rounded-md px-3 py-2"
          placeholder="如：广告,链接,污秽"
          value={tags}
          onChangeText={setTags}
          multiline
          numberOfLines={6}
        />
        <TouchableOpacity
          className="mt-4 px-4 py-3 bg-blue-500 rounded-md items-center"
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Text className="text-white">保存</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GroupSensitivePage;


