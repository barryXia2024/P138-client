import type { MessageItem, ConversationItem, ConnectionState } from "open-im-sdk-rn";

export interface SendMessageParams {
  recvID?: string;
  groupID?: string;
  message: MessageItem;
}

export interface HistoryParams {
  conversationID: string;
  count: number;
  startClientMsgID?: string | null;
}

export interface OpenIMAdapter {
  login(userId: string, token: string): Promise<void>;
  logout(): Promise<void>;
  getTotalUnreadMsgCount?: () => Promise<number>;

  createTextMessage: (content: string) => Promise<MessageItem>;
  createImageMessage: (imagePath: string, width?: number, height?: number) => Promise<MessageItem>;
  sendMessage: (params: SendMessageParams) => Promise<{ data: MessageItem }>;
  resendMessage?: (params: SendMessageParams) => Promise<{ data: MessageItem }>>;

  getHistoryMessages?: (params: HistoryParams) => Promise<MessageItem[]>;

  onRecvNewMessage?: (cb: (msg: MessageItem) => void) => () => void;
  onTotalUnreadMessageCountChanged?: (cb: (n: number) => void) => () => void;
  onConnectionStateChanged?: (cb: (s: ConnectionState) => void) => () => void;
  onConversationChanged?: (cb: (list: ConversationItem[]) => void) => () => void;
}
