import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useUserStore } from 'src/store/user';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot'; // 使用 react-native-view-shot
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { env } from '@/config/env';
 

// 生成二维码页面
const QRCodePage = () => {
  const { loginInfo } = useUserStore();
  const [referralUrl, setReferralUrl] = useState<string>();
  const [showLeft, setShowLeft] = useState<boolean>(true);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  // ref 用于捕获组件视图
  const viewShotRef = useRef<View>(null);

  // 返回按钮
  const defaultBackPress = () => {
    if(router.canGoBack()){
      router.back();
    }else{
      router.replace('/Home');
    }
  };
  // 初始化，生成二维码 URL
  useEffect(() => {
    if (loginInfo) {
      setReferralUrl(`${env.H5_Client_URL}/register?${loginInfo?.referralUrl}&userType=1`);
    }
  }, [loginInfo]);
  useEffect(() => {
    if (status && status.status !== 'granted') {
      requestPermission();
    }
  }, [status]);

  // 截图并保存
  const takeScreenshotAndSave = async () => {
    setShowLeft(false); // 隐藏不需要截图的部分
    try {
      // 确保视图已经渲染并且 ref 指向有效的组件
      if (viewShotRef.current) {
        // 使用 react-native-view-shot 截取页面
        const uri = await captureRef(viewShotRef, {
          height: 440,
          quality: 1,
        });
        console.log('Screenshot captured at:', uri);

        await MediaLibrary.saveToLibraryAsync(uri);
        if (uri) {
          console.log('图片保存成功！');
        }
      } else {
        console.error('viewShotRef is not set correctly');
      }
      
      setShowLeft(true); // 恢复隐藏部分
    } catch (error) {
      console.error('截图保存失败:', error);
      setShowLeft(true); // 恢复隐藏部分
    }
  };

  // 复制链接到剪贴板
  const copyToClipboard = () => {
    if (referralUrl) {
      Clipboard.setStringAsync(referralUrl);
      Toast.show('链接已复制到剪贴板');
    } else {
      console.log('未生成链接');
    }
  };

  return (
    <View
      style={styles.container}
      ref={viewShotRef}
      collapsable={false}>
      <ImageBackground
        source={require('src/assets/imgs/invite/user_bg.png')}
        style={styles.backgroundImage}>
        {showLeft && (
          <TouchableOpacity
            onPress={defaultBackPress}
            style={styles.leftRoot}>
            <Image
              style={styles.left}
              source={require('src/assets/imgs/invite/arrow-left.png')}
            />
          </TouchableOpacity>
        )}
        <Image
          source={require('src/assets/imgs/invite/user_desc.png')}
          style={styles.header}
        />

        {/* 图片上叠加二维码 */}
        <ImageBackground
          style={styles.card}
          source={require('src/assets/imgs/invite/user_code.png')}>
          <Text style={styles.cardTitle}>安全可靠 扫码下载</Text>
          <View style={styles.QRCodeSize}>
            {referralUrl && (
              <QRCode
                value={referralUrl}
                size={130}
                color='black'
                backgroundColor='white'
                logoSize={0}
                logoBackgroundColor='transparent'
              />
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.button}
              onPress={takeScreenshotAndSave}>
              <Text style={styles.buttonText}>保存图片</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.button}
              onPress={copyToClipboard}>
              <Text style={styles.buttonText}>复制链接</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('src/assets/imgs/mine/share1.png')}
            style={styles.footer}
          />
        </ImageBackground>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  leftRoot: {
    position: 'absolute',
    left: 15,
    top: 15,
    width: 50,
    height: 25,
  },
  left: {
    width: 25,
    height: 25,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  header: {
    marginTop: 50,
    width: '100%',
    height: 26,
    resizeMode: 'contain',
  },
  card: {
    padding: 20,
    width: 230,
    height: 230 * 1.51,
    resizeMode: 'stretch',
    alignItems: 'center',
    marginTop: 50,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff3366',
    marginVertical: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 35,
  },
  button: {
    backgroundColor: '#ff3366',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  footer: {
    width: 250,
    height: 100,
    resizeMode: 'stretch',
  },
  QRCodeSize: {
    width: 130,
    height: 130,
  },
});

export default QRCodePage;
