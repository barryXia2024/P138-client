/**
 * P138OpenIM 聊天库
 * 主入口文件
 */

import {
  useConversations,
  useMessages,
  useConnectionState,
  useUnreadCount,
  useSyncing,
  useConversationIniting,
  useSelfInfo,
} from './base/core/P138OpenIM';
import P138OpenIMCore from './base/core/P138OpenIMCore';

// 导出配置相关
export {
  getConfig,
  defaultConfig,
  setConfig,
  getChatUrl,
  getApiUrl,
  getWsUrl,
} from './base/config';
export type {OpenIMConfig, LoginInfo, UserInfo} from './base/config';

// 导出新的业务逻辑 hooks
export {useOpenIMManager} from './base/hooks/useOpenIMManager';
export {useConversationDisplay} from './base/hooks/useConversationDisplay';
export {useChatRoom} from './base/hooks/useChatRoom';
export {useSendMessage} from './base/hooks/useSendMessage';
export {useMessageList} from './base/hooks/useMessageList';
export {useMessageParser} from './base/hooks/useMessageParser';
export {
  useUserInfo,
  useUsersInfo,
  clearUserInfoCache,
  getCachedUserInfo,
} from './base/hooks/useUserInfo';

const P138OpenIM = new P138OpenIMCore();
// 导出类型
export type {
  P138OpenIMConfig,
  LoginParams,
  LoginResult,
  User,
  MessageType,
  MessageStatus,
  SendMessageParams,
  Conversation,
  Group,
  GroupParams,
  ConnectionState,
  P138OpenIMEvents,
  IIMAdapter,
} from './base/types';

// 导出库内部的工具函数
export {
  conversationSort,
  feedbackToast,
  formatTime,
  isGroupSession,
  getConversationContent,
  formatConversionTime,
} from './base/utils/openIMUtils';

export {
  getConversationType,
  getConversationIdFromMessage,
  getConversationIDByMsg,
  extractIdFromConversationId,
} from './base/utils/conversationUtils';

// 创建单例实例

// 导出主要接口
export {
  P138OpenIM,
  // React Hooks
  useConversations,
  useMessages,
  useConnectionState,
  useUnreadCount,
  useSyncing,
  useConversationIniting,
  useSelfInfo,
};
export default P138OpenIM;

/**
 * 使用示例:
 *
 * ```typescript
 * import P138OpenIM, { useGlobalEvents } from 'P138OpenIM';
 *
 * // 1. 初始化
 * P138OpenIM.init({
 *   apiUrl: 'http://your-server:10002',
 *   wsUrl: 'ws://your-server:10001',
 *   chatUrl: 'http://your-server:10008',
 * });
 *
 * // 2. 在组件中使用
 * function ChatApp() {
 *   useGlobalEvents(); // 启用事件监听
 *
 *   const conversations = P138OpenIM.useConversations();
 *   const connectionState = P138OpenIM.useConnectionState();
 *
 *   const handleLogin = async () => {
 *     await P138OpenIM.login({
 *       username: '15111111111',
 *       password: 'md5_password_hash',
 *     });
 *   };
 *
 *   const handleSendMessage = async () => {
 *     await P138OpenIM.sendTextMessage({
 *       conversationId: 'conv_123',
 *       content: 'Hello!',
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleLogin}>登录</button>
 *       <div>连接状态: {connectionState}</div>
 *       <div>会话数量: {conversations.length}</div>
 *       <button onClick={handleSendMessage}>发送消息</button>
 *     </div>
 *   );
 * }
 * ```
 */
