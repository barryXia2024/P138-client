import '../../global.css';
import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, Platform} from 'react-native';
import {useRouter} from 'expo-router';
import {useUserStore} from 'src/store/user';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {clockManager} from '@/p138-react-common/taskManager/ClockManager';
import {loopTaskManager} from '@/p138-react-common/taskManager/LoopTaskManager';
import {HEARTBEAT_TASK_KEYS} from 'src/shared/constants/hearbeatTaskkeys';
import {checkForUpdates} from '@/p138-react-common/utils/updates';
import {BrowserType, getBrowserInfo} from 'src/utils/device';

dayjs.extend(customParseFormat);

export default function Index() {
  const router = useRouter();
  const {loginInfo} = useUserStore();
  const [loading, setLoading] = useState(true); // 用于控制加载状态
  const [adVisible, setAdVisible] = useState(false); // 控制广告图是否显示

  //处理iOS 手机屏幕适配
  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }
    const browserInfo = getBrowserInfo();
    const isIphone =
      browserInfo.browser === BrowserType.IOS_SAFARI ||
      browserInfo.browser === BrowserType.IOS_CHROME;
    if (!isIphone) {
      return;
    }
    const root = document.getElementById('root');
    const html = document.documentElement;
    const body = document.body;

    const setWidth = () => {
      [root, html, body].forEach(el => {
        if (!el) return;
        el.style.width = `${browserInfo.width}px`;
        el.style.maxWidth = `${browserInfo.width}px`;
        el.style.overflowX = 'hidden'; // 禁止横向滚动
      });
    };

    setWidth();
    window.addEventListener('resize', setWidth);

    return () => window.removeEventListener('resize', setWidth);
  }, []);

  useEffect(() => {
    clockManager.start();

    checkForUpdates();

    loopTaskManager.register({
      key: HEARTBEAT_TASK_KEYS.AD_SHOW_TIME,
      intervalSec: 2,
      callback: () => {
        console.log('AD_SHOW_TIME');
        setAdVisible(true); // 广告图展示结束，继续处理
        checkLoginStatus(); // 检查登录状态
      },
      once: true,
    });
  }, []);

  // 检查用户的登录状态
  const checkLoginStatus = async () => {
    // const token = await AsyncStorage.getItem("token"); // 获取存储的登录信息（如 token）
    setLoading(false); // 完成检查，停止加载动画

    if (loginInfo?.userID) {
      router.replace('/Home'); // 用户已登录，跳转到主页（Tab页面）dd
    } else {
      router.replace('/login'); // 用户未登录，跳转到登录页面
    }
  };

  return (
    <View style={styles.container}>
      {/* {loading ? (
        <ActivityIndicator size="large" color="#FF6347" /> // 显示加载指示器
      ) : (
        <>
          {adVisible && (
            <Image
            source={require("src/assets/jpImages/start.png")} // 你的广告图资源
              style={styles.adImage}
            />
          )}
        </>
      )} */}
      <Image
        source={require('src/assets/imgs/splash.webp')} // 你的广告图资源
        style={styles.adImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  adImage: {
    width: '100%', // 广告图宽度自适应屏幕
    height: '100%', // 广告图高度自适应屏幕，或者你可以设置固定的高度
    position: 'absolute', // 广告图层叠在顶部
    top: 0,
    left: 0,
    resizeMode: 'cover', // 保持图像比例
  },
});
