import { EventEmitter } from "eventemitter3";
import type { MessageItem, ConversationItem, ConnectionState } from "open-im-sdk-rn";

// === SDK 原生事件 ===
export type IMEvents = {
  onRecvNewMessage: MessageItem;
  onTotalUnreadMessageCountChanged: number;
  onConnectionStateChanged: ConnectionState;
  onConversationChanged: ConversationItem[];
};

// === 业务事件 ===
export enum AppEventTypes {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
}

class EventBus {
  private emitter = new EventEmitter();

  emit<K extends keyof IMEvents>(event: K, payload: IMEvents[K]): void;
  emit(event: AppEventTypes, payload?: any): void;
  emit(event: any, payload?: any) {
    this.emitter.emit(event, payload);
  }

  on<K extends keyof IMEvents>(event: K, listener: (payload: IMEvents[K]) => void): () => void;
  on(event: AppEventTypes, listener: (payload?: any) => void): () => void;
  on(event: any, listener: (payload?: any) => void) {
    this.emitter.on(event, listener);
    return () => this.emitter.off(event, listener);
  }
}

export const eventBus = new EventBus();
