/**
 * 会话列表页面主入口
 */

import React, { useEffect } from 'react';
import {View, StyleSheet} from 'react-native';
import {AppHeader} from '@/p138-react-common/components';
import {useUserStore} from 'src/store';
import {
  useConversations,
  useSyncing,
  useConversationIniting,
  useConversationDisplay,
  Conversation,
  P138OpenIM,
} from '@/p138-react-common/OpenIM';
 
import { router } from 'expo-router';

const useBusinessHook = () => {

    const {loginInfo, userInfo} = useUserStore();

  // 使用 P138OpenIM 的全局状态
  const conversations = useConversations();
  const syncing = useSyncing();
  const conversationIniting = useConversationIniting();



  // 自动登录
  useEffect(() => {
    if (loginInfo?.openIMToken) {
      P138OpenIM.autoLogin(
        {
          userID: loginInfo.userID,
          openIMToken: {
            token: loginInfo.openIMToken.token,
          },
        },
        userInfo,
      );
      handleRefresh()
    }
  }, [loginInfo, userInfo]);

  // 使用会话显示管理 hook
  const {getDisplayInfo, sortConversations} = useConversationDisplay({
    selfUserId: loginInfo?.userID,
  });

  // 处理会话点击
  const handleConversationPress = async (conversation: Conversation) => {
    try {
      // 先标记已读并本地清零未读，提升 UI 响应
      await P138OpenIM.markConversationAsRead?.(conversation.id);
    } catch {}

    // 使用动态导入避免循环依赖
     
      router.push(`/chatV3/room?id=${conversation.id}`);
  
  };

  // 处理刷新
  const handleRefresh = async () => {
    await P138OpenIM.refreshConversations();
  };

  // 过滤和排序会话
  const processedConversations = React.useMemo(() => {
    let filtered = conversations;

    // 过滤掉与客服的会话
    if (loginInfo?.customerServiceIDS && loginInfo.customerServiceIDS.length > 0) {
      console.log('客服ID列表:', loginInfo.customerServiceIDS);
      console.log('过滤前会话数量:', conversations.length);
      
      filtered = conversations.filter(conversation => {
        // 检查会话ID是否包含客服ID
        const isCustomerServiceConversation = loginInfo.customerServiceIDS!.some(serviceId => {
          // 检查会话ID是否包含客服ID（单聊格式：si_user1_user2）
          return conversation.id.includes(serviceId);
        });
        
        if (isCustomerServiceConversation) {
          console.log('过滤掉客服会话:', conversation.id);
        }
        
        // 返回 false 表示过滤掉（不显示），返回 true 表示保留
        return !isCustomerServiceConversation;
      });
      
      console.log('过滤后会话数量:', filtered.length);
    }

    // 排序：置顶的在前，然后按时间排序
    return sortConversations(filtered, 'pinned');
  }, [conversations, sortConversations, loginInfo?.customerServiceIDS]);
  console.log('processedConversations', processedConversations);
    return {
        processedConversations,
        handleConversationPress,
        handleRefresh,
        getDisplayInfo,
        sortConversations,
        syncing,
        conversationIniting,
    }
}

export default useBusinessHook;