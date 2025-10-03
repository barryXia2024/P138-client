import { create } from "zustand";
import type { ConversationItem, ConnectionState, MessageItem } from "open-im-sdk-rn";
import { updateConversationsIncremental } from "./utils/openIMUtils";

export type LocalMessage = MessageItem & { status?: "pending" | "sent" | "failed" };

interface IMState {
  conversations: Record<string, ConversationItem>;
  conversationIds: string[];
  connectionState: ConnectionState;
  setConnectionState: (s: ConnectionState) => void;
  upsertConversation: (c: ConversationItem) => void;
  upsertConversations: (list: ConversationItem[]) => void;
  removeConversation: (id: string) => void;
  getTotalUnread: () => number;
  reset: () => void;
}

export const useIMStore = create<IMState>((set, get) => ({
  conversations: {},
  conversationIds: [],
  connectionState: "disconnected" as ConnectionState,

  setConnectionState: (s) => set({ connectionState: s }),

  upsertConversation: (c) =>
    set((state) => {
      const { map, ids } = updateConversationsIncremental(state.conversations, [c]);
      return { conversations: map, conversationIds: ids };
    }),

  upsertConversations: (list) =>
    set((state) => {
      const { map, ids } = updateConversationsIncremental(state.conversations, list);
      return { conversations: map, conversationIds: ids };
    }),

  removeConversation: (id) =>
    set((state) => {
      const map = { ...state.conversations };
      delete map[id];
      const ids = Object.keys(map);
      return { conversations: map, conversationIds: ids };
    }),

  getTotalUnread: () => {
    const { conversations } = get();
    return Object.values(conversations).reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);
  },

  reset: () => set({ conversations: {}, conversationIds: [], connectionState: "disconnected" }),
}));

interface MessageState {
  messages: Record<string, LocalMessage[]>;
  appendMessage: (cid: string, msg: LocalMessage) => void;
  prependMessages: (cid: string, msgs: LocalMessage[]) => void;
  updateMessageStatus: (cid: string, clientMsgID: string, status: "sent" | "failed") => void;
  reset: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: {},

  appendMessage: (cid, msg) =>
    set((state) => {
      const list = state.messages[cid] || [];
      const exists = list.some((m) => m.clientMsgID === (msg as any).clientMsgID);
      if (exists) return { messages: state.messages };
      return { messages: { ...state.messages, [cid]: [...list, msg] } };
    }),

  prependMessages: (cid, msgs) =>
    set((state) => {
      const existing = state.messages[cid] || [];
      const seen = new Set(existing.map((m) => m.clientMsgID));
      const merged = [...msgs.filter(m => !seen.has(m.clientMsgID)), ...existing];
      return { messages: { ...state.messages, [cid]: merged } };
    }),

  updateMessageStatus: (cid, clientMsgID, status) =>
    set((state) => {
      const list = state.messages[cid] || [];
      const updated = list.map((m) => (m.clientMsgID === clientMsgID ? { ...m, status } : m));
      return { messages: { ...state.messages, [cid]: updated } };
    }),

  reset: () => set({ messages: {} }),
}));
