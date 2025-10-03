/**
 * 会话项组件类型定义
 */

import {type Conversation} from '@/p138-react-common/OpenIM';
import type {ConversationDisplayInfo} from '@/p138-react-common/OpenIM/base/types/hooks';

export interface BaseConversationItemProps {
  conversation: Conversation;
  displayInfo: ConversationDisplayInfo;
  onPress: () => void;
}

export interface SingleChatItemProps extends BaseConversationItemProps {
  // 单聊特有的属性可以在这里添加
}

export interface GroupChatItemProps extends BaseConversationItemProps {
  // 群聊特有的属性可以在这里添加
}

export type ConversationType = 'single' | 'group';
