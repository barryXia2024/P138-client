# OpenIM SDK 方法兼容性对照表

## ✅ 核心功能（两端都支持）

| 功能 | RN SDK | Web SDK | 参数类型 |
|------|---------|---------|----------|
| 初始化 | `initSDK(InitOptions, string)` | 自动初始化 | InitOptions |
| 登录 | `login(LoginParams, string)` | `login(LoginParams)` | LoginParams |
| 登出 | `logout(string)` | `logout()` | - |
| 获取登录状态 | `getLoginStatus(string)` | `getLoginStatus()` | - |

## ✅ 会话管理（两端都支持）

| 功能 | RN SDK | Web SDK | 参数类型 |
|------|---------|---------|----------|
| 获取会话列表 | `getConversationListSplit(SplitConversationParams, string)` | `getConversationListSplit(OffsetParams)` | OffsetParams |
| 获取单个会话 | `getOneConversation(GetOneConversationParams, string)` | `getOneConversation(GetOneConversationParams)` | GetOneConversationParams |
| 标记已读 | `markConversationMessageAsRead(string, string)` | `markConversationMessageAsRead(string)` | string |
| 获取未读数 | `getTotalUnreadMsgCount(string)` | `getTotalUnreadMsgCount()` | - |

## ✅ 消息管理（两端都支持）

| 功能 | RN SDK | Web SDK | 参数类型 |
|------|---------|---------|----------|
| 创建文本消息 | `createTextMessage(string, string)` | `createTextMessage(string)` | string |
| 发送消息 | `sendMessage(SendMsgParams, string)` | `sendMessage(SendMsgParams)` | SendMsgParams |
| 获取历史消息 | `getAdvancedHistoryMessageList(GetAdvancedHistoryMsgParams, string)` | `getAdvancedHistoryMessageList(GetAdvancedHistoryMsgParams)` | GetAdvancedHistoryMsgParams |
| 撤回消息 | `revokeMessage(OpreateMessageParams, string)` | `revokeMessage(OpreateMessageParams)` | OpreateMessageParams |

## ⚠️ 好友管理（参数差异）

| 功能 | RN SDK | Web SDK | 备注 |
|------|---------|---------|------|
| 获取好友申请 | `getFriendApplicationListAsRecipient(string)` | `getFriendApplicationListAsRecipient(OffsetParams)` | Web需要分页参数 |
| 接受好友申请 | `acceptFriendApplication(AccessFriendParams, string)` | `acceptFriendApplication(AccessFriendParams)` | 类型一致 |

## ❌ 方法不存在或差异较大

| 功能 | RN SDK | Web SDK | 解决方案 |
|------|---------|---------|----------|
| 强制重连 | `forceReconnect(string)` | `forceReconnect()` | ✅ 都支持 |
| 添加黑名单 | `addBlack(string, string)` | `addBlack(AddBlackParams)` | ❌ 参数类型不同 |

## 修正建议

1. **统一参数处理**：Web SDK 大多需要对象参数，RN SDK 有些是直接字符串
2. **分页参数**：Web SDK 的列表方法需要 OffsetParams
3. **操作ID**：RN SDK 需要手动传 operationID，Web SDK 自动生成
4. **返回值**：Web SDK 返回 ApiResponse 包装，RN SDK 直接返回数据
