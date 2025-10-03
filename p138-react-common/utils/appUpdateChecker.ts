import {NativeModules, Platform} from 'react-native';

// 只在非 Web 环境下导入 RNFS
let RNFS: any = null;
if (Platform.OS !== 'web') {
  try {
    RNFS = require('react-native-fs');
  } catch (error) {
    console.warn('Failed to load react-native-fs:', error);
  }
}

const { InstallAPKModule } = NativeModules;

interface UpdateResponse {
  latestVersion: string;
  downloadUrl: string;
  releaseNotes?: string;
  forceUpdate?: boolean;
}

interface DownloadProgress {
  bytesWritten: number;
  contentLength: number;
}

interface UpdateOptions {
  currentVersion: string;
  downloadUrl: string;
  onProgress?: (progress: number) => void;
  onSuccess?: (filePath: string) => void;
  onError?: (error: string) => void;
  onPermissionDenied?: () => void;
}

// 比较版本号
const compareVersions = (v1: string, v2: string): number => {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    
    if (v1Part > v2Part) return 1;
    if (v1Part < v2Part) return -1;
  }
  return 0;
};

// 清理旧的APK文件
const cleanupOldFiles = async () => {
  if (Platform.OS === 'web') return;
  
  try {
    const files = await RNFS.readDir(RNFS.ExternalCachesDirectoryPath);
    const apkFiles = files.filter((file: { name: string }) => file.name.endsWith('.apk'));
    
    for (const file of apkFiles) {
      try {
        await RNFS.unlink(file.path);
        console.log(`已删除旧文件: ${file.name}`);
      } catch (err) {
        console.warn(`删除文件失败: ${file.name}`, err);
      }
    }
  } catch (err) {
    console.warn('清理旧文件失败', err);
  }
};

// 检查未知来源安装权限
export const checkInstallPermission = async (onPermissionDenied?: () => void): Promise<boolean> => {
  if (Platform.OS !== "android") {
    return true;
  }

  try {
    const hasPermission = await InstallAPKModule.checkInstallPermission();
    if (!hasPermission) {
      onPermissionDenied?.();
      return false;
    }
    return true;
  } catch (error) {
    console.error("检查安装权限失败", error);
    return false;
  }
};

// 检查更新
export const checkForUpdate = async (options: UpdateOptions): Promise<UpdateResponse | null> => {
  const { currentVersion, onError,downloadUrl } = options;
  const downloadURL =downloadUrl;

  try {
    // 模拟服务器返回的最新版本信息
    const response: UpdateResponse = {
      latestVersion: "2.0.0",
      downloadUrl: downloadURL + "?" + new Date().getTime(),
      releaseNotes: "1. 修复已知问题\n2. 优化用户体验",
      forceUpdate: false
    };

    const versionComparison = compareVersions(response.latestVersion, currentVersion);
    return versionComparison > 0 ? response : null;
  } catch (error) {
    console.error("检查更新失败", error);
    onError?.("检查更新失败，请稍后再试");
    return null;
  }
};

// 下载更新
export const downloadUpdate = async (downloadUrl: string, options: UpdateOptions): Promise<string | null> => {
  const { onProgress, onSuccess, onError, onPermissionDenied } = options;

  if (Platform.OS === 'web') {
    // Web 环境下直接打开下载链接
    window.open(downloadUrl, '_blank');
    return null;
  }

  if (Platform.OS !== "android") {
    onError?.("iOS 需要通过 App Store 更新");
    return null;
  }

  try {
    // 清理旧文件
    await cleanupOldFiles();

    // 生成唯一的文件名
    const fileName = `P138_B${Date.now()}.apk`;
    const localPath = `${RNFS.ExternalCachesDirectoryPath}/${fileName}`;

    console.log("开始下载:", localPath);

    const ret = await RNFS.downloadFile({
      fromUrl: downloadUrl,
      toFile: localPath,
      progress: (res: DownloadProgress) => {
        const progress = (res.bytesWritten / res.contentLength) * 100;
        console.log(`下载进度: ${progress.toFixed(2)}%`);
        onProgress?.(progress / 100);
      },
      progressDivider: 1
    }).promise;

    if (ret.statusCode !== 200) {
      throw new Error(`下载失败，HTTP ${ret.statusCode}`);
    }

    // 验证文件大小
    const fileInfo = await RNFS.stat(localPath);
    if (fileInfo.size === 0) {
      throw new Error("下载的文件大小为0");
    }

    onSuccess?.(localPath);
    return localPath;
  } catch (error) {
    console.error("下载失败", error);
    onError?.("下载失败，请稍后再试");
    return null;
  }
};

export const toAllowInstallSetting = async () => {
  if(Platform.OS !== "android"){
    return;
  }
  await InstallAPKModule.allowInstallSetting();
}

// 安装APK
export const installAPK = async (filePath: string, onError?: (error: string) => void, onPermissionDenied?: () => void): Promise<boolean> => {
  if (Platform.OS !== "android") {
    onError?.("仅支持 Android 平台");
    return false;
  }

  // 检查安装权限
  const hasPermission = await checkInstallPermission(onPermissionDenied);
  if (!hasPermission) {
    return false;
  }

  try {
    await InstallAPKModule.install(filePath);
    return true;
  } catch (error) {
    console.error("安装失败", error);
    onError?.("安装失败，请稍后再试");
    return false;
  }
};
