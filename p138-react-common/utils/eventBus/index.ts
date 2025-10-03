
import { EventEmitter } from "eventemitter3";
import { AppEvents } from "./types";
import { logger } from "../logged";
import { formatDateTime } from "../dateUtils";



let globalEventId = 0;

class EventBus {
  private static _instance: EventBus;
  private emitter = new EventEmitter();

  private constructor() {}

  static getInstance() {
    if (!this._instance) {
      this._instance = new EventBus();
    }
    return this._instance;
  }

  private nextId() {
    globalEventId += 1;
    return globalEventId;
  }

  emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]) {
    const eid = this.nextId();
    const now =  formatDateTime(new Date());
    logger.debug(
      `[#${eid}] [${now}] emit → ${String(event)} | payload: ${JSON.stringify(payload)}`,
      "EventBus"
    );
    this.emitter.emit(event, payload);
  }

  on<K extends keyof AppEvents>(
    event: K,
    listener: (payload: AppEvents[K]) => void
  ) {
    const eid = this.nextId();
    const now =  formatDateTime(new Date());
    logger.debug(`[#${eid}] [${now}] on → ${String(event)}`, "EventBus");
    this.emitter.on(event, listener);
    return () => this.off(event, listener);
  }

  off<K extends keyof AppEvents>(
    event: K,
    listener: (payload: AppEvents[K]) => void
  ) {
    const eid = this.nextId();
    const now =  formatDateTime(new Date());
    logger.debug(`[#${eid}] [${now}] off → ${String(event)}`, "EventBus");
    this.emitter.off(event, listener);
  }
}

export const eventBus = EventBus.getInstance();

export * from './types';

