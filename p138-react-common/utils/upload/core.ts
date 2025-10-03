import {Platform} from 'react-native';
import * as FileSystem from 'expo-file-system';
import OSS from 'ali-oss';
import {getOssAuthInfo} from '@/api/interface/oss';

// 确保Buffer polyfill在所有环境中都可用
let BufferPolyfill: any;
try {
  if (typeof Buffer !== 'undefined') {
    BufferPolyfill = Buffer;
  } else if (typeof require !== 'undefined') {
    BufferPolyfill = require('buffer').Buffer;
  }
} catch (error) {
  console.warn('Buffer polyfill加载失败:', error);
}
 

// 平台无关的文件接口
export interface PlatformFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  // 平台特定的数据
  uri?: string;
  buffer?: Uint8Array; // 改为Uint8Array以兼容Web环境
  file?: File;
}

// 平台适配器接口
export interface PlatformAdapter {
  // 将平台特定的文件转换为统一格式
  convertFile(file: any): Promise<PlatformFile>;
  // 获取文件内容用于上传
  getFileContent(file: PlatformFile): Promise<Uint8Array>; // 改为Uint8Array
  // 存储认证信息
  storeAuthInfo(
    authInfo: ServerCoreFilestroage.OssInfo & {lastAuthTime: number},
  ): Promise<void>;
  // 获取存储的认证信息
  getAuthInfo(): Promise<
    (ServerCoreFilestroage.OssInfo & {lastAuthTime: number}) | undefined
  >;
  // 清除认证信息
  clearAuthInfo(): Promise<void>;
}

// 核心OSS客户端类
export class CoreOssClient {
  private static instance: CoreOssClient | null = null;
  private client: OSS | null = null;
  private authInfo: any = null;
  private lastAuthTime: number = 0;
  private readonly AUTH_EXPIRE_TIME = 30 * 60 * 1000; // 30分钟
  private initPromise: Promise<OSS> | null = null;
  
  // 认证失败计数器，防止无限重试
  private authFailureCount: number = 0;
  private readonly MAX_AUTH_FAILURES = 5;
  private readonly AUTH_FAILURE_RESET_TIME = 10 * 60 * 1000; // 10分钟
  private lastAuthFailureTime: number = 0;

  // 缓存相关
  private fileCache: Map<string, {data: string; timestamp: number}> = new Map();
  private readonly CACHE_EXPIRE_TIME = 5 * 60 * 1000; // 5分钟缓存
  private pendingRequests: Map<string, Promise<string>> = new Map();
  private uploadCache: Map<string, {fileName: string; timestamp: number}> =
    new Map();
  private readonly UPLOAD_CACHE_EXPIRE_TIME = 24 * 60 * 60 * 1000; // 24小时上传缓存
  private readonly LOCAL_DIR = 'oss-cache';

  // 统一转换为 Uint8Array（兼容 ArrayBuffer / Uint8Array / TypedArray / Array-like / Buffer）
  private toUint8Array(content: any): Uint8Array {
    try {
      if (content instanceof Uint8Array) return content;
      if (content instanceof ArrayBuffer) return new Uint8Array(content);
      if (content && typeof content === 'object' && 'buffer' in content) {
        const typed = content as any;
        return new Uint8Array(typed.buffer, typed.byteOffset ?? 0, typed.byteLength ?? typed.length ?? 0);
      }
      if (Array.isArray(content)) return new Uint8Array(content);
      if (typeof BufferPolyfill !== 'undefined' && BufferPolyfill.isBuffer?.(content)) return new Uint8Array(content);
      if (content && typeof content.length === 'number') {
        return new Uint8Array(Array.from(content as any));
      }
    } catch {}
    return new Uint8Array();
  }

  // 统一本地键：使用路径最后一段（去掉扩展名，例如 ossimg_xxx）
  private getLocalKey(fileName: string): string {
    try {
      if (!fileName) return '';
      const idx = fileName.lastIndexOf('/');
      const last = idx >= 0 ? fileName.slice(idx + 1) : fileName;
      // 去掉常见扩展名
      const withoutExt = last.replace(/\.(png|jpg|jpeg|gif|webp|svg|bmp|heic|heif|tiff|avif)$/i, '');
     
      return withoutExt;
    } catch {
      return fileName;
    }
  }

