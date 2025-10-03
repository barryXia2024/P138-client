/**
 * MessageItem 相关类型定义
 */

import type {WrappedMessage} from '@/p138-react-common/OpenIM/base/types/core';

export interface MessageItemProps {
  message: WrappedMessage;
}

export interface BaseMessageProps {
  message: WrappedMessage;
  isCurrentUser: boolean;
}

export interface ImageMessageProps extends BaseMessageProps {
  showPreview?: boolean;
  showStatus?: boolean;
}

export interface TextMessageProps extends BaseMessageProps {
  // 文本消息特有属性
}

export interface VoiceMessageProps extends BaseMessageProps {
  // 语音消息特有属性
}

export interface VideoMessageProps extends BaseMessageProps {
  // 视频消息特有属性
}

export interface FileMessageProps extends BaseMessageProps {
  // 文件消息特有属性
}
