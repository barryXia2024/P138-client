import AsyncStorage from "@react-native-async-storage/async-storage";
import { eventBus, AppEventTypes } from "./eventBus";
import { useIMStore, useMessageStore, LocalMessage } from "./store";
import { openIMAdapter } from "./adapter";

interface TokenData { token: string; expiryAt: number; }
interface LoginParams {
  userId: string;
  token: string;
  expireTimeSeconds: number;
  refreshFn: () => Promise<{ token: string; expireTimeSeconds: number }>;
}
const STORAGE_KEY = "IM_TOKEN";

class IMService {
  private static _instance: IMService;
  private sdk = openIMAdapter;
  private userId?: string;
  private refreshFn?: LoginParams["refreshFn"];
  private refreshTimer?: NodeJS.Timeout;
  private unsubscribers: Array<() => void> = [];

  private constructor() {}
  static getInstance() { if (!this._instance) this._instance = new IMService(); return this._instance; }

  // 登录/切换账号
  async loginWithToken(params: LoginParams) {
    await this.logout(false);
    this.userId = params.userId;
    this.refreshFn = params.refreshFn;
    this.bindSdkEvents();

    const expiryAt = Date.now() + params.expireTimeSeconds * 1000;
    await this.saveToken({ token: params.token, expiryAt });
    await this.sdk.login(params.userId, params.token);

    if (this.sdk.getTotalUnreadMsgCount) {
      try {
        const total = await this.sdk.getTotalUnreadMsgCount();
        eventBus.emit("onTotalUnreadMessageCountChanged", total);
      } catch {}
    }
    this.scheduleRefresh(expiryAt);
    eventBus.emit(AppEventTypes.LOGIN, { userId: params.userId });
  }

  // 冷启动自动登录
  async autoLogin(userId: string) {
    const tokenData = await this.getToken();
    if (!tokenData || !this.refreshFn) {
      eventBus.emit(AppEventTypes.LOGOUT);
      return false;
    }
    this.userId = userId;
    this.bindSdkEvents();

    if (Date.now() >= tokenData.expiryAt - 60 * 1000) {
      try {
        await this.refreshTokenWithRetry();
      } catch {
        eventBus.emit(AppEventTypes.LOGOUT);
        return false;
      }
    } else {
      await this.sdk.login(userId, tokenData.token);
      if (this.sdk.getTotalUnreadMsgCount) {
        try {
          const total = await this.sdk.getTotalUnreadMsgCount();
          eventBus.emit("onTotalUnreadMessageCountChanged", total);
        } catch {}
      }
      this.scheduleRefresh(tokenData.expiryAt);
    }
    return true;
  }

  // 登出
  async logout(triggerEvent = true) {
    try { await this.sdk.logout(); } catch {}
    this.teardownSdkEvents();
    this.stopRefreshTimer();
    await this.clearToken();
    useIMStore.getState().reset();
    useMessageStore.getState().reset();
    if (triggerEvent) eventBus.emit(AppEventTypes.LOGOUT);
  }

  // ===== 事件绑定 =====
  private bindSdkEvents() {
    this.teardownSdkEvents();
    if (this.sdk.onRecvNewMessage) {
      this.unsubscribers.push(this.sdk.onRecvNewMessage((msg) => {
        eventBus.emit("onRecvNewMessage", msg);
        const cid = (msg as any).conversationID;
        if (cid) useMessageStore.getState().appendMessage(cid, msg as LocalMessage);
      }));
    }
    if (this.sdk.onTotalUnreadMessageCountChanged) {
      this.unsubscribers.push(this.sdk.onTotalUnreadMessageCountChanged((n) => {
        eventBus.emit("onTotalUnreadMessageCountChanged", n);
      }));
    }
    if (this.sdk.onConversationChanged) {
      this.unsubscribers.push(this.sdk.onConversationChanged((list) => {
        eventBus.emit("onConversationChanged", list);
        useIMStore.getState().upsertConversations(list);
      }));
    }
    if (this.sdk.onConnectionStateChanged) {
      this.unsubscribers.push(this.sdk.onConnectionStateChanged((s) => {
        eventBus.emit("onConnectionStateChanged", s);
        useIMStore.getState().setConnectionState(s);
      }));
    }
  }
  private teardownSdkEvents() { this.unsubscribers.forEach(u => { try { u(); } catch {} }); this.unsubscribers = []; }

  // ===== 发送目标解析 =====
  private resolveSendTarget(conversationId: string): { recvID?: string; groupID?: string } {
    const { conversations } = useIMStore.getState();
    const conv = conversations[conversationId];
    if (conv) {
      const isSingle = (conv as any).conversationType === 1 || (!!(conv as any).userID && !(conv as any).groupID);
      return isSingle ? { recvID: (conv as any).userID } : { groupID: (conv as any).groupID };
    }
    if (conversationId.startsWith("si_")) {
      const parts = conversationId.split("_"); // si_{otherId}_{selfId}
      return { recvID: parts[1] };
    }
    if (conversationId.startsWith("gi_")) {
      const parts = conversationId.split("_"); // gi_{groupId}
      return { groupID: parts[1] };
    }
    throw new Error("无法解析会话发送目标");
  }

