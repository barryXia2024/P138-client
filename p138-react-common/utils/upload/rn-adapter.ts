import {Platform} from 'react-native';
import {ImagePickerAsset} from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {Buffer} from 'buffer';
import {storageAdapter} from '../../api/platforms/storage';
import {PlatformAdapter, PlatformFile} from './core';

export class RNPlatformAdapter implements PlatformAdapter {
  constructor() {
    // 检查Buffer polyfill是否正确加载
    // console.log('RNPlatformAdapter初始化');
    // console.log('当前平台:', Platform.OS);
    // console.log('Buffer可用性:', typeof Buffer !== 'undefined');
    // console.log('Buffer.from可用性:', typeof Buffer !== 'undefined' && typeof Buffer.from === 'function');
  }

  async convertFile(file: ImagePickerAsset): Promise<PlatformFile> {
    const mimeType = file.mimeType || 'application/octet-stream';
    const ext = mimeType.split('/')[1] || 'jpg';
    const filename = file.fileName || `upload_${Date.now()}.${ext}`;

    return {
      name: filename,
      size: file.fileSize || 0,
      type: mimeType,
      lastModified: Date.now(),
      uri: file.uri,
    };
  }

  async getFileContent(file: PlatformFile): Promise<Uint8Array> {
    if (!file.uri) {
      throw new Error('React Native平台需要uri');
    }

    console.log('开始获取文件内容，平台:', Platform.OS);
    console.log('文件URI:', file.uri);

    if (Platform.OS === 'web') {
      // Web平台：转换为 Uint8Array
      console.log('Web平台：使用fetch获取文件内容');
      const response = await fetch(file.uri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const result = new Uint8Array(arrayBuffer);
      console.log('Web平台：文件内容获取成功，长度:', result.length);
      return result;
    } else {
      // 移动端：使用 Expo FileSystem
      console.log('移动端：使用Expo FileSystem读取文件');
      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('移动端：base64读取成功，长度:', base64.length);
      
      if (typeof Buffer !== 'undefined' && Buffer.from) {
        const buffer = Buffer.from(base64, 'base64');
        const result = new Uint8Array(buffer);
        console.log('移动端：Buffer转换成功，长度:', result.length);
        return result;
      } else {
        console.warn('移动端：Buffer不可用，尝试其他方法');
        // 如果Buffer不可用，尝试使用TextEncoder
        const encoder = new TextEncoder();
        const result = encoder.encode(atob(base64));
        console.log('移动端：TextEncoder转换成功，长度:', result.length);
        return result;
      }
    }
  }

  async storeAuthInfo(
    authInfo: ServerCoreFilestroage.OssInfo & {lastAuthTime: number},
  ): Promise<void> {
    await storageAdapter.setItem('ossAuthInfo', JSON.stringify(authInfo));
  }

  async getAuthInfo(): Promise<
    (ServerCoreFilestroage.OssInfo & {lastAuthTime: number}) | undefined
  > {
    const stored = await storageAdapter.getItem('ossAuthInfo');
    return stored ? JSON.parse(stored) : undefined;
  }
  
  async clearAuthInfo(): Promise<void> {
    await storageAdapter.removeItem('ossAuthInfo');
  }
}
