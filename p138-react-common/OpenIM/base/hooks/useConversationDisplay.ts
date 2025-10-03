import {useCallback} from 'react';
import {
  ConversationType,
  MessageType,
  type Conversation,
  type ConversationDisplayInfo,
  type UseConversationDisplayOptions,
} from '../types';

/**
 * 会话显示管理 Hook
 * 
 * @param options 配置选项
 * @returns 会话显示相关的方法
 */
export function useConversationDisplay(
  options: UseConversationDisplayOptions = {},
) {
  const {formatTime} = options;

  /**
   * 默认时间格式化函数
   */
  const defaultFormatTime = (timestamp: number): string => {
    const now = new Date();
    const target = new Date(timestamp);

    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    // 今天：HH:mm
    if (isSameDay(now, target)) {
      return target.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }

    // 昨天：昨天 HH:mm
    if (isSameDay(yesterday, target)) {
      const time = target.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      return `昨天 ${time}`;
    }

    // 其他：MM/dd（如 09/21）
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const dd = String(target.getDate()).padStart(2, '0');
    return `${mm}/${dd}`;
  };

  const timeFormatter = formatTime || defaultFormatTime;

  /**
   * 获取会话显示信息
   */
  const getDisplayInfo = useCallback((conversation: Conversation): ConversationDisplayInfo => {
    const isGroup = conversation.type === ConversationType.Group;
    const extras = (conversation.extras as any) || {};

    let title: string;
    let avatar: string;

    if (isGroup) {
      title =
        extras.showName ||
        extras.groupName ||
        `群聊 ${conversation.id.slice(-8)}`;
      avatar = extras.faceURL || extras.groupAvatar || '';
    } else {
      const otherUserId = conversation.participants[0];
      title =
        extras.showName ||
        extras.nickname ||
        `用户 ${otherUserId?.slice(-8) || ''}`;
      avatar = extras.faceURL || extras.participantAvatar || '';
    }

    return {
      title,
      avatar,
      lastMessageContent: getLastMessageContent(conversation),
      lastMessageTime: conversation.lastMessage
        ? timeFormatter(conversation.lastMessage.timestamp)
        : '',
      unreadCount: conversation.unreadCount,
      isPinned: conversation.isPinned,
      isMuted: conversation.isMuted,
    };
  }, [timeFormatter]);

  /**
   * 获取最后消息内容
   */
  const getLastMessageContent = useCallback((conversation: Conversation): string => {
    if (!conversation.lastMessage) return '暂无消息';

    const {content, type} = conversation.lastMessage;
    
    switch (type) {
      case MessageType.Text:
        return content;
      case MessageType.Image:
        return '[图片]';
      case MessageType.Audio:
        return '[语音]';
      case MessageType.Video:
        return '[视频]';
      case MessageType.File:
        return '[文件]';
      case MessageType.System:
        return '[系统消息]';
      default:
        return '[消息]';
    }
  }, []);

  /**
   * 批量获取会话显示信息
   */
  const getBatchDisplayInfo = useCallback((conversations: Conversation[]): ConversationDisplayInfo[] => {
    return conversations.map(getDisplayInfo);
  }, [getDisplayInfo]);

  /**
   * 过滤会话（按类型、状态等）
   */
  const filterConversations = useCallback((
    conversations: Conversation[],
    filters: {
      type?: ConversationType;
      hasUnread?: boolean;
      isPinned?: boolean;
      isMuted?: boolean;
    } = {},
  ): Conversation[] => {
    return conversations.filter(conversation => {
      if (filters.type && conversation.type !== filters.type) {
        return false;
      }
      if (filters.hasUnread !== undefined) {
        const hasUnread = conversation.unreadCount > 0;
        if (hasUnread !== filters.hasUnread) {
          return false;
        }
      }
      if (filters.isPinned !== undefined && conversation.isPinned !== filters.isPinned) {
        return false;
      }
      if (filters.isMuted !== undefined && conversation.isMuted !== filters.isMuted) {
        return false;
      }
      return true;
    });
  }, []);

  /**
   * 排序会话（按时间、未读数等）
   */
  const sortConversations = useCallback((
    conversations: Conversation[],
    sortBy: 'time' | 'unread' | 'pinned' = 'time',
  ): Conversation[] => {
    return [...conversations].sort((a, b) => {
      switch (sortBy) {
        case 'pinned':
          // 置顶的排在前面
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          // 置顶状态相同时按时间排序
          return (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0);
        case 'unread':
          // 未读数多的排在前面
          return b.unreadCount - a.unreadCount;
        case 'time':
        default:
          // 按最后消息时间排序
          return (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0);
      }
    });
  }, []);

  return {
    getDisplayInfo,
    getLastMessageContent,
    getBatchDisplayInfo,
    filterConversations,
    sortConversations,
  };
}