  // ===== 发消息：文本 =====
  async sendTextMessage(conversationId: string, text: string): Promise<LocalMessage> {
    if (!this.userId) throw new Error("未登录 IM");
    const { recvID, groupID } = this.resolveSendTarget(conversationId);
    const draft = await this.sdk.createTextMessage(text);
    const local: LocalMessage = { ...(draft as any), status: "pending" };
    useMessageStore.getState().appendMessage(conversationId, local);
    try {
      const result = await this.sdk.sendMessage({ recvID, groupID, message: draft });
      const sent = result?.data ?? draft;
      useMessageStore.getState().updateMessageStatus(conversationId, (draft as any).clientMsgID, "sent");
      return { ...(sent as any), status: "sent" };
    } catch (err) {
      useMessageStore.getState().updateMessageStatus(conversationId, (draft as any).clientMsgID, "failed");
      throw err;
    }
  }

  // ===== 发消息：图片（路径等处理在 adapter 内） =====
  async sendImageMessage(conversationId: string, imagePath: string, width?: number, height?: number): Promise<LocalMessage> {
    if (!this.userId) throw new Error("未登录 IM");
    const { recvID, groupID } = this.resolveSendTarget(conversationId);
    const draft = await this.sdk.createImageMessage(imagePath, width, height);
    const local: LocalMessage = { ...(draft as any), status: "pending" };
    useMessageStore.getState().appendMessage(conversationId, local);
    try {
      const result = await this.sdk.sendMessage({ recvID, groupID, message: draft });
      const sent = result?.data ?? draft;
      useMessageStore.getState().updateMessageStatus(conversationId, (draft as any).clientMsgID, "sent");
      return { ...(sent as any), status: "sent" };
    } catch (err) {
      useMessageStore.getState().updateMessageStatus(conversationId, (draft as any).clientMsgID, "failed");
      throw err;
    }
  }

  // ===== 重发：failed → resend or send =====
  async resendMessage(conversationId: string, clientMsgID: string): Promise<LocalMessage> {
    const list = useMessageStore.getState().messages[conversationId] || [];
    const msg = list.find(m => m.clientMsgID === clientMsgID);
    if (!msg) throw new Error("本地消息不存在");
    const { recvID, groupID } = this.resolveSendTarget(conversationId);
    try {
      if (this.sdk.resendMessage) {
        const result = await this.sdk.resendMessage({ recvID, groupID, message: msg });
        const sent = result?.data ?? msg;
        useMessageStore.getState().updateMessageStatus(conversationId, clientMsgID, "sent");
        return { ...(sent as any), status: "sent" };
      } else {
        const result = await this.sdk.sendMessage({ recvID, groupID, message: msg });
        const sent = result?.data ?? msg;
        useMessageStore.getState().updateMessageStatus(conversationId, clientMsgID, "sent");
        return { ...(sent as any), status: "sent" };
      }
    } catch (err) {
      useMessageStore.getState().updateMessageStatus(conversationId, clientMsgID, "failed");
      throw err;
    }
  }

  // ===== 历史：prepend & 去重在 store 层处理 =====
  async loadHistory(conversationId: string, count = 20, startClientMsgID?: string | null) {
    if (!this.sdk.getHistoryMessages) return [];
    const list = await this.sdk.getHistoryMessages({ conversationID: conversationId, count, startClientMsgID: startClientMsgID ?? null });
    useMessageStore.getState().prependMessages(conversationId, list as any);
    return list;
  }

  // ===== Token 刷新 =====
  private async refreshTokenWithRetry(maxRetries = 3): Promise<TokenData> {
    if (!this.refreshFn || !this.userId) throw new Error("Missing refreshFn or userId");
    let attempt = 0, lastError: any;
    while (attempt < maxRetries) {
      try {
        const newToken = await this.refreshFn();
        const expiryAt = Date.now() + newToken.expireTimeSeconds * 1000;
        await this.saveToken({ token: newToken.token, expiryAt });
        await this.sdk.login(this.userId, newToken.token);
        this.scheduleRefresh(expiryAt);
        return { token: newToken.token, expiryAt };
      } catch (err) {
        attempt++; lastError = err;
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    }
    throw lastError;
  }

  private scheduleRefresh(expiryAt: number) {
    this.stopRefreshTimer();
    const refreshBefore = expiryAt - Date.now() - 60 * 1000;
    if (refreshBefore <= 0) return;
    this.refreshTimer = setTimeout(async () => {
      try {
        await this.refreshTokenWithRetry();
      } catch {
        eventBus.emit(AppEventTypes.TOKEN_EXPIRED);
        eventBus.emit(AppEventTypes.LOGOUT);
      }
    }, Math.max(0, refreshBefore));
  }
  private stopRefreshTimer() { if (this.refreshTimer) { clearTimeout(this.refreshTimer); this.refreshTimer = undefined; } }

  private async saveToken(data: TokenData) { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  private async getToken(): Promise<TokenData | null> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY); if (!raw) return null;
    try { return JSON.parse(raw) as TokenData; } catch { return null; }
  }
  private async clearToken() { await AsyncStorage.removeItem(STORAGE_KEY); }
}

export const imService = IMService.getInstance();
