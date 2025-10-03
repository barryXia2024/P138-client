/**
 * 聊天室页面主入口
 * 使用通用聊天组件
 */

import React, {useEffect} from 'react';
import {useLocalSearchParams} from 'expo-router';
import {AppHeader} from '@/p138-react-common/components';
import {ChatRoom} from '../components';
import {Text, TouchableOpacity} from 'react-native';
import {router} from 'expo-router';
import P138OpenIM, {useConversations} from '@/p138-react-common/OpenIM';
import {useUserStore} from 'src/store';

const ChatV3Room: React.FC = () => {
  const {id} = useLocalSearchParams<{id: string}>();
  const {shopInfo} = useUserStore();
  const isGroup = id?.startsWith('sg_');
  useEffect(() => {
    P138OpenIM.autoLogin();
  }, [id]);
  const conversation = useConversations().find(
    conversation => conversation.id === id,
  );

  useEffect(() => {
    
    if (conversation) {
      P138OpenIM.setCurrentConversation(id);

      P138OpenIM.markConversationAsRead(id);
    }
  }, []);

  return (
    <>
      <AppHeader
        title={
          isGroup
            ? conversation?.extras?.showName
            : shopInfo?.shopName + '（店主' + shopInfo?.shopCode + '）'
        }
        leftComponent={null}
        rightComponent={
          isGroup ? (
            <TouchableOpacity
              onPress={() => {
                if (id) {
                  router.push(`/chatV3/group/manage?id=${id}`);
                }
              }}>
              <Text className="text-white">管理</Text>
            </TouchableOpacity>
          ) : (
            <></>
          )
        }
      />
      <ChatRoom
        conversationId={id || ''}
        initialLoadCount={200}
        loadMoreCount={20}
        autoLoadHistory={true}
        autoHandleStatus={true}
        autoRefresh={false}
        showImageOption={true}
        showMoreOptions={true}
        placeholder="输入消息..."
        maxLength={1000}
        autoScrollToBottom={true}
      />
    </>
  );
};

export default ChatV3Room;