  // 本地持久化：保存到磁盘/本地存储（使用文件名作为键）
  private async saveToLocal(
    fileName: string,
    mime: string,
    data: Uint8Array,
  ): Promise<void> {
    try {
      const localKey = this.getLocalKey(fileName);
      console.log('[OSS][saveToLocal]: start', { fileName, localKey, mime, size: data?.length, platform: Platform.OS });
      if (Platform.OS === 'web') {
        // 使用 localStorage 保存 base64，按文件名为键
        const base64 = this.arrayBufferToBase64(data);
        const payload = JSON.stringify({ mime, base64 });
        window.localStorage.setItem(`oss_cache_${localKey}`, payload);
        console.log('[OSS][saveToLocal][web]: saved to localStorage', { key: `oss_cache_${localKey}`, saved: !!base64 });
        return;
      }

      // RN 平台，保存到缓存目录
      const dir = `${FileSystem.cacheDirectory}${this.LOCAL_DIR}/`;
      try { await FileSystem.makeDirectoryAsync(dir, { intermediates: true }); } catch {}
      const path = `${dir}${localKey}`;
      let base64: string;
      if (typeof BufferPolyfill !== 'undefined' && BufferPolyfill.from) {
        base64 = BufferPolyfill.from(data).toString('base64');
      } else {
        base64 = this.arrayBufferToBase64(data);
      }
      await FileSystem.writeAsStringAsync(path, base64, { encoding: FileSystem.EncodingType.Base64 });
      // 记录 mime
      await FileSystem.writeAsStringAsync(`${path}.mime`, mime, { encoding: FileSystem.EncodingType.UTF8 });
      console.log('[OSS][saveToLocal][rn]: saved to file', { path, mimePath: `${path}.mime` });
    } catch (e) {
      console.warn('保存本地缓存失败:', e);
    }
  }

  // 本地持久化读取。
  // 返回可用于 <Image source={{uri}} /> 的 uri：
  // - Web: data URL
  // - RN: data URL（优先）或 file:// 路径（兜底）
  private async readFromLocal(fileName: string): Promise<string | undefined> {
    try {
      const localKey = this.getLocalKey(fileName);
     
      if (Platform.OS === 'web') {
        const raw = window.localStorage.getItem(`oss_cache_${localKey}`);
        
        if (!raw) return undefined;
        try {
          const obj = JSON.parse(raw) as { mime?: string; base64?: string };
          if (obj?.base64 && obj?.mime) {
            return `data:${obj.mime};base64,${obj.base64}`;
          }
        } catch { return undefined; }
        return undefined;
      }

      const dir = `${FileSystem.cacheDirectory}${this.LOCAL_DIR}/`;
      const path = `${dir}${localKey}`;
      const info = await FileSystem.getInfoAsync(path);
      
      if (!info.exists) return undefined;
      // 读取 mime 并返回 data URL（更稳，不依赖扩展名）
      try {
        const mimePath = `${path}.mime`;
        const mimeInfo = await FileSystem.getInfoAsync(mimePath);
       
        if (mimeInfo.exists) {
          const mime = await FileSystem.readAsStringAsync(mimePath, { encoding: FileSystem.EncodingType.UTF8 });
          const base64 = await FileSystem.readAsStringAsync(path, { encoding: FileSystem.EncodingType.Base64 });
          
          if (mime && base64) return `data:${mime};base64,${base64}`;
        }
      } catch {}
      // 兜底：返回 file 路径
    
      return `file://${path}`;
    } catch (e) {
      console.warn('读取本地缓存失败:', e);
      return undefined;
    }
  }

  private constructor(private platformAdapter: PlatformAdapter) {}

  static getInstance(platformAdapter: PlatformAdapter): CoreOssClient {
    if (!this.instance) {
      this.instance = new CoreOssClient(platformAdapter);
    }
    return this.instance;
  }

  // 生成文件内容哈希
  private async generateFileHash(file: PlatformFile): Promise<string> {
    const content = await this.platformAdapter.getFileContent(file);
    const uint8Array = new Uint8Array(content);
    let hash = 0;
    for (let i = 0; i < uint8Array.length; i++) {
      hash = ((hash << 5) - hash + uint8Array[i]) & 0xffffffff;
    }
    return hash.toString(16);
  }

  // 生成缓存键
  private generateCacheKey(file: PlatformFile, userID: string): string {
    return `${userID}_${file.name}_${file.size}_${file.lastModified}`;
  }

