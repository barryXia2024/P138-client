/**
 * 设备信息工具函数
 *
 * 提供获取和处理设备相关信息的功能
 */

import {Dimensions, PixelRatio, Platform, StatusBar} from 'react-native';
// import { getLocales } from 'expo-localization';
import Constants from 'expo-constants';


/**
 * 设备屏幕尺寸
 */
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * 设备像素比
 */
export const PIXEL_RATIO = PixelRatio.get();

/**
 * 设备是否为iOS
 */
export const IS_IOS = Platform.OS === 'ios';

/**
 * 设备是否为Android
 */
export const IS_ANDROID = Platform.OS === 'android';

/**
 * 设备是否为平板
 */
export const IS_TABLET = SCREEN_WIDTH > 550 || SCREEN_HEIGHT > 850;

/**
 * 状态栏高度
 */
export const STATUS_BAR_HEIGHT = StatusBar.currentHeight || (IS_IOS ? 44 : 0);

/**
 * 根据尺寸计算缩放尺寸
 * @param size 设计稿上的尺寸
 * @param baseWidth 设计稿的基准宽度，默认为375（iPhone 设计稿）
 * @returns 缩放后的尺寸
 */
export function scale(size: number, baseWidth = 375): number {
  const scaleWidth = SCREEN_WIDTH / baseWidth;
  return Math.round(size * scaleWidth);
}

/**
 * 将px转换为dp
 * @param px 像素值
 * @returns dp值
 */
export function pxToDp(px: number): number {
  return px / PIXEL_RATIO;
}

/**
 * 将dp转换为px
 * @param dp dp值
 * @returns 像素值
 */
export function dpToPx(dp: number): number {
  return dp * PIXEL_RATIO;
}

/**
 * 获取设备唯一识别码
 *
 * 注意：此ID在应用重装后可能会变化，仅用于统计使用
 * @param userId 用户ID，用于生成用户特定的设备ID
 * @returns 设备ID
 */
// export async function getDeviceId(userId?: string): Promise<string> {
//   if (!userId) {
//     // 如果没有提供userId，使用原来的逻辑作为兼容性处理
//     return Platform.OS === 'web'
//       ? await new ExpoDeviceIdGenerator().getOrCreateDeviceId()
//       : Constants.installationId;
//   }
  
//   // 使用新的用户设备ID生成逻辑
//   return getDeviceIdWithUserId(userId);
// }

/**
 * 获取应用版本号
 * @returns 版本号
 */
export function getAppVersion(): string {
  return Constants.getVersion() || '1.0.0';
}

/**
 * 获取设备操作系统版本
 * @returns 操作系统版本
 */
export function getOSVersion(): string {
  return Platform.Version.toString();
}

/**
 * 获取设备制造商和型号
 * @returns 设备型号信息
 */
export function getDeviceInfo(): {
  brand: string;
  model: string;
  appVersion: string;
} {
  return {
    brand: Constants.deviceName?.split(' ')[0] || '',
    model: Constants.deviceName || '',
    appVersion: Constants.getVersion() || '1.0.0',
  };
}

// /**
//  * 获取设备当前区域设置
//  * @returns 区域设置，如zh-CN
//  */
// export function getDeviceLocale(): string {
//   return getLocales()[0]?.languageTag || 'en-US';
// }

/**
 * 判断设备是否为iOS刘海屏
 * @returns 是否为刘海屏
 */
export function isIphoneXSeries(): boolean {
  if (!IS_IOS) return false;

  // 根据屏幕比例和像素密度判断
  if (SCREEN_HEIGHT >= 812 || SCREEN_WIDTH >= 812) {
    return true;
  }

  return false;
}

/**
 * 获取安全区域大小
 * @returns 安全区域大小
 */
export function getSafeAreaInsets(): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  // 默认安全区域
  const defaultInsets = {top: STATUS_BAR_HEIGHT, right: 0, bottom: 0, left: 0};

  // 对于iPhone X系列，增加底部安全区域
  if (isIphoneXSeries()) {
    defaultInsets.bottom = 34;
  }

  return defaultInsets;
}

/**
 * 判断设备是否启用了暗黑模式
 * @returns 是否为暗黑模式
 */
export function isDarkMode(): boolean {
  // 在hooks中使用useColorScheme()更合适，这里简单实现
  return false;
}

/**
 * 检查设备是否联网
 * @returns Promise<boolean> 是否联网
 */
export async function isConnected(): Promise<boolean> {
  try {
    // 在实际项目中，应该使用NetInfo库
    // 这里简化实现
    return true;
  } catch (error) {
    console.error('检查网络连接失败:', error);
    return false;
  }
}

/**
 * 获取设备的唯一语言代码
 * @returns 语言代码，如zh、en
 */
export function getDeviceLanguage(): string {
  // 由于getLocales被注释掉了，这里返回默认值
  // 在实际项目中，应该使用expo-localization
  return 'en';
}

/**
 * 获取底部导航栏/Home Indicator高度
 * @returns 底部导航栏高度
 */
export function getBottomSpace(): number {
  return isIphoneXSeries() ? 34 : 0;
}

/**
 * 检查设备是否支持生物识别
 * @returns Promise<boolean> 是否支持生物识别
 */
export async function supportsBiometrics(): Promise<boolean> {
  try {
    // 在实际项目中，应该使用expo-local-authentication
    // import * as LocalAuthentication from 'expo-local-authentication';
    // const compatible = await LocalAuthentication.hasHardwareAsync();
    // return compatible;

    // 这里简化实现
    return true;
  } catch (error) {
    console.error('检查生物识别失败:', error);
    return false;
  }
}
