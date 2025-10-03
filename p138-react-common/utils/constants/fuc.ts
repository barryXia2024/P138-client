import * as Updates from 'expo-updates';
import {Platform} from 'react-native';

export const checkForUpdates = async () => {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return;
  }
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      Toast.show('有更新');
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
      // await Updates.fetchUpdateAsync();
      // Alert.alert("发现新版本", "是否立即更新？", [
      //   { text: "稍后", style: "cancel" },
      //   { text: "更新", onPress: () => Updates.reloadAsync() },
      // ]);
    } else {
      Toast.show('没有更新');
      // Alert.alert("没有发现新版本", "是否立即更新？", [
      //   { text: "稍后", style: "cancel" },
      //   { text: "更新", onPress: () => Updates.reloadAsync() },
      // ]);
    }
  } catch (error) {
    console.error('更新检查失败:', error);
  }
};