  private async initClient(): Promise<OSS> {
    const now = Date.now();
    console.log('initClient被调用，当前状态:', {
      hasClient: !!this.client,
      hasAuthInfo: !!this.authInfo,
      timeSinceLastAuth: now - this.lastAuthTime,
      authExpireTime: this.AUTH_EXPIRE_TIME,
      authFailureCount: this.authFailureCount
    });
    
    // 检查是否因为认证失败过多而被阻止
    if (this.authFailureCount >= this.MAX_AUTH_FAILURES) {
      if (now - this.lastAuthFailureTime < this.AUTH_FAILURE_RESET_TIME) {
        const waitTime = Math.ceil((this.AUTH_FAILURE_RESET_TIME - (now - this.lastAuthFailureTime)) / 60000);
        console.log(`认证失败次数过多，需要等待${waitTime}分钟`);
        throw new Error(`认证失败次数过多，请等待${waitTime}分钟后重试`);
      } else {
        // 重置计数器
        console.log('重置认证失败计数器');
        this.authFailureCount = 0;
        this.lastAuthFailureTime = 0;
      }
    }
    
    if (
      !this.client ||
      !this.authInfo ||
      now - this.lastAuthTime > this.AUTH_EXPIRE_TIME
    ) {
      console.log('需要重新初始化OSS客户端');
      if (this.initPromise) {
        console.log('使用现有的初始化Promise');
        return this.initPromise;
      }

      console.log('创建新的初始化Promise');
      this.initPromise = (async () => {
        try {
          // 尝试从存储获取认证信息
          const storedAuthInfo = await this.platformAdapter.getAuthInfo();
          if (
            storedAuthInfo &&
            storedAuthInfo.lastAuthTime &&
            storedAuthInfo.expirationTime &&
            now - storedAuthInfo.lastAuthTime < storedAuthInfo.expirationTime
          ) {
            console.log('使用存储的认证信息');
            this.authInfo = storedAuthInfo;
            this.lastAuthTime = storedAuthInfo.lastAuthTime;
          } else {
            // 重新获取认证信息
            console.log('重新获取OSS认证信息...');
            const res = await getOssAuthInfo({ossVendor: 'aliyun'});
            if (!res.data) {
              throw new Error('获取OSS认证信息失败：API返回空数据');
            }
            
            // 验证返回的数据结构
            if (!res.data.region || !res.data.accessKeyID || !res.data.accessKeySecret || !res.data.securityToken) {
              throw new Error('获取OSS认证信息失败：返回数据格式不正确');
            }
            
            console.log('获取到新的认证信息');
            this.authInfo = res.data;
            this.lastAuthTime = Date.now();

            // 存储认证信息
            await this.platformAdapter.storeAuthInfo({
              ...this.authInfo,
              lastAuthTime: this.lastAuthTime,
            });
          }

          console.log('创建OSS客户端实例...');
          this.client = new OSS({
            region: this.authInfo.region,
            accessKeyId: this.authInfo.accessKeyID,
            accessKeySecret: this.authInfo.accessKeySecret,
            stsToken: this.authInfo.securityToken,
            bucket: 'liangzai-dev-p138',
            secure: true,
            timeout: 60000,
            cname: false,
          });
          console.log('OSS客户端创建成功');
          return this.client;
        } catch (error) {
          console.error('初始化OSS客户端失败:', error);
          // 增加认证失败计数
          this.authFailureCount++;
          this.lastAuthFailureTime = Date.now();
          // 清除可能损坏的认证信息
          this.authInfo = null;
          this.lastAuthTime = 0;
          await this.platformAdapter.clearAuthInfo();
          throw error;
        }
      })();

      try {
        const client = await this.initPromise;
        this.initPromise = null;
        return client;
      } catch (err) {
        this.initPromise = null;
        throw err;
      }
    }
    console.log('使用现有的OSS客户端');
    return this.client;
  }

