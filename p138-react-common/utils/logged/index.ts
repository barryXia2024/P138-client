// src/utils/logger.ts
import dayjs from "dayjs";
import * as Updates from "expo-updates";

type LogLevel = "info" | "warn" | "error" | "debug";

let globalEventId = 0;

class Logger {
  private isDev = __DEV__;
  private appVersion = Updates.runtimeVersion || "unknown";

  private format(level: LogLevel, message: any, module?: string, eventId?: string | number) {
    const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const eid = eventId ? ` [EID:${eventId}]` : "";
    return `[${timestamp}] [${this.appVersion}] [${level.toUpperCase()}]${module ? " [" + module + "]" : ""}${eid}: ${message}`;
  }

  private nextId() {
    globalEventId += 1;
    return globalEventId;
  }

  info(message: any, module?: string, eventId?: string | number) {
    const log = this.format("info", message, module, eventId ?? this.nextId());
    if (this.isDev) console.log(log);
    return log;
  }

  warn(message: any, module?: string, eventId?: string | number) {
    const log = this.format("warn", message, module, eventId ?? this.nextId());
    if (this.isDev) console.warn(log);
    return log;
  }

  error(message: any, module?: string, error?: Error, eventId?: string | number) {
    const log = this.format("error", message, module, eventId ?? this.nextId());
    if (this.isDev) console.error(log, error);
    return log;
  }

  debug(message: any, module?: string, eventId?: string | number) {
    const log = this.format("debug", message, module, eventId ?? this.nextId());
    if (this.isDev) console.debug(log);
    return log;
  }
}

export const logger = new Logger();
