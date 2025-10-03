// Web 端占位实现：请按你的 Web SDK 名称替换
// 这里提供一个最小可编译的 stub（抛错提示你实现）
import type { OpenIMAdapter, SendMessageParams, HistoryParams } from "./index";
import type { MessageItem, ConversationItem, ConnectionState } from "open-im-sdk-rn";

function notImpl(name: string): any {
  return () => { throw new Error(`[openim/web] ${name} 未实现，请在 adapter/index.web.ts 中对接 Web SDK`); };
}

export const openIMAdapter: OpenIMAdapter = {
  login: notImpl("login"),
  logout: notImpl("logout"),
  getTotalUnreadMsgCount: notImpl("getTotalUnreadMsgCount"),

  createTextMessage: notImpl("createTextMessage"),
  createImageMessage: notImpl("createImageMessage"),
  sendMessage: notImpl("sendMessage"),
  resendMessage: notImpl("resendMessage"),
  getHistoryMessages: notImpl("getHistoryMessages"),

  onRecvNewMessage: notImpl("onRecvNewMessage"),
  onTotalUnreadMessageCountChanged: notImpl("onTotalUnreadMessageCountChanged"),
  onConnectionStateChanged: notImpl("onConnectionStateChanged"),
  onConversationChanged: notImpl("onConversationChanged"),
};
