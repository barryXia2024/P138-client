// 通用工具函数（对齐 DEMO）
import { Conversation } from '../core/entities';

export const feedbackToast = ({ msg, error }: { msg?: string; error?: any }) => {
  const message = msg || (typeof error === 'string' ? error : '操作失败');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (typeof Toast !== 'undefined') {
    Toast.show(message);
  } else {
    console.error('Toast:', message, error);
  }
};

// 会话排序（对齐 DEMO 的 conversationSort）
export const conversationSort = (conversations: Conversation[]): Conversation[] => {
  return [...conversations].sort((a, b) => {
    // 置顶优先
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    // 按最后更新时间倒序
    return b.updatedAt - a.updatedAt;
  });
};

// 判断是否群聊（对齐 DEMO 的 isGroupSession）
export const isGroupSession = (type: string | number): boolean => {
  // DEMO 中：SessionType.Group = 2, SessionType.WorkingGroup = 3
  return type === 'group' || type === 2 || type === 3;
};

// 生成操作ID（对齐 DEMO 的 uuidv4）
export const generateOperationID = (): string => {
  return `op_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

// 时间格式化
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (msgDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
  
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
};
