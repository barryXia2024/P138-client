# OpenIM 配置管理

## 概述

OpenIM 库现在支持灵活的配置管理，包括服务器地址、登录信息等。所有配置都可以通过参数传入，支持环境变量覆盖。

## 配置文件

### 默认配置

```typescript
// p138-react-common/OpenIM/src/config/index.ts
export const defaultConfig: OpenIMConfig = {
  apiUrl: process.env.REACT_APP_OPENIM_API_URL || 'http://47.107.143.93:10002',
  wsUrl: process.env.REACT_APP_OPENIM_WS_URL || 'ws://47.107.143.93:10001',
  chatUrl: process.env.REACT_APP_OPENIM_CHAT_URL || 'http://47.107.143.93:10008',
  debug: process.env.NODE_ENV === 'development',
};
```

### 环境变量支持

你可以通过环境变量来覆盖默认配置：

```bash
# .env
REACT_APP_OPENIM_API_URL=https://your-api-server.com
REACT_APP_OPENIM_WS_URL=wss://your-ws-server.com
REACT_APP_OPENIM_CHAT_URL=https://your-chat-server.com
```

## 使用方法

### 1. 基本使用（使用默认配置）

```typescript
import { useConversationList, type LoginInfo } from 'p138-react-common/OpenIM';

function MyComponent() {
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
  } = useConversationList({
    autoLogin: true,
    loginInfo,
  });

  return (
    <div>
      {/* 你的 UI 组件 */}
    </div>
  );
}
```

### 2. 自定义配置

```typescript
import { useConversationList, type LoginInfo } from 'p138-react-common/OpenIM';

function MyComponent() {
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
      {/* 你的 UI 组件 */}
    </div>
  );
}
```

### 3. 使用 getConfig 函数

```typescript
import { useConversationList, getConfig, type LoginInfo } from 'p138-react-common/OpenIM';

function MyComponent() {
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
  } = useConversationList({
    autoLogin: true,
    loginInfo,
    config,
  });

  return (
    <div>
      {/* 你的 UI 组件 */}
    </div>
  );
}
```

## 类型定义

### OpenIMConfig

```typescript
export interface OpenIMConfig {
  /** API 服务器地址 */
  apiUrl: string;
  /** WebSocket 服务器地址 */
  wsUrl: string;
  /** 聊天服务器地址 */
  chatUrl: string;
  /** 是否开启调试模式 */
  debug?: boolean;
}
```

### LoginInfo

```typescript
export interface LoginInfo {
  /** 用户ID */
  userID: string;
  /** OpenIM Token */
  openIMToken: {
    token: string;
  };
}
```

### UserInfo

```typescript
export interface UserInfo {
  /** 用户昵称 */
  nickname?: string;
  /** 用户头像 */
  faceURL?: string;
}
```

## 迁移指南

### 从旧版本迁移

如果你之前使用的是硬编码的配置，现在需要：

1. **移除硬编码的配置**：
   ```typescript
   // 旧版本
   const { conversations } = useConversationList({
     debug: true, // 硬编码
   });

   // 新版本
   const { conversations } = useConversationList({
     config: {
       debug: true, // 通过参数传入
     },
   });
   ```

2. **传入登录信息**：
   ```typescript
   // 新版本
   const loginInfo: LoginInfo = {
     userID: 'your-user-id',
     openIMToken: {
       token: 'your-openim-token',
     },
   };

   const { conversations } = useConversationList({
     loginInfo,
   });
   ```

3. **使用环境变量**：
   ```bash
   # .env
   REACT_APP_OPENIM_API_URL=https://your-api-server.com
   REACT_APP_OPENIM_WS_URL=wss://your-ws-server.com
   REACT_APP_OPENIM_CHAT_URL=https://your-chat-server.com
   ```

## 最佳实践

1. **使用环境变量**：将敏感信息（如服务器地址）放在环境变量中
2. **类型安全**：使用 TypeScript 类型定义确保类型安全
3. **配置分离**：将配置逻辑从业务逻辑中分离
4. **错误处理**：始终处理登录和连接错误
5. **调试模式**：在开发环境中启用调试模式，生产环境中关闭

## 示例项目

查看 `src/examples/useConversationListExample.tsx` 获取完整的使用示例。
