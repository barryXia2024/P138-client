import * as Updates from 'expo-updates';
import { Platform } from 'react-native';

export const checkForUpdates = async () => {
  if(Platform.OS === 'web') {
    return;
  }
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } else {
      console.error('没有更新');
    }
  } catch (error) {
    console.error('更新检查失败:', error);
  }
};
