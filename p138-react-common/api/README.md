# P138通用API框架

一个基于中间件的通用API请求框架，支持Web和React Native平台。

## 目录结构

```
api/
├── core/                    # 核心实现
│   ├── client.ts           # API客户端实现
│   └── middleware/         # 中间件
│       ├── error.ts        # 错误处理中间件
│       └── token.ts        # Token处理中间件
├── platforms/              # 平台特定实现
│   ├── web.ts             # Web平台实现
│   └── native.ts          # React Native平台实现
├── types/                  # 类型定义
│   └── index.d.ts         # 类型声明文件
└── index.ts               # 入口文件
```

## 核心功能

### 1. 中间件系统
- 错误处理中间件：统一处理HTTP错误和网络错误
- Token中间件：自动处理token的存储和请求头添加
- 支持自定义中间件：通过`use`方法添加新的中间件

### 2. 平台适配
- Web平台：使用`localStorage`存储，`alert`提示
- RN平台：使用`AsyncStorage`存储，`ToastAndroid`提示
- 每个平台可以自定义存储、提示和登出逻辑

### 3. 灵活的配置
- 可配置的请求超时
- 可自定义请求头
- 支持跳过错误处理
- 支持跳过token处理

## 类型定义

### 基础配置
```typescript
interface IBaseConfig {
  baseURL: string;
  timeout?: number;
  headers?: AxiosRequestHeaders;
}
```

### 平台配置
```typescript
interface IPlatformConfig extends IBaseConfig {
  storage: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
  };
  toast: {
    show: (message: string) => void;
    error: (message: string) => void;
    success: (message: string) => void;
  };
  logout: () => void;
}
```

### 请求配置
```typescript
interface IRequestProps<TQuery = Record<string, any>, TData = Record<string, any>> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  query?: TQuery;
  data?: TData;
  skipErrorHandler?: boolean;
  skipTokenHandler?: boolean;
}
```

### 中间件接口
```typescript
interface IMiddleware {
  name: string;
  onRequest?: (context: IMiddlewareContext) => Promise<void>;
  onResponse?: (context: IMiddlewareContext) => Promise<void>;
  onError?: (context: IMiddlewareContext) => Promise<void>;
}
```

## 使用说明

### 1. 创建API客户端
```typescript
// Web平台
const webClient = createWebApiClient({
  baseURL: 'https://api.example.com',
  timeout: 5000
});

// RN平台
const nativeClient = createNativeApiClient({
  baseURL: 'https://api.example.com',
  timeout: 5000
});
```

### 2. 发送请求
```typescript
const response = await client.request({
  method: 'POST',
  url: '/users',
  data: { name: 'John' }
});
```

### 3. 添加自定义中间件
```typescript
client.use({
  name: 'custom',
  onRequest: async (context) => {
    // 请求前处理
  },
  onResponse: async (context) => {
    // 响应后处理
  },
  onError: async (context) => {
    // 错误处理
  }
});
```

## 错误处理

框架会自动处理以下错误：
- 网络连接错误
- HTTP状态码错误（400、401、403、404、500等）
- 业务逻辑错误

## 注意事项

1. 平台特定实现
   - Web平台使用`localStorage`存储
   - RN平台使用`AsyncStorage`存储
   - 提示方式根据平台自动选择

2. Token处理
   - 自动从存储中获取token
   - 自动添加到请求头
   - 支持从响应头更新token

3. 中间件执行顺序
   - 请求前中间件按添加顺序执行
   - 响应后中间件按添加顺序执行
   - 错误处理中间件按添加顺序执行 