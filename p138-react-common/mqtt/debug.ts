let debugEnabled = false;

export const enableDebugLog = () => (debugEnabled = true);
export const disableDebugLog = () => (debugEnabled = false);

export const log = (...args: any[]) => {
  if (debugEnabled) console.log('[MQTT]', ...args);
};

export const warn = (...args: any[]) => {
  if (debugEnabled) console.warn('[MQTT]', ...args);
};

export const error = (...args: any[]) => {
  if (debugEnabled) console.error('[MQTT]', ...args);
};