  async upload(file: any, userID: string): Promise<string> {
    try {
      const platformFile = await this.platformAdapter.convertFile(file);
      const cacheKey = this.generateCacheKey(platformFile, userID);

      // 检查上传缓存
      const now = Date.now();
      const cached = this.uploadCache.get(cacheKey);
      if (cached && now - cached.timestamp < this.UPLOAD_CACHE_EXPIRE_TIME) {
        return cached.fileName;
      }

      const client = await this.initClient();
      const uploadPath = userID + '/ossimg_';
      const fileName = uploadPath + platformFile.name;

      const fileContent =
        await this.platformAdapter.getFileContent(platformFile);
      
      console.log('当前平台:', Platform.OS);
      console.log('文件内容类型:', typeof fileContent);
      console.log('文件内容构造函数:', fileContent.constructor.name);
      console.log('文件内容长度:', fileContent.length);
      
      // 根据平台选择合适的文件类型转换策略
      let bufferContent: any;
      
      if (Platform.OS === 'web') {
        // Web环境：优先使用Blob，回退到Uint8Array
        if (typeof Blob !== 'undefined') {
          try {
            const arrayBuffer = fileContent.buffer;
            if (arrayBuffer instanceof ArrayBuffer) {
              bufferContent = new Blob([arrayBuffer], { type: platformFile.type });
              console.log('Web环境：成功转换为Blob');
            } else {
              // 处理SharedArrayBuffer
              const newArrayBuffer = arrayBuffer.slice(0) as unknown as ArrayBuffer;
              bufferContent = new Blob([newArrayBuffer], { type: platformFile.type });
              console.log('Web环境：成功转换为Blob (从SharedArrayBuffer)');
            }
          } catch (error) {
            console.warn('Web环境：Blob创建失败，使用Uint8Array:', error);
            bufferContent = fileContent;
          }
        } else {
          console.log('Web环境：Blob不可用，使用Uint8Array');
          bufferContent = fileContent;
        }
      } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // React Native环境：优先使用Buffer
        if (typeof BufferPolyfill !== 'undefined' && BufferPolyfill.from) {
          try {
            bufferContent = BufferPolyfill.from(fileContent);
            console.log('React Native环境：成功转换为Buffer');
          } catch (error) {
            console.warn('React Native环境：Buffer转换失败，使用Uint8Array:', error);
            bufferContent = fileContent;
          }
        } else {
          console.log('React Native环境：Buffer不可用，使用Uint8Array');
          bufferContent = fileContent;
        }
      } else {
        // 其他环境（如Node.js）：使用Buffer
        if (typeof BufferPolyfill !== 'undefined' && BufferPolyfill.from) {
          try {
            bufferContent = BufferPolyfill.from(fileContent);
            console.log('其他环境：成功转换为Buffer');
          } catch (error) {
            console.warn('其他环境：Buffer转换失败，使用Uint8Array:', error);
            bufferContent = fileContent;
          }
        } else {
          console.log('其他环境：Buffer不可用，使用Uint8Array');
          bufferContent = fileContent;
        }
      }
      
      console.log('转换后的内容类型:', typeof bufferContent);
      console.log('转换后的内容构造函数:', bufferContent.constructor.name);
      
      const result = await client.put(fileName, bufferContent, {
        headers: {
          'Content-Type': platformFile.type,
        },
      });
      console.log('[OSS][upload]: put done', { fileName, contentType: platformFile.type, url: result?.url });

      if (!result?.url) {
        throw new Error('上传失败：未获取到文件URL');
      }

      // 写入本地持久化缓存（按文件名）
      try {
        let toSave: Uint8Array;
        if (Platform.OS === 'web' && bufferContent instanceof Blob) {
          const ab = await bufferContent.arrayBuffer();
          toSave = new Uint8Array(ab);
        } else {
          toSave = this.toUint8Array(bufferContent);
        }
        await this.saveToLocal(fileName, platformFile.type, toSave);
        console.log('[OSS][upload]: saved to local');
      } catch (e) {
        console.warn('上传后保存本地失败:', e);
      }

      // 更新上传缓存（内存索引，避免同一会话重复 put）
      this.uploadCache.set(cacheKey, {
        fileName,
        timestamp: now,
      });

      return fileName;
    } catch (error:any) {
      if(error.status===403){
        console.log('上传文件失败:', JSON.stringify(error));
        await this.clearAuthInfo();
        await this.initClient();
        return await this.upload(file, userID);
      }
      
      console.error('上传文件失败:', JSON.stringify(error));
      throw error;
    }
  }

  async getImage(fileName: string, retryCount: number = 0): Promise<string> {
    if (!fileName) return '';

    // 优先读本地
    try {
      const local = await this.readFromLocal(fileName);
      if (local) return local;
    } catch {}

    // 防止无限递归
    if (retryCount >= 3) {
      console.error(`获取图片 ${fileName} 失败：已达到最大重试次数`);
      throw new Error(`获取图片失败：已达到最大重试次数`);
    }

    // 检查缓存
    const now = Date.now();
    const cached = this.fileCache.get(fileName);
    if (cached && now - cached.timestamp < this.CACHE_EXPIRE_TIME) {
      return cached.data;
    }

    // 检查是否已经有正在进行的请求
    const existingRequest = this.pendingRequests.get(fileName);
    if (existingRequest) {
      return existingRequest;
    }

    // 创建新的请求
    const requestPromise = (async () => {
      try {
        const client = await this.initClient();
        const result = await client.get(fileName, {
          headers: {
            'Content-Type': 'image/jpeg',
          },
        });
      

        if (!result) {
          return '';
        }

        // 兼容Web环境：将图片内容转换为base64，并始终保存本地
        let base64: string;
        const uint8ArrayForSave = this.toUint8Array(result.content);
        if (typeof BufferPolyfill !== 'undefined' && BufferPolyfill.from) {
          // 有 BufferPolyfill 时也统一保存本地
          base64 = BufferPolyfill.from(result.content).toString('base64');
        } else {
          // Web环境：使用Uint8Array转换为base64
          // 使用更安全的方法处理大文件
          if (uint8ArrayForSave.length > 1000000) {
            base64 = this.arrayBufferToBase64(uint8ArrayForSave);
          } else {
            base64 = btoa(String.fromCharCode(...uint8ArrayForSave));
          }
        }
        // 保存本地（移动到公共位置，避免遗漏）
        try {
          const mime = result.res.headers['content-type'] || 'image/jpeg';
          await this.saveToLocal(fileName, mime, uint8ArrayForSave);
        } catch (e) { console.warn('图片保存本地失败:', e); }
        
        const fileData = `data:${result.res.headers['content-type']};base64,${base64}`;

        // 更新缓存
        this.fileCache.set(fileName, {
          data: fileData,
          timestamp: now,
        });

        return fileData;
      } catch (error: any) {
        console.error(`获取图片 ${fileName} 失败 (重试次数: ${retryCount}):`, error);
        
        if (error.status === 403 && retryCount < 3) {
          console.log(`尝试重新认证 (第${retryCount + 1}次重试)...`);
          try {
            await this.clearAuthInfo();
            await this.initClient();
            // 递归调用时传递递增的retryCount
            return await this.getImage(fileName, retryCount + 1);
          } catch (retryError) {
            console.error('重试过程中发生错误:', retryError);
            throw retryError;
          }
        } else {
          // 超过重试次数或其他错误，直接抛出
          throw error;
        }
      } finally {
        // 请求完成后从pendingRequests中移除
        this.pendingRequests.delete(fileName);
      }
    })();

    // 将请求添加到pendingRequests中
    this.pendingRequests.set(fileName, requestPromise);

    return requestPromise;
  }

  async getFile(fileName: string, retryCount: number = 0): Promise<string> {
    if (!fileName) return '';

    // 优先读本地
    try {
      const local = await this.readFromLocal(fileName);
      console.log('[OSS][getFile]: local hit?', { fileName, hit: !!local });
      if (local) return local;
    } catch {}

    // 防止无限递归
    if (retryCount >= 3) {
      console.error(`获取文件 ${fileName} 失败：已达到最大重试次数`);
      throw new Error(`获取文件失败：已达到最大重试次数`);
    }

    // 检查缓存
    const now = Date.now();
    const cached = this.fileCache.get(fileName);
    if (cached && now - cached.timestamp < this.CACHE_EXPIRE_TIME) {
      return cached.data;
    }

    // 检查是否已经有正在进行的请求
    const existingRequest = this.pendingRequests.get(fileName);
    if (existingRequest) {
      return existingRequest;
    }

    // 创建新的请求
    const requestPromise = (async () => {
      try {
        console.log(`开始获取文件: ${fileName}, 重试次数: ${retryCount}`);
        const client = await this.initClient();
        console.log('OSS客户端初始化成功');
        
        const result = await client.get(fileName);
        console.log('[OSS][getFile]: network fetched');
        console.log('OSS get请求完成', result ? '有结果' : '无结果');

        if (!result) {
          return '';
        }

        console.log('开始处理文件内容...');
        // 兼容Web环境：将文件内容转换为base64
        let base64: string;
        const uint8ArrayForSave = this.toUint8Array(result.content);
        if (typeof BufferPolyfill !== 'undefined' && BufferPolyfill.from) {
          // Node.js环境
          console.log('使用Node.js Buffer处理');
          base64 = BufferPolyfill.from(result.content).toString('base64');
        } else {
          // Web环境：使用Uint8Array转换为base64
          console.log('使用Web环境Uint8Array处理');
          console.log('result.content类型:', typeof result.content);
          console.log('result.content构造函数:', result.content?.constructor?.name);
          
          let uint8Array: Uint8Array;
          try {
            uint8Array = uint8ArrayForSave;
            if (!uint8Array || typeof uint8Array.length !== 'number') {
              throw new Error(`无法处理的文件内容类型: ${typeof result.content}`);
            }
            
            console.log('Uint8Array创建成功，长度:', uint8Array.length);
            
            // 使用更高效的方法处理大文件，避免展开操作符导致的调用栈溢出
            if (uint8Array.length > 1000000) { // 大于1MB的文件使用分块处理
              console.log('文件较大，使用分块处理...');
              base64 = this.arrayBufferToBase64(uint8Array);
            } else {
              console.log('文件较小，使用展开操作符处理...');
              base64 = btoa(String.fromCharCode(...uint8Array));
            }
            // 保存本地（移动到公共位置，避免遗漏）
          } catch (error: any) {
            console.error('处理文件内容时出错:', error);
            throw new Error(`处理文件内容失败: ${error.message || '未知错误'}`);
          }
        }
        // 统一保存本地
        try {
          const mime = result.res?.headers?.['content-type'] || 'application/octet-stream';
          await this.saveToLocal(fileName, mime, uint8ArrayForSave);
        } catch (e) { console.warn('文件保存本地失败:', e); }
        
        console.log('base64转换完成，长度:', base64.length);
        const fileData = `data:${result.res.headers['content-type']};base64,${base64}`;
        console.log('文件数据URL创建完成');

        // 更新缓存
        this.fileCache.set(fileName, {
          data: fileData,
          timestamp: now,
        });

        return fileData;
      } catch (error: any) {
        console.error(`获取文件 ${fileName} 失败 (重试次数: ${retryCount}):`, error);
        
        if (error.status === 403 && retryCount < 3) {
          console.log(`尝试重新认证 (第${retryCount + 1}次重试)...`);
          try {
            await this.clearAuthInfo();
            await this.initClient();
            // 递归调用时传递递增的retryCount
            return await this.getFile(fileName, retryCount + 1);
          } catch (retryError) {
            console.error('重试过程中发生错误:', retryError);
            throw retryError;
          }
        } else {
          // 超过重试次数或其他错误，直接抛出
          throw error;
        }
      } finally {
        // 请求完成后从pendingRequests中移除
        this.pendingRequests.delete(fileName);
      }
    })();

    // 将请求添加到pendingRequests中
    this.pendingRequests.set(fileName, requestPromise);

    return requestPromise;
  }

  // 缓存管理方法
  clearImageCache(fileName?: string) {
    if (fileName) {
      this.fileCache.delete(fileName);
    } else {
      this.fileCache.clear();
    }
  }

  clearUploadCache(cacheKey?: string) {
    if (cacheKey) {
      this.uploadCache.delete(cacheKey);
    } else {
      this.uploadCache.clear();
    }
  }
  clearAuthInfo() {
    this.authInfo = null;
    this.lastAuthTime = 0;
    this.platformAdapter.clearAuthInfo();
  }

  clearAllPendingRequests() {
    this.pendingRequests.clear();
  }

  // 辅助方法：将Uint8Array转换为base64，使用分块处理避免内存问题
  private arrayBufferToBase64(uint8Array: Uint8Array): string {
    const chunkSize = 100000; // 每次处理100KB
    const len = uint8Array.byteLength;
    let binary = '';
    
    // 分块处理大文件
    for (let i = 0; i < len; i += chunkSize) {
      const end = Math.min(i + chunkSize, len);
      for (let j = i; j < end; j++) {
        binary += String.fromCharCode(uint8Array[j]);
      }
      
      // 每处理完一个块，检查是否需要清理内存
      if (i % (chunkSize * 10) === 0) {
        console.log(`处理进度: ${Math.round((i / len) * 100)}%`);
      }
    }
    
    try {
      return btoa(binary);
    } catch (error) {
      console.error('btoa转换失败:', error);
      throw new Error('base64转换失败');
    } finally {
      // 清理大字符串，释放内存
      binary = '';
    }
  }
}
