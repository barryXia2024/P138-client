import OpenIMSDKRN, { MessageItem } from "open-im-sdk-rn";
import RNFS from "react-native-fs";
import { opid } from "../utils/opid";
import type { OpenIMAdapter, SendMessageParams, HistoryParams } from "./index";

/** 文件存在校验（zip 同款） */
async function safeFileExists(path: string): Promise<boolean> {
  try { return await RNFS.exists(path); } catch { return false; }
}

/** 规范化本地图片路径（去 file://，不存在则回退） */
async function normalizeLocalImagePath(imagePath: string): Promise<string> {
  let processed = imagePath;
  if (processed.startsWith("file://")) processed = processed.slice(7);
  if (!(await safeFileExists(processed))) return imagePath;
  return processed;
}

export const openIMAdapter: OpenIMAdapter = {
  // 登录 / 登出（统一带 opid）
  login: (u, t) => (OpenIMSDKRN as any).login(u, t, opid()),
  logout: () => (OpenIMSDKRN as any).logout(opid()),
  getTotalUnreadMsgCount: () => (OpenIMSDKRN as any).getTotalUnreadMsgCount?.(opid()),

  // 文本消息
  async createTextMessage(content: string): Promise<MessageItem> {
    return await (OpenIMSDKRN as any).createTextMessage(content, opid());
  },

  // 图片消息（照搬 & 容错）
  async createImageMessage(imagePath: string, width?: number, height?: number): Promise<MessageItem> {
    if (!imagePath) throw new Error("图片路径不能为空");
    const path = await normalizeLocalImagePath(imagePath);
    try {
      const msg = await (OpenIMSDKRN as any).createImageMessageFromFullPath(path, opid());
      (msg as any).localImagePath = imagePath;
      if (width && height) {
        (msg as any).pictureElem = (msg as any).pictureElem || {};
        (msg as any).pictureElem.sourcePicture = {
          ...(msg as any).pictureElem.sourcePicture,
          width,
          height,
        };
      }
      return msg;
    } catch (e) {
      const fallback = await (OpenIMSDKRN as any).createImageMessage(path, opid());
      (fallback as any).localImagePath = imagePath;
      return fallback;
    }
  },

  // 发送（统一 { data }）
  async sendMessage(params: SendMessageParams) {
    const ret = await (OpenIMSDKRN as any).sendMessage(params, opid());
    return { data: ret };
  },

  // 重发
  async resendMessage(params: SendMessageParams) {
    if (typeof (OpenIMSDKRN as any).resendMessage === "function") {
      const ret = await (OpenIMSDKRN as any).resendMessage(params, opid());
      return { data: ret };
    }
    const ret = await (OpenIMSDKRN as any).sendMessage(params, opid());
    return { data: ret };
  },

  // 历史（不同版本命名差异，做 fallback）
  async getHistoryMessages({ conversationID, count, startClientMsgID }: HistoryParams) {
    const fnA = (OpenIMSDKRN as any).getAdvancedHistoryMsgList;
    const fnB = (OpenIMSDKRN as any).getHistoryMessageList;
    if (typeof fnA === "function") {
      const list = await fnA({ conversationID, count, startClientMsgID }, opid());
      return list || [];
    }
    if (typeof fnB === "function") {
      const list = await fnB({ conversationID, count, startClientMsgID }, opid());
      return list || [];
    }
    throw new Error("SDK 未实现历史消息接口");
  },

  // 事件（不同 SDK 事件名不一致，做适配）
  onRecvNewMessage: (cb) => (OpenIMSDKRN as any).onRecvNewMessage(cb),
  onTotalUnreadMessageCountChanged: (cb) => {
    const a = (OpenIMSDKRN as any).onTotalUnreadMessageCountChanged;
    const b = (OpenIMSDKRN as any).onTotalUnreadMsgCountChanged;
    return (a || b)?.(cb);
  },
  onConnectionStateChanged: (cb) => {
    const a = (OpenIMSDKRN as any).onConnectionStateChanged;
    const b = (OpenIMSDKRN as any).onConnectStateChanged;
    return (a || b)?.(cb);
  },
  onConversationChanged: (cb) => (OpenIMSDKRN as any).onConversationChanged(cb),
};
