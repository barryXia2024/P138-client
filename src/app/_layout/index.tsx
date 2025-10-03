import React, {useEffect} from 'react';
import {Stack} from 'expo-router/stack';
import {ToastProvider} from '@/p138-react-common/components/toast/ToastContext';
import '../../../global.css';
import Toast from '@/p138-react-common/components/toast';

import {StatusBar} from 'expo-status-bar';
import {createTamagui, PortalProvider, TamaguiProvider} from 'tamagui';
import {defaultConfig} from '@tamagui/config/v4';
import {SafeAreaView, Edge} from 'react-native-safe-area-context';
import {usePathname} from 'expo-router';
import {
  messageCleanupService,
  initializeCache,
} from '@/p138-react-common/mqtt/middleware';
import ContactShopker from '../chatV3/components/ContactShopker';
 


// import { restoreUserStore } from 'src/store/init';

const config = createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    default: defaultConfig.themes.dark,
  },
});

// 定义不需要 SafeArea 的页面
const NO_SAFE_AREA_SCREENS = ['login'];

export default function Layout() {
  // const {setAppState} = useAppState();
  const pathname = usePathname();
  const currentScreen = pathname.split('/').pop() || '';

  // 初始化MQTT消息清理服务和缓存
 useEffect(() => {
    // 初始化消息ID缓存
    initializeCache();

    // 启动消息清理服务
    messageCleanupService.start(
      60 * 60 * 1000, // 每小时清理一次
      7 * 24 * 60 * 60 * 1000, // 消息ID保存7天
    );

    // 组件卸载时停止服务
    return () => {
      messageCleanupService.stop();
    };
  }, []);

  // useEffect(() => {

  //   // restoreUserStore()
  //   const subscription = AppState.addEventListener('change', nextAppState => {
  //     setAppState(nextAppState);
  //   });

  //   // 清理订阅
  //   return () => {
  //     subscription.remove();
  //   };
  // }, [setAppState]);

  // 判断当前页面是否需要 SafeArea
  const needsSafeArea = !NO_SAFE_AREA_SCREENS.includes(currentScreen);

  // 根据页面决定是否启用安全区域
  const edges: Edge[] = needsSafeArea ? ['top', 'right', 'bottom', 'left'] : [];

  return (
    <SafeAreaView style={[{flex: 1}]} edges={edges}>
      <PortalProvider>
        <TamaguiProvider config={config}>
          <ToastProvider>
            <ContactShopker />
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="(tabs)" />
            </Stack>
            <Toast />
          </ToastProvider>
        </TamaguiProvider>
      </PortalProvider>
    </SafeAreaView>
  );
}
