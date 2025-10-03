/**
 * 群管理页面
 */

import React from 'react';
import {View, Text, TouchableOpacity, FlatList, Switch} from 'react-native';
import {useLocalSearchParams, router} from 'expo-router';
import {AppHeader} from '@/p138-react-common/components';
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import {DEFAULT_IMAGE} from '@/p138-react-common/config';
import {P138OpenIM} from '@/p138-react-common/OpenIM';
import {ToastService} from '@/p138-react-common/components/toast/ToastService';

interface MemberItem { userID: string; faceURL?: string; nickname?: string; }

// 类型辅助
type AnyRecord = Record<string, unknown>;
const isRecord = (v: unknown): v is AnyRecord => v !== null && typeof v === 'object';
const pickString = (v: unknown, key: string): string | undefined =>
  isRecord(v) && typeof v[key as keyof AnyRecord] === 'string'
    ? (v[key as keyof AnyRecord] as string)
    : undefined;
const pickNumber = (v: unknown, key: string): number | undefined =>
  isRecord(v) && typeof v[key as keyof AnyRecord] === 'number'
    ? (v[key as keyof AnyRecord] as number)
    : undefined;

const GroupManagePage: React.FC = () => {
  const {id} = useLocalSearchParams<{id: string}>();
  const [groupID, setGroupID] = React.useState<string>('');

  const [members, setMembers] = React.useState<MemberItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [muteAll, setMuteAll] = React.useState(false);
  const [noDisturb, setNoDisturb] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [groupName, setGroupName] = React.useState('');
  const [announcement, setAnnouncement] = React.useState('');
  const [expandMembers, setExpandMembers] = React.useState(false);

  const resolveGroupID = React.useCallback(async () => {
    const raw = String(id || '');
    if (!raw) return '';
    // 直接规则解析
    if (raw.startsWith('sg_')) return raw.slice(3);
    if (raw.startsWith('group_')) return raw.slice(6);
    // 从会话扩展解析（OpenIM）
    try {
      const conv = await P138OpenIM.getGroupConversation(raw);
      const extras = conv.extras;
      const fromExtras =  extras?.groupID
      return String(fromExtras || raw);
    } catch {
      return raw;
    }
  }, [id]);

  const loadMembers = React.useCallback(async () => {
    if (!groupID) return;
    try {
      setLoading(true);
      const list = await P138OpenIM.getGroupMemberList(groupID);
      setMembers(list);
    } catch (e) {
      ToastService.show('加载群成员失败');
    } finally {
      setLoading(false);
    }
  }, [groupID]);

  React.useEffect(() => {
    resolveGroupID().then(gid => {
      setGroupID(gid);
    });
  }, [resolveGroupID]);

  React.useEffect(() => {
    loadMembers();
  }, [groupID, loadMembers]);

  // 查询权限：是否管理员（从成员列表判断 owner 或者管理员）
  React.useEffect(() => {
    (async () => {
      if (!groupID) return;
      try {
        const list = await P138OpenIM.getGroupMemberList(groupID);
        const self = await P138OpenIM.getSelfUserInfo();
        const selfID =self.userID;
        const mine = (list || []).find(m => m.userID === selfID);
        console.log('mine', mine);
        const roleLevel = pickNumber(mine, 'roleLevel'); // 1:owner 2:admin
        setIsAdmin(roleLevel === 100 || roleLevel === 2);
      } catch {}
    })();
  }, [groupID]);

  // 加载群名称/公告（从会话扩展里尽可能取）
  React.useEffect(() => {
    (async () => {
      if (!groupID) return;
      try {
        const conv = await P138OpenIM.getGroupConversation(groupID);
        const extras = isRecord(conv) && isRecord(conv.extras) ? (conv.extras as AnyRecord) : {};
        const info = isRecord(extras.groupInfo) ? (extras.groupInfo as AnyRecord) : (extras as AnyRecord);
        setGroupName(pickString(info, 'showName') || pickString(info, 'groupName') || pickString(info, 'groupID') || '');
        setAnnouncement(pickString(info, 'notification') || pickString(info, 'introduction') || '');
      } catch {}
    })();
  }, [groupID]);

  // 成员数据（尾部追加添加/移除功能按钮）
  const memberGrid = React.useMemo(() => {
    return [
      ...members,
      {userID: '__action_add__', nickname: '添加', faceURL: ''},
      {userID: '__action_remove__', nickname: '移除', faceURL: ''},
    ];
  }, [members]);

  return (
    <View className="flex-1 bg-[#f8f9fa]">
      <AppHeader title="管理群组" />

      {/* 成员网格（含添加/移除） */}
      <View className="bg-white">
        <FlatList
          data={expandMembers ? memberGrid : memberGrid.slice(0, 10)}
          keyExtractor={item => item.userID}
          numColumns={5}
          refreshing={loading}
          onRefresh={loadMembers}
          scrollEnabled={expandMembers}
          style={expandMembers ? undefined : {height: 190}}
          contentContainerStyle={{paddingHorizontal: 12}}
          renderItem={({item}) => (
            <View className="w-1/5 items-center my-3">
              {item.userID === '__action_add__' ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="w-12 h-12 rounded-full bg-white items-center justify-center border border-gray-200"
                  onPress={() => ToastService.show('暂未实现：添加成员')}>
                  <Text className="text-[20px] text-gray-500">＋</Text>
                </TouchableOpacity>
              ) : item.userID === '__action_remove__' ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="w-12 h-12 rounded-full bg-white items-center justify-center border border-gray-200"
                  onPress={() => ToastService.show('暂未实现：移除成员')}>
                  <Text className="text-[20px] text-gray-500">－</Text>
                </TouchableOpacity>
              ) : (
                <OSSImage
                  source={{uri: item.faceURL || DEFAULT_IMAGE}}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <Text className="text-xs text-gray-600 mt-1" numberOfLines={1}>
                {item.nickname ||
                  (item.userID.startsWith('__action_') ? '' : '匿名')}
              </Text>
            </View>
          )}
          ListFooterComponent={<View className="h-4" />}
        />
      </View>

      {/* 查看更多/收起 */}
      {memberGrid.length > 10 && (
        <TouchableOpacity
          className="mx-4 mb-2 py-3 rounded-md bg-white items-center justify-center border border-gray-100"
          activeOpacity={0.8}
          onPress={() => setExpandMembers(v => !v)}>
          <Text className="text-[14px] text-gray-700">
            {expandMembers ? '收起' : '查看更多群成员'}
          </Text>
        </TouchableOpacity>
      )}

      {/* 功能区 */}
      <View className="mt-2 bg-white">
        {/* 群聊名称 */}
        {isAdmin ? (
          <TouchableOpacity
            activeOpacity={0.8}
            className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100"
            onPress={() => router.push(`/chatV3/group/rename?id=${id}&groupID=${groupID}`)}>
            <Text className="text-[16px] text-gray-800">群聊名称</Text>
            <Text className="text-[14px] text-gray-500">去设置 ＞</Text>
          </TouchableOpacity>
        ) : (
          <View className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100">
            <Text className="text-[16px] text-gray-800">群聊名称</Text>
            <Text className="text-[14px] text-gray-700" numberOfLines={1}>{groupName || '—'}</Text>
          </View>
        )}

        {/* 群公告 */}
        {isAdmin ? (
          <TouchableOpacity
            activeOpacity={0.8}
            className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100"
            onPress={() => router.push(`/chatV3/group/notice?id=${id}&groupID=${groupID}`)}>
            <Text className="text-[16px] text-gray-800">群公告</Text>
            <Text className="text-[14px] text-gray-500">去编辑 ＞</Text>
          </TouchableOpacity>
        ) : (
          <View className="px-4 py-4 border-b border-gray-100">
            <Text className="text-[16px] text-gray-800 mb-2">群公告</Text>
            <Text className="text-[14px] text-gray-700">{announcement || '—'}</Text>
          </View>
        )}

        {/* 敏感词标签 */}
        {isAdmin ? (
          <TouchableOpacity
            activeOpacity={0.8}
            className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100"
            onPress={() => router.push(`/chatV3/group/sensitive?id=${id}&groupID=${groupID}`)}>
            <Text className="text-[16px] text-gray-800">敏感词标签</Text>
            <Text className="text-[14px] text-gray-500">未设置 ＞</Text>
          </TouchableOpacity>
        ) : null}

        {/* 发言等级 */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100"
          onPress={() => ToastService.show('暂未实现：设置发言等级')}>
          <Text className="text-[16px] text-gray-800">发言等级</Text>
          <Text className="text-[14px] text-gray-500">VIP等级0 ＞</Text>
        </TouchableOpacity>

        {/* 全员禁言 */}
        {isAdmin ? (
          <View className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100">
            <Text className="text-[16px] text-gray-800">全员禁言</Text>
            <Switch
              value={muteAll}
              onValueChange={v => {
                setMuteAll(v);
                if (!groupID) return ToastService.show('群ID缺失');
                P138OpenIM.setGroupMuteAll(groupID, v)
                  .then(() => ToastService.show(v ? '已开启全员禁言' : '已关闭全员禁言'))
                  .catch(() => ToastService.show('设置失败'));
              }}
            />
          </View>
        ) : null}

        {/* 群消息免打扰 */}
        <View className="px-4 py-4 flex-row items-center justify-between">
          <Text className="text-[16px] text-gray-800">群消息免打扰</Text>
          <Switch
            value={noDisturb}
            onValueChange={v => {
              setNoDisturb(v);
              if (!id) return ToastService.show('会话ID缺失');
              P138OpenIM.setConversationDoNotDisturb(String(id), v)
                .then(() => ToastService.show(v ? '已开启免打扰' : '已关闭免打扰'))
                .catch(() => ToastService.show('设置失败'));
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default GroupManagePage;
