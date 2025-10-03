# P138OpenIM 聊天库

一个基于 OpenIM SDK 的跨平台聊天库，支持 React Native 和 Web。

## 特性

- 🚀 **跨平台支持**: React Native (Expo) 和 Web
- 🎯 **类型安全**: 完整的 TypeScript 类型定义
- 🔄 **实时更新**: 消息、会话的实时同步
- 📱 **状态管理**: 基于 Zustand 的状态管理
- 🛠️ **适配器模式**: 统一接口，平台特定实现
- 🎨 **UI 无关**: 只提供数据和方法，UI 由项目自定义

## 安装

```bash
# 安装核心依赖
yarn add zustand

# RN 端额外依赖（可选）
yarn add open-im-sdk-rn @react-native-async-storage/async-storage expo-file-system

# Web 端额外依赖（可选）
yarn add @openim/client-sdk
```

> 注意：平台特定的依赖已设置为可选依赖，会根据运行环境自动选择相应的 SDK。

## 快速开始

### 1. 设置配置

```typescript
import { setConfig } from 'p138-react-common/OpenIM';

setConfig({
  apiUrl: 'http://your-server:10002',
  wsUrl: 'ws://your-server:10001',
  chatUrl: 'http://your-server:10008',
});
```

### 2. 登录

```typescript
import { P138OpenIM } from 'p138-react-common/OpenIM';

// 使用密码登录（推荐）- 会自动调用项目接口获取 token
await P138OpenIM.loginWithPassword({
  username: '15111111111',
  password: '123456',
});

// 或者使用已有的 token 直接登录
await P138OpenIM.autoLogin({
  userID: 'your-user-id',
  openIMToken: { token: 'your-im-token' },
}, {
  nickname: '用户昵称',
  faceURL: 'https://example.com/avatar.jpg',
});
```

### 3. 使用会话列表

```typescript
import { useConversationList } from 'p138-react-common/OpenIM';

function ConversationList() {
  const {
    conversations,
    connectionState,
    refreshing,
    error,
    refreshConversations,
  } = useConversationList({
    autoLogin: true,
    loginInfo: {
      userID: 'your-user-id',
      openIMToken: { token: 'your-token' },
    },
  });

  return (
    <div>
      <button onClick={refreshConversations} disabled={refreshing}>
        {refreshing ? '刷新中...' : '刷新会话'}
      </button>
      <div>连接状态: {connectionState}</div>
      {conversations.map(conv => (
        <div key={conv.id}>
          {conv.id} - {conv.unreadCount} 条未读
        </div>
      ))}
    </div>
  );
}
```

### 4. 发送消息

```typescript
import { useSendMessage } from 'p138-react-common/OpenIM';

function ChatInput({ conversationId }: { conversationId: string }) {
  const { sendTextMessage, sending, error } = useSendMessage({ conversationId });

  return (
    <div>
      {error && <div>错误: {error}</div>}
      <button 
        onClick={() => sendTextMessage('Hello!')}
        disabled={sending}
      >
        {sending ? '发送中...' : '发送消息'}
      </button>
    </div>
  );
}
```

## API 文档

### 核心方法

- `setConfig(config)` - 设置配置
- `P138OpenIM.loginWithPassword(params)` - 使用密码登录（推荐，会自动调用项目接口）
- `P138OpenIM.autoLogin(loginInfo, userInfo)` - 使用已有 token 登录
- `P138OpenIM.logout()` - 登出
- `P138OpenIM.getLoginStatus()` - 获取登录状态
- `P138OpenIM.isLoggedIn()` - 检查是否已登录

### 会话管理

- `P138OpenIM.getConversations()` - 获取会话列表
- `P138OpenIM.refreshConversations()` - 刷新会话列表
- `P138OpenIM.loadHistoryMessages(conversationId, count)` - 加载历史消息

### 消息管理

- `P138OpenIM.sendTextMessage(params)` - 发送文本消息
- `P138OpenIM.sendMessage(params)` - 发送消息（通用）
- `P138OpenIM.createTextMessage(content)` - 创建文本消息
- `P138OpenIM.getHistoryMessages(conversationId)` - 获取历史消息

### 用户管理

- `P138OpenIM.setSelfUserInfo(userInfo)` - 设置用户信息
- `P138OpenIM.getSelfUserInfo()` - 获取用户信息

### React Hooks

#### 基础状态 Hooks
- `useConversations()` - 会话列表状态
- `useMessages(conversationId)` - 消息列表状态
- `useConnectionState()` - 连接状态
- `useUnreadCount()` - 未读消息数
- `useSyncing()` - 同步状态
- `useConversationIniting()` - 会话初始化状态
- `useSelfInfo()` - 用户信息状态

#### 高级功能 Hooks
- `useConversationList(options)` - 会话列表管理（推荐）
- `useMessageList(conversationId)` - 消息列表管理
- `useSendMessage(options)` - 发送消息管理
- `useChatRoom(roomId)` - 聊天室管理
- `useConversationDisplay(conversationId)` - 会话显示信息

## 最佳实践

### 推荐的使用方式

```typescript
import { useConversationList, useSendMessage, P138OpenIM } from 'p138-react-common/OpenIM';

function ChatApp() {
  // 先进行登录
  useEffect(() => {
    P138OpenIM.loginWithPassword({
      username: '15111111111',
      password: '123456',
    });
  }, []);

  const { conversations } = useConversationList({
    autoLogin: false, // 已经手动登录，不需要自动登录
  });

  const { sendTextMessage } = useSendMessage({ 
    conversationId: 'current-conversation-id' 
  });

  return (
    <div>
      {conversations.map(conv => (
        <div key={conv.id}>{conv.id}</div>
      ))}
      <button onClick={() => sendTextMessage('Hello!')}>
        发送消息
      </button>
    </div>
  );
}
```

### 配置管理

```typescript
import { setConfig, getConfig } from 'p138-react-common/OpenIM';

// 设置配置
setConfig({
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:10002',
  wsUrl: process.env.REACT_APP_WS_URL || 'ws://localhost:10001',
  chatUrl: process.env.REACT_APP_CHAT_URL || 'http://localhost:10008',
  debug: process.env.NODE_ENV === 'development',
});

// 获取配置
const config = getConfig();
```

### 错误处理

```typescript
import { useConversationList } from 'p138-react-common/OpenIM';

function ConversationListWithErrorHandling() {
  const { conversations, error, clearError } = useConversationList({
    autoLogin: true,
    loginInfo: { /* ... */ },
  });

  useEffect(() => {
    if (error) {
      Toast.show(`错误: ${error}`);
    }
  }, [error]);

  return (
    <div>
      {error && (
        <div>
          <span>错误: {error}</span>
          <button onClick={clearError}>清除错误</button>
        </div>
      )}
      {/* ... */}
    </div>
  );
}
```

## 注意事项

1. **依赖管理**: 平台特定的依赖已设置为可选依赖，确保只安装需要的包
2. **状态管理**: 使用 Zustand 进行状态管理，确保状态更新的一致性
3. **类型安全**: 所有 API 都有完整的 TypeScript 类型定义
4. **错误处理**: 建议始终处理异步操作的错误情况
5. **性能优化**: 使用 React.memo 和 useMemo 优化组件性能
6. **平台适配**: 库会自动检测运行环境并选择相应的 SDK（RN 使用 open-im-sdk-rn，Web 使用 @openim/client-sdk）