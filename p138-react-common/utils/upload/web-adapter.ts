import {PlatformAdapter, PlatformFile} from './core';

export class WebPlatformAdapter implements PlatformAdapter {
  async convertFile(file: File): Promise<PlatformFile> {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      file: file,
    };
  }

  async getFileContent(file: PlatformFile): Promise<Uint8Array> {
    if (!file.file) {
      throw new Error('Web平台需要File对象');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        resolve(uint8Array);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file.file!);
    });
  }

  async storeAuthInfo(
    authInfo: ServerCoreFilestroage.OssInfo & {lastAuthTime: number},
  ): Promise<void> {
    localStorage.setItem('ossAuthInfo', JSON.stringify(authInfo));
  }

  async getAuthInfo(): Promise<
    (ServerCoreFilestroage.OssInfo & {lastAuthTime: number}) | undefined
  > {
    const stored = await localStorage.getItem('ossAuthInfo');
    return stored ? JSON.parse(stored) : undefined;
  }
  async clearAuthInfo(): Promise<void> {
    localStorage.removeItem('ossAuthInfo');
  }
}