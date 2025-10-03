/**
 * 会话列表页面主入口
 */

import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {AppHeader} from '@/p138-react-common/components';

import ConversationList from './ConversationList';
import EmptyState from './EmptyState';
 
import useCustomerHook from './hooks/useCustomerHook';

const ChatV3List: React.FC = () => {
  const {
    processedConversations,
    handleConversationPress,
    handleRefresh,
    getDisplayInfo,
    syncing,
    conversationIniting,
  } = useCustomerHook();

  return (
    <View style={styles.container}>
      <AppHeader title="聊天" leftComponent={<></>} />

      <ConversationList
        conversations={processedConversations}
        loading={conversationIniting || syncing}
        onConversationPress={handleConversationPress}
        onRefresh={handleRefresh}
        getDisplayInfo={getDisplayInfo}
        renderEmpty={() => (
          <EmptyState
            loading={conversationIniting || syncing}
            onRefresh={handleRefresh}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default ChatV3List;
