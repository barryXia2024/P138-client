import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Image,
  NativeModules,
} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';

// import DeviceInfo from 'react-native-device-info';
// import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUserStore} from 'src/store/user';
import RightTextButton from '@/p138-react-common/components/RightTextButton';

import {router, useNavigation} from 'expo-router';
import {env} from '@/config/env';
import {createSignOut} from 'src/api/interface/users-auth';
const {InstallAPK} = NativeModules;
const downloadURL = env.H5_Client_URL + '/download/138.apk';

;
import { checkForUpdate, checkInstallPermission, downloadUpdate, installAPK, toAllowInstallSetting } from '@/p138-react-common/utils/appUpdateChecker';
import {CustomModal} from '@/p138-react-common/components';
 
 
import { useHotUpdate } from './components/hotfix/useHotfiex';
import { loginOut } from 'src/api/request';
const Setting: React.FC = () => {
  // const [avatarImg, setAvatarImg] = useState<string>();
  // const [isUpdating, setIsUpdating] = useState(false);
  const { message,checkUpdate } = useHotUpdate();
  const [currentVersion, setCurrentVersion] = useState('');
  const [progress, setProgress] = useState(0);
  const {resetUserStore, loginInfo} = useUserStore();
  const [isDownloading, setIsDownloading] = useState(false);
 

  // const appStatus = useAppStatus();
  useEffect(() => {
    // 获取当前应用版本
    // const version = DeviceInfo.getVersion();
    setCurrentVersion('1.0.0');
  }, []);
 // TODO: 
  // useEffect(() => {
  //   if (appStatus.appState === AppStatus.ACTIVE && filePath) {
  //     checkInstallPermission().then((hasPermission) => {
  //       if (hasPermission) {
  //         if (filePath) {
  //           installAPK(filePath);
  //           setFilePath(undefined);
  //         }
  //       } else {
  //         if (filePath) {
  //           Alert.alert("温馨提醒", "需要安装权限，请前往设置", [
  //             {
  //               text: "确定",
  //               onPress: () => {
  //                 toAllowInstallSetting();
  //               },
  //             },
  //           ]);
  //         }
  //       }
  //       setIsInstallPermission(hasPermission);
  //     });
  //   }
  // }, [appStatus]);


  const profileData =useMemo(() => [
    {id: 1, label: '清除缓存', type: 'text', value: '', editable: true},
    // {id: 2, label: '建议反馈', type: 'text', value: '', editable: true},
    {
      id: 3,
      label: '版本更新',
      type: 'text',
      value:  message,
      editable: true,
    },
    // {
    //   id: 4,
    //   label: '注销账号',
    //   type: 'text',
    //   value: '',
    //   editable: '',
    // },
  ], [message]);
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage 数据已清除');
    } catch (error) {
      console.error('清除 AsyncStorage 数据失败', error);
    }
  };
  const clearImageCache = () => {
    console.log('图片缓存已清除');
  };

  const checkAppForUpdate = async () => {
    const version = await checkForUpdate({
      currentVersion: currentVersion,
      downloadUrl: downloadURL,
    });
    setIsDownloading(true);
    downloadUpdate(version?.downloadUrl ?? "", {
      currentVersion: currentVersion,
      onProgress: (progress) => {
        setProgress(progress);
      },
      onSuccess: (filePath) => {
        // installAPK(filePath);
        checkInstallPermission().then((hasPermission) => {
          if (hasPermission) {
            installAPK(filePath);
          } else {
            setFilePath(filePath);
            Alert.alert("温馨提醒", "需要安装权限，请前往设置", [
              {
                text: "确定",
                onPress: () => {
                  toAllowInstallSetting();
                },
              },
            ]);
          
          }
        });

        // checkInstallPermission().then((hasPermission) => {
        //   if (hasPermission) {
        //     installAPK(filePath);
        //   } else {
        //     setIsInstallPermission(false);
        //     setFilePath(filePath);
        //   }
        // });
        setIsDownloading(false);
      },
      onError: (error) => {
        console.error(`下载失败: ${error}`);
        setIsDownloading(false);
      },
      downloadUrl: downloadURL
      });
    };
  // 清除文件缓存
  const clearFileCache = async () => {
    try {
      //   const cacheDirectory = RNFS.CachesDirectoryPath; // 获取缓存目录路径
      //   const files = await RNFS.readDir(cacheDirectory); // 获取目录下的文件

      // 删除所有缓存文件
      //   for (const file of files) {
      //     await RNFS.unlink(file.path);
      //   }
      console.log('文件缓存已清除');
    } catch (error) {
      console.error('清除文件缓存失败', error);
    }
  };
  const onPress = (id: number) => {
    switch (id) {
      case 1:
        // modalizeRef.current?.open();
        clearAsyncStorage();
        clearImageCache();
        clearFileCache();

        globalThis.Toast.show('缓存清理成功！');
        loginOut();
        break;
      case 2:
        // props.navigation.push('UpdateNicknameScreen');
        break;
      case 3:
        // checkAppForUpdate();
        console.log('checkUpdate');
        checkUpdate();
        // props.navigation.push('UpdatePassWordScreen', {type: 'login'});
        break;
      case 4:
        // props.navigation.push('UpdatePassWordScreen', {type: 'pay'});
        break;
      case 5:
        // props.navigation.push('RealNameAuthScreen');
        break;
      case 6:
        // props.navigation.push('RealNameAuthScreen');
        break;
      default:
        break;
    }
  };
  
  // // 假设你从服务器获取最新版本信息
  // const checkForUpdate = async () => {
  //   try {
  //     // 模拟服务器返回的最新版本信息
  //     const response = {
  //       latestVersion: '2.0.0', // 最新版本
  //       downloadUrl: downloadURL + '?' + dayjs(), // 下载链接
  //     };

  //     // 比较版本，如果有更新则提示下载
  //     if (response.latestVersion !== currentVersion) {
  //       Alert.alert(
  //         '有新版本可用',
  //         `当前版本: ${currentVersion}, 新版本: ${response.latestVersion}`,
  //         [
  //           {
  //             text: '取消',
  //             style: 'cancel',
  //           },
  //           {
  //             text: '下载更新',
  //             onPress: () => downloadUpdate(response.downloadUrl),
  //           },
  //         ],
  //       );
  //     } else {
  //       Alert.alert('没有更新', '你已是最新版本');
  //     }
  //   } catch (error) {
  //     console.error('检查更新失败', error);
  //     Alert.alert('错误', '检查更新失败，请稍后再试');
  //   }
  // };

  // const downloadUpdate = (downloadUrl: string) => {
  //   if (Platform.OS === 'android') {
  //     // 下载 APK 文件
  //     //   const downloadDest = `${
  //     //     RNFS.DownloadDirectoryPath || RNFS.DocumentDirectoryPath
  //     //   }/138_${dayjs().valueOf()}.apk`;
  //     //   setLoadingInfo(true, '下载中，请稍后！！！！');
  //     //   const options = {
  //     //     fromUrl: downloadUrl,
  //     //     toFile: downloadDest,
  //     //     // begin: (res: any) => {
  //     //     //   console.log('开始下载', res);
  //     //     // },
  //     //     // progress: (res: any) => {
  //     //     //   let percentage = res.bytesWritten / res.contentLength;
  //     //     //   setProgress(percentage);
  //     //     // },
  //     //   };
  //     //   RNFS.downloadFile(options)
  //     //     .promise.then(() => {
  //     //       setLoadingInfo(false);
  //     //       //   Alert.alert('下载完成', '点击安装更新');
  //     //       //   console.log(downloadDest);
  //     //       // 提供安装 APK 的方法（Android）
  //     //       installApk(downloadDest);
  //     //     })
  //     //     .catch(err => {
  //     //       console.error('下载失败', err);
  //     //       setLoadingInfo(false);
  //     //       Alert.alert('下载失败', '请稍后再试');
  //     //     });
  //   } else {
  //     Alert.alert('iOS 更新', 'iOS 需要通过 App Store 更新');
  //   }
  // };

  const installApk = async (filePath: string) => {
    try {
      // 调用原生模块的安装方法
      InstallAPK.installAPK(
        filePath,
        (message: string) => {
          console.log('Install success:', message); // 安装成功的回调
        },
        (error: string) => {
          console.error('Install failed:', error); // 安装失败的回调
        },
      );
    } catch (error) {
      console.error('Error installing APK:', error);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="设置" />
      <View style={styles.content}>
        {profileData.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.row}
            onPress={() => item.editable && onPress(item.id)}
            activeOpacity={item.editable ? 0.7 : 1}>
            <Text style={styles.label}>{item.label}</Text>
            <View className="flex-row items-center">
              <Text
                style={[styles.value, !item.editable && styles.nonEditable]}>
                {item.value}
              </Text>
              <RightTextButton />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <CustomModal isVisible={isDownloading}>
        <View className="w-[250px] h-[100px] bg-white rounded-lg items-center justify-center">
          <Text className="text-black text-[14px] font-bold">App下载中</Text>
          <Text className="text-gray-500 text-[12px] mt-2">
            {" "}
            （{parseFloat((progress * 100).toFixed(2))}%）,请稍后。。。
          </Text>
        </View>
      </CustomModal>
      <TouchableOpacity style={styles.loginButton} onPress={() => loginOut()}>
        <Text style={styles.loginButtonText}>退出登录</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 12,
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#999',
  },
  nonEditable: {
    color: '#333',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },

  handle: {
    backgroundColor: '#ccc',
    height: 0,
  },
  modal: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  sheetContent: {
    // padding: 20,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  option: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  cancel: {
    color: 'red',
    marginTop: 10,
    borderBottomWidth: 0,
  },
  loginButton: {
    backgroundColor: '#FF4B3A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
    marginTop: 100,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Setting;
