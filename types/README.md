# react-native-paho-mqtt TypeScript 类型定义

这个目录包含了为 `react-native-paho-mqtt` 库生成的 TypeScript 类型定义文件。

## 文件说明

- `react-native-paho-mqtt.d.ts` - 主要的类型定义文件
- `README.md` - 本说明文件

## 安装

1. 确保已经安装了 `react-native-paho-mqtt`：
   ```bash
   yarn add react-native-paho-mqtt
   ```

2. 类型定义文件已经包含在项目中，TypeScript 会自动识别。

## 使用方法

### 基本用法

```typescript
import { Client, Message } from 'react-native-paho-mqtt';

// 创建客户端
const client = new Client({
  uri: 'ws://your-mqtt-server:8080/mqtt',
  clientId: 'your-client-id',
  storage: {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
    removeItem: (key: string) => localStorage.removeItem(key)
  }
});

// 连接
await client.connect({
  userName: 'username',
  password: 'password',
  timeout: 30000,
  keepAliveInterval: 60,
  cleanSession: true,
  mqttVersion: 4
});

// 订阅主题
await client.subscribe('test/topic', {
  qos: 1,
  timeout: 30000
});

// 发布消息
client.send('test/topic', 'Hello MQTT!', 1, false);

// 监听消息
client.on('messageReceived', (message: Message) => {
  console.log('收到消息:', message.payloadString);
  console.log('主题:', message.destinationName);
  console.log('QoS:', message.qos);
});

// 断开连接
await client.disconnect();
```

### 使用 Message 对象

```typescript
import { Message } from 'react-native-paho-mqtt';

const message = new Message('Hello from Message object!');
message.destinationName = 'test/topic';
message.qos = 1;
message.retained = false;

client.send(message);
```

### 事件监听

```typescript
// 连接丢失事件
client.on('connectionLost', (error: any) => {
  console.error('连接丢失:', error);
});

// 消息接收事件
client.on('messageReceived', (message: Message) => {
  console.log('收到消息:', message.payloadString);
});

// 消息发送成功事件
client.on('messageDelivered', (message: Message) => {
  console.log('消息发送成功:', message.payloadString);
});
```

## API 参考

### Client 类

#### 构造函数
```typescript
constructor(options: ConstructorOptions)
```

#### 方法
- `connect(options?: ConnectOptions): Promise<void>` - 连接到 MQTT 服务器
- `subscribe(filter: string, options?: SubscribeOptions): Promise<void>` - 订阅主题
- `unsubscribe(filter: string, options?: UnsubscribeOptions): Promise<void>` - 取消订阅
- `send(topic: Message): void` - 发送消息（使用 Message 对象）
- `send(topic: string, payload: string, qos?: 0 | 1 | 2, retained?: boolean): void` - 发送消息（使用参数）
- `disconnect(): Promise<void>` - 断开连接
- `isConnected(): boolean` - 检查连接状态
- `getTraceLog(): any[]` - 获取追踪日志
- `startTrace(): void` - 开始追踪
- `stopTrace(): void` - 停止追踪

#### 属性
- `uri: string` - 客户端 URI（只读）
- `clientId: string | null` - 客户端 ID（只读）
- `trace: ((...args: any[]) => void) | null` - 追踪函数

### Message 类

#### 构造函数
```typescript
constructor(newPayload: string | Uint8Array)
```

#### 属性
- `payloadString: string` - 消息内容（字符串，只读）
- `payloadBytes: Uint8Array` - 消息内容（字节数组，只读）
- `destinationName: string` - 目标主题名称
- `qos: 0 | 1 | 2` - 服务质量
- `retained: boolean` - 是否保留消息
- `duplicate: boolean` - 是否为重复消息（只读）

## 注意事项

1. 这个类型定义基于 `react-native-paho-mqtt` 版本 0.1.1
2. 类型定义包含了完整的 API 覆盖，包括所有公共方法和属性
3. 事件处理使用了 EventEmitter 的标准模式
4. 所有异步方法都返回 Promise
5. 支持 TypeScript 的严格类型检查

## 故障排除

如果遇到类型错误，请检查：

1. TypeScript 配置中的 `typeRoots` 是否包含了 `./types` 目录
2. 是否正确导入了类型定义
3. 是否使用了正确的参数类型

## 版本信息

- 类型定义版本: 1.0.0
- 对应的库版本: react-native-paho-mqtt@0.1.1
- 创建日期: 2024年 