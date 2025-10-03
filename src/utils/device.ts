import * as DeviceInfo from 'expo-device';
import * as Application from 'expo-application';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import Constants from 'expo-constants';
const USER_DEVICE_ID_KEY = '@p138/user/device/id';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

import {generateSnowflakeId} from '@/p138-react-common/api/utils/snowflake';
import {Dimensions, Platform} from 'react-native';
import { loginOut } from 'src/api/request';
/**
 * 生成用户设备ID
 * @param userId 用户ID
 * @param baseDeviceId 基础设备ID
 * @returns 用户设备ID
 */
const generateUserDeviceId = (
  userName: string,
  baseDeviceId: string,
): string => {
  // 使用用户ID和设备ID的组合生成哈希

  const hash = CryptoJS.HmacSHA256(baseDeviceId, userName);

  const md5 = CryptoJS.MD5(hash.toString(CryptoJS.enc.Hex)).toString();

  return md5;
};
/**
 * Expo平台设备ID生成器
 */
export class DeviceIdGenerator implements P138Api.IDeviceIdGenerator {
  generateSnowflakeId(): string {
    return generateSnowflakeId();
  }

  async getOrCreateDeviceId(): Promise<string> {
    try {
      // 先从存储中获取
      const existingId = await AsyncStorage.getItem(USER_DEVICE_ID_KEY);
      if (existingId) {
        return existingId;
      }
      if (Platform.OS === 'web') {
        // const FingerprintJS\\;
        const fpPromise = FingerprintJS.load();
        const fp = await fpPromise;
        const result = await fp.get();
        const {
          applePay,
          architecture,
          audio,
          canvas,
          colorDepth,
          cpuClass,
          osCpu,
          platform,
          timezone,
          languages,
        } = result.components;

        const visitorId = FingerprintJS.hashComponents({
          applePay,
          architecture,
          audio,
          canvas,
          colorDepth,
          cpuClass,
          osCpu,
          platform,
          timezone,
          languages,
        });

        return visitorId;
      } else {
        // 获取设备信息
        const deviceInfo = {
          deviceName: DeviceInfo.deviceName,
          deviceType: DeviceInfo.deviceType,
          osName: DeviceInfo.osName,
          osVersion: DeviceInfo.osVersion,
          deviceYearClass: DeviceInfo.deviceYearClass,
          totalMemory: DeviceInfo.totalMemory,
          applicationId: Application.applicationId,
          // installationId:  Application.getAndroidId(),
        };
        console.log('deviceInfo', Constants, deviceInfo, Application);

        // 等待所有 Promise 完成
        const deviceInfoValues = await Promise.all(Object.values(deviceInfo));

        // 生成设备ID
        const deviceId = Math.abs(
          deviceInfoValues
            .filter(Boolean)
            .join('|')
            .split('')
            .reduce((acc: number, char: string) => {
              return (acc << 5) - acc + char.charCodeAt(0);
            }, 0),
        ).toString(16);
        // 保存到存储
        await AsyncStorage.setItem(USER_DEVICE_ID_KEY, deviceId);
        return deviceId;
      }
    } catch (error) {
      console.error('Failed to generate device ID:', error);
      // 如果生成失败，返回一个基于时间戳的临时ID
      return `temp_${Date.now()}`;
    }
  }

  async clearDeviceId(): Promise<void> {
    await AsyncStorage.removeItem(USER_DEVICE_ID_KEY);
  }
  async getDeviceIdWithUserName(userName?: string): Promise<string> {
    // 如果没有传入userId，尝试从用户状态获取

    if (!userName) {
      const {useUserStore} = await import('src/store/user');
      const loginInfo = useUserStore.getState().loginInfo;
      userName = loginInfo?.username;
      if (!userName) {
        loginOut()
        
        throw new Error('userName is required for device ID generation');
      }
    }
    console.log('userName', userName);

    try {
      // 生成用户设备ID的存储键
      const storageKey = `${USER_DEVICE_ID_KEY}:${userName}`;

      // 先从存储中获取该用户的设备ID
      // const existingId = await AsyncStorage.getItem(storageKey);
      // if (existingId) {
      //   return existingId;
      // }

      // 获取基础设备信息
      let baseDeviceId: string;

      if (Platform.OS === 'web') {
        // Web平台使用ExpoDeviceIdGenerator
        baseDeviceId = await new DeviceIdGenerator().getOrCreateDeviceId();
      } else {
        // 移动端使用Constants.installationId
        baseDeviceId = Constants.installationId || 'unknown';
      }
      console.log('baseDeviceId', baseDeviceId);

      // 结合用户ID和设备信息生成唯一的用户设备ID
      const userDeviceId = generateUserDeviceId(userName, baseDeviceId);

      // 保存到存储
      await AsyncStorage.setItem(storageKey, userDeviceId);

      return userDeviceId;
    } catch (error) {
      console.error('Failed to generate user device ID:', error);
      // 如果生成失败，返回一个基于用户ID和时间戳的临时ID
      throw error;
      // return `temp_${userName}_${Date.now()}`;
    }
  }
}

// 浏览器类型枚举
export enum BrowserType {
  APP = 'App',
  IOS_SAFARI = 'iOS Safari',
  IOS_CHROME = 'iOS Chrome',
  ANDROID_CHROME = 'Android Chrome',
  ANDROID_FIREFOX = 'Android Firefox',
  WINDOWS_CHROME = 'Windows Chrome',
  WINDOWS_FIREFOX = 'Windows Firefox',
  WINDOWS_EDGE = 'Windows Edge',
  MAC_SAFARI = 'Mac Safari',
  MAC_CHROME = 'Mac Chrome',
  MAC_FIREFOX = 'Mac Firefox',
  OTHER = 'Other',
}

// 返回类型
export interface BrowserInfo {
  browser: BrowserType;
  width: number;
  height: number;
  userAgent: string;
}

/**
 * 获取浏览器/平台类型和屏幕宽高
 */
export function getBrowserInfo(): BrowserInfo {
  // 如果在 App 里
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    // 这里 width/height 可用 Dimensions 获取
    const {width, height} = Dimensions.get('window');
    return {
      browser: BrowserType.APP,
      width,
      height,
      userAgent: '', // App 里没有 window.navigator.userAgent
    };
  }

  // Web 环境
  const ua = window.navigator.userAgent;

  const isIOS = /iP(hone|od|ad)/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isWindows = /Windows/.test(ua);
  const isMac = /Macintosh/.test(ua);

  const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR/.test(ua);
  const isChrome = /Chrome|Chromium/.test(ua) && !/Edg|OPR/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  const isEdge = /Edg/.test(ua);

  let browser: BrowserType = BrowserType.OTHER;

  if (isIOS && isSafari) browser = BrowserType.IOS_SAFARI;
  else if (isIOS && isChrome) browser = BrowserType.IOS_CHROME;
  else if (isAndroid && isChrome) browser = BrowserType.ANDROID_CHROME;
  else if (isAndroid && isFirefox) browser = BrowserType.ANDROID_FIREFOX;
  else if (isWindows && isChrome) browser = BrowserType.WINDOWS_CHROME;
  else if (isWindows && isFirefox) browser = BrowserType.WINDOWS_FIREFOX;
  else if (isWindows && isEdge) browser = BrowserType.WINDOWS_EDGE;
  else if (isMac && isSafari) browser = BrowserType.MAC_SAFARI;
  else if (isMac && isChrome) browser = BrowserType.MAC_CHROME;
  else if (isMac && isFirefox) browser = BrowserType.MAC_FIREFOX;

  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    browser,
    width,
    height,
    userAgent: ua,
  };
}
