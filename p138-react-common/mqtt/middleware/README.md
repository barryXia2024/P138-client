# MQTT 中间件系统

## 概述

MQTT 中间件系统提供了可扩展的消息处理机制，支持消息去重、日志记录等功能。

## 中间件列表

### 1. 消息去重中间件 (messageDeduplicationMiddleware)

**功能**: 防止重复消息推送
- 基于消息ID进行去重
- 内存缓存 + 本地存储双重机制
- 自动清理过期消息ID
- 支持多种消息ID字段格式
- 高性能缓存查找（O(1)时间复杂度）

**支持的消息ID字段**:
- `messageId`
- `message_id` 
- `id`
- `data.messageId`
- `data.message_id`
- `data.id`

### 2. 日志记录中间件 (traceLogMiddleware)

**功能**: 记录MQTT消息的收发日志
- 区分接收和发送消息
- 记录主题和载荷信息
- 支持自定义日志键

## 使用方法

### 基本使用

中间件会自动应用到所有MQTT消息，无需额外配置。

### 启动消息清理服务

```typescript
import { messageCleanupService } from 'p138-react-common/mqtt/middleware';

// 在应用启动时启动清理服务
// 参数1: 清理间隔（毫秒），默认1小时
// 参数2: 消息ID最大保存时间（毫秒），默认24小时
messageCleanupService.start(60 * 60 * 1000, 24 * 60 * 60 * 1000);

// 在应用关闭时停止清理服务
messageCleanupService.stop();
```

### 手动清理

```typescript
// 手动触发清理
await messageCleanupService.manualCleanup(24 * 60 * 60 * 1000);
```

### 缓存管理

```typescript
import { getCacheStats, clearCache, cleanupExpiredMessageIds } from 'p138-react-common/mqtt/middleware';

// 获取详细缓存统计信息
const stats = getCacheStats();
console.log('缓存统计:', {
  缓存大小: stats.size,
  是否已加载: stats.loaded,
  最旧消息年龄: `${Math.round(stats.oldestAge / 1000 / 60)}分钟`,
  最新消息年龄: `${Math.round(stats.newestAge / 1000 / 60)}分钟`,
  平均年龄: `${Math.round(stats.averageAge / 1000 / 60)}分钟`
});

// 手动清空缓存
clearCache();

// 手动清理过期消息
await cleanupExpiredMessageIds(24 * 60 * 60 * 1000);
```

## 配置说明

### 消息去重配置

- **存储键**: `mqtt_message_ids`
- **最大存储数量**: 1000个消息ID
- **自动清理**: 超过限制时自动清理一半旧消息ID
- **过期清理**: 支持基于时间的过期清理

### 存储适配

系统自动适配不同平台的存储方式：
- **Web**: 使用 localStorage
- **React Native**: 使用 AsyncStorage

## 错误处理

- 中间件执行错误不会中断消息处理链
- 存储操作失败时继续处理消息
- 所有错误都会记录到控制台

## 性能考虑

- **内存缓存**: 消息ID使用Map数据结构，查找效率O(1)，支持时间戳
- **双重检查**: 先检查缓存，缓存未命中再检查本地存储
- **异步存储**: 存储操作异步执行，不阻塞消息处理
- **智能加载**: 缓存按需加载，避免启动时阻塞
- **精确清理**: 基于时间戳的精确过期清理
- **批量操作**: 支持批量添加和清理操作
- **详细统计**: 提供缓存年龄和性能统计 