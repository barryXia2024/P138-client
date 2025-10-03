// src/hooks/useHotUpdate.ts
import {useState, useEffect} from 'react';
import * as Updates from 'expo-updates';
import {Platform} from 'react-native';
import {isDev} from 'src/utils';

let lastCheckedAt = 0;
let hasDownloadedUpdate = false;

const currentVersion = '2025-10-01 10:00';

export const useHotUpdate = (interval = 5 * 60 * 1000) => {
  const [message, setMessage] = useState<string>(
    `当前版本：${currentVersion} `,
  );

  const checkUpdate = async () => {
    const now = Date.now();
    if (now - lastCheckedAt < interval) return; // 最近已检查过
    lastCheckedAt = now;
    setMessage(`当前版本：${currentVersion}（加载中...）`);
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable && !hasDownloadedUpdate) {
        await Updates.fetchUpdateAsync();
        hasDownloadedUpdate = true;

        setMessage(`当前版本：${currentVersion}（待重启后更新）`);
      } else {
        setMessage(`当前版本：${currentVersion}（最新）`);
      }
    } catch (err) {
      console.error('更新检查失败:', err);
      setMessage(`当前版本：${currentVersion}（检查失败）${err}`);
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'android' && !isDev) return;
    checkUpdate();
  }, []);

  return {
    message: Platform.OS === 'web' ? '当前版本：' + currentVersion : message,
    checkUpdate,
  };
};
