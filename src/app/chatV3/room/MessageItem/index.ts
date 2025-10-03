/**
 * MessageItem 组件导出
 */

export {default} from './MessageItem';
export {default as MessageItem} from './MessageItem';

// 导出用户消息组件
export {CurrentUserMessage, OtherUserMessage} from './components';

// 导出消息类型组件
export * from './messages';

// 导出类型
export type {
  MessageItemProps,
  BaseMessageProps,
  ImageMessageProps,
  TextMessageProps,
  VoiceMessageProps,
  VideoMessageProps,
  FileMessageProps,
} from './types';