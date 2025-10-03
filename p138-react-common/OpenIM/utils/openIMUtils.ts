import type { ConversationItem } from "open-im-sdk-rn";

/** 会话排序：置顶优先 + 最新时间降序 */
export function conversationSort(a: ConversationItem, b: ConversationItem) {
  const aTop = Number(!!(a as any).isPinned || (a as any).isPinned === 1);
  const bTop = Number(!!(b as any).isPinned || (b as any).isPinned === 1);
  if (aTop !== bTop) return bTop - aTop;
  const aTime = (a as any).latestMsgSendTime || 0;
  const bTime = (b as any).latestMsgSendTime || 0;
  return bTime - aTime;
}

/** 增量更新 + 排序 */
export function updateConversationsIncremental(
  oldMap: Record<string, ConversationItem>,
  inc: ConversationItem[]
) {
  const map = { ...oldMap };
  for (const c of inc) {
    map[c.conversationID] = { ...(map[c.conversationID] || {}), ...c };
  }
  const list = Object.values(map).sort(conversationSort);
  const ids = list.map(c => c.conversationID);
  return { map, ids };
}
