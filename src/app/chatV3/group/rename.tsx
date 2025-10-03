/**
 * 群聊名称设置
 */

import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {useLocalSearchParams, router} from 'expo-router';
import {AppHeader} from '@/p138-react-common/components';
import {ToastService} from '@/p138-react-common/components/toast/ToastService';
import {P138OpenIM} from '@/p138-react-common/OpenIM';

const GroupRenamePage: React.FC = () => {
  const {groupID} = useLocalSearchParams<{groupID: string}>();
  const [name, setName] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    if (!groupID) return ToastService.show('群ID缺失');
    if (!name.trim()) return ToastService.show('请输入群聊名称');
    try {
      setSaving(true);
      await P138OpenIM.updateGroupName(String(groupID), name.trim());
      ToastService.show('已更新群聊名称');
      router.back();
    } catch {
      ToastService.show('更新失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-[#f8f9fa]">
      <AppHeader title="群聊名称" />
      <View className="m-4 p-4 bg-white rounded-lg">
        <Text className="text-[14px] text-gray-700 mb-2">新的群聊名称</Text>
        <TextInput
          className="border border-gray-200 rounded-md px-3 py-2"
          placeholder="请输入"
          value={name}
          onChangeText={setName}
          maxLength={30}
        />
        <TouchableOpacity
          className="mt-4 px-4 py-3 bg-blue-500 rounded-md items-center"
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={saving}
        >
          <Text className="text-white">保存</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GroupRenamePage;




