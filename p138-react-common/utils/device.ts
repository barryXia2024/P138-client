// import { Platform } from "react-native";
 
// import Constants from 'expo-constants';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CryptoJS from 'crypto-js';
// import { DeviceIdGenerator } from "src/utils/device";

// const USER_DEVICE_ID_KEY = '@p138/user/device/id';

// /**
//  * 获取设备唯一识别码
//  *
//  * 注意：此ID在应用重装后可能会变化，仅用于统计使用
//  * @returns 设备ID
//  */
// export async function getDeviceIdWithUserName(userName: string): Promise<string> {
//   if (!userName) {
//     throw new Error('userName is required for device ID generation');
//   }

//   try {
//     // 生成用户设备ID的存储键
//     const storageKey = `${USER_DEVICE_ID_KEY}:${userName}`;
    
//     // 先从存储中获取该用户的设备ID
//     const existingId = await AsyncStorage.getItem(storageKey);
//     if (existingId) {
//       return existingId;
//     }

//     // 获取基础设备信息
//     let baseDeviceId: string;
    
//     if (Platform.OS === 'web') {
//       // Web平台使用ExpoDeviceIdGenerator
//       baseDeviceId = await new DeviceIdGenerator().getOrCreateDeviceId();
//     } else {
//       // 移动端使用Constants.installationId
//       baseDeviceId = Constants.installationId || 'unknown';
//     }

//     // 结合用户ID和设备信息生成唯一的用户设备ID
//     const userDeviceId = generateUserDeviceId(userName, baseDeviceId);
    
//     // 保存到存储
//     await AsyncStorage.setItem(storageKey, userDeviceId);
    
//     return userDeviceId;
//   } catch (error) {
//     console.error('Failed to generate user device ID:', error);
//     // 如果生成失败，返回一个基于用户ID和时间戳的临时ID
//     return `temp_${userName}_${Date.now()}`;
//   }
// }

// /**
//  * 生成用户设备ID
//  * @param userId 用户ID
//  * @param baseDeviceId 基础设备ID
//  * @returns 用户设备ID
//  */
// export function generateUserDeviceId(userName: string, baseDeviceId: string): string {
//   // 使用用户ID和设备ID的组合生成哈希
 
//   const hash = CryptoJS.HmacSHA256(baseDeviceId,userName);
  
//   const md5 = CryptoJS.MD5(hash.toString(CryptoJS.enc.Hex)).toString();
 
//   return  md5;
// }

// /**
//  * 清除指定用户的设备ID
//  * @param userId 用户ID
//  */
// export async function clearUserDeviceId( userName: string): Promise<void> {
//   if (!userName) {
//     throw new Error('userId is required');
//   }
  
//   const storageKey = `${USER_DEVICE_ID_KEY}:${userName}`;
//   await AsyncStorage.removeItem(storageKey);
// }
