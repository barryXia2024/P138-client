/**
 * 使用示例：如何在业务代码中使用重构后的 useConversationList
 */

import React from 'react';
import { useConversationList, getConfig, type LoginInfo, type UserInfo } from 'p138-react-common/OpenIM';

// 示例1：使用默认配置
export function ConversationListExample1() {
  const loginInfo: LoginInfo = {
    userID: 'your-user-id',
    openIMToken: {
      token: 'your-openim-token',
    },
  };

  const userInfo: UserInfo = {
    nickname: '用户昵称',
    faceURL: 'https://example.com/avatar.jpg',
  };

  const {
    conversations,
    connectionState,
    refreshing,
    error,
    refreshConversations,
    clearError,
  } = useConversationList({
    autoLogin: true,
    loginInfo,
    userInfo,
  });

  return (
    <div>
      <h2>会话列表</h2>
      {error && (
        <div style={{ color: 'red' }}>
          {error}
          <button onClick={clearError}>清除错误</button>
        </div>
      )}
      <button onClick={refreshConversations} disabled={refreshing}>
        {refreshing ? '刷新中...' : '刷新会话'}
      </button>
      <div>连接状态: {connectionState}</div>
      <ul>
        {conversations.map(conversation => (
          <li key={conversation.id}>
            {conversation.id} - {conversation.unreadCount} 条未读
          </li>
        ))}
      </ul>
    </div>
  );
}

// 示例2：使用自定义配置
export function ConversationListExample2() {
  const loginInfo: LoginInfo = {
    userID: 'your-user-id',
    openIMToken: {
      token: 'your-openim-token',
    },
  };

  const {
    conversations,
    connectionState,
    refreshing,
    error,
    refreshConversations,
    clearError,
  } = useConversationList({
    autoLogin: true,
    loginInfo,
    config: {
      apiUrl: 'https://your-api-server.com',
      wsUrl: 'wss://your-ws-server.com',
      chatUrl: 'https://your-chat-server.com',
      debug: true, // 开发环境开启调试
    },
  });

  return (
    <div>
      <h2>会话列表（自定义配置）</h2>
      {error && (
        <div style={{ color: 'red' }}>
          {error}
          <button onClick={clearError}>清除错误</button>
        </div>
      )}
      <button onClick={refreshConversations} disabled={refreshing}>
        {refreshing ? '刷新中...' : '刷新会话'}
      </button>
      <div>连接状态: {connectionState}</div>
      <ul>
        {conversations.map(conversation => (
          <li key={conversation.id}>
            {conversation.id} - {conversation.unreadCount} 条未读
          </li>
        ))}
      </ul>
    </div>
  );
}

// 示例3：使用环境变量配置
export function ConversationListExample3() {
  const loginInfo: LoginInfo = {
    userID: process.env.REACT_APP_USER_ID || '',
    openIMToken: {
      token: process.env.REACT_APP_OPENIM_TOKEN || '',
    },
  };

  // 使用 getConfig 获取配置，支持环境变量覆盖
  const config = getConfig({
    debug: process.env.NODE_ENV === 'development',
  });

  const {
    conversations,
    connectionState,
    refreshing,
    error,
    refreshConversations,
    clearError,
  } = useConversationList({
    autoLogin: true,
    loginInfo,
    config,
  });

  return (
    <div>
      <h2>会话列表（环境变量配置）</h2>
      {error && (
        <div style={{ color: 'red' }}>
          {error}
          <button onClick={clearError}>清除错误</button>
        </div>
      )}
      <button onClick={refreshConversations} disabled={refreshing}>
        {refreshing ? '刷新中...' : '刷新会话'}
      </button>
      <div>连接状态: {connectionState}</div>
      <ul>
        {conversations.map(conversation => (
          <li key={conversation.id}>
            {conversation.id} - {conversation.unreadCount} 条未读
          </li>
        ))}
      </ul>
    </div>
  );
}
