import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Clipboard,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import QRCode from 'react-native-qrcode-svg';
import {useUserStore} from 'src/store/user';
import ViewShot from 'react-native-view-shot';
import {router} from 'expo-router';
import {captureRef} from 'react-native-view-shot';
import {env} from '@/config/env';
import commonStyles from '@/p138-react-common/utils/styles';
import {IMAGE_SIZE} from '@/p138-react-common/utils/styles/theme';
import { kScreenHeight, kScreenWidth } from '@/p138-react-common/utils/styles';

const QRCodeSharePage = () => {
  const {loginInfo, shopInfo} = useUserStore();
  const userID = loginInfo?.userID;
  const [referralUrl, setReferralUrl] = useState<string>();
  const [showLeft, setShowLeft] = useState<boolean>(true);
  const viewShotRef = useRef<ViewShot>(null);

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
    if (userID) {
      setReferralUrl(
        `${env.H5_Client_URL}/register?${loginInfo.referralUrl}&userType=1`,
      );
      // 请求存储权限
      //   requestStoragePermission().then(granted => {
      //     console.log(granted);
      //     if (!granted) {
      //       ToastAndroid.show('存储权限被拒绝，无法保存截图', ToastAndroid.LONG);
      //     }
      //   });
    }
  }, [
    loginInfo?.referralUrl,
    loginInfo?.shopCode,
    loginInfo?.username,
    userID,
  ]);

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
          Toast.show('图片保存成功！');
        } else {
          Toast.show('图片保存失败！');
        }
      } else {
        Toast.show('viewShotRef 未设置');
      }
      setShowLeft(true); // 恢复隐藏部分
    } catch (error) {
      Toast.show('截图保存失败:' + error);
      setShowLeft(true); // 恢复隐藏部分
    }
  };

  // 复制链接到剪贴板
  const copyToClipboard = () => {
    if (referralUrl) {
      Clipboard.setString(referralUrl);
      //   ToastAndroid.show('链接已复制到剪贴板', ToastAndroid.SHORT);
      Toast.show('链接已复制到剪贴板');
    } else {
      //   ToastAndroid.show('未生成链接', ToastAndroid.SHORT);
      Toast.show('未生成链接');
    }
  };

  return (
    <ViewShot
      style={[{width:kScreenWidth,height:kScreenHeight}]}
      ref={viewShotRef}
      options={{format: 'png', quality: 0.9}}>
      <ImageBackground
        source={require('src/assets/imgs/gendan/gendan_detail_share_bg.webp')}
        className=" items-center"
        style={{width:kScreenWidth,height:kScreenHeight}}
        resizeMode="stretch">
        {showLeft && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={defaultBackPress}
            className="absolute left-4 top-4 w-5 h-2.5">
            <Image
              style={IMAGE_SIZE.IMAGE_SIZE20}
              source={require('src/assets/imgs/home/icon_back_arrow.png')}
            />
          </TouchableOpacity>
        )}
        <Image
          source={require('src/assets/imgs/gendan/gendan_share_title.png')}
          style={styles.topTitleImage}
        />
        <Image
          source={require('src/assets/imgs/gendan/gendan_share_tips.png')}
          style={[styles.topTitleImage, {height: 30, marginTop: kScreenHeight*0.01}]}
        />

        {/* 图片上叠加二维码 */}
        <ImageBackground
          style={styles.codeCardBackground}
          source={require('src/assets/imgs/gendan/gendan_share_qr_bg.webp')}>
          <ImageBackground
            style={[styles.cardTitle, {width: 170, height: kScreenHeight*0.05}]}
            resizeMode="stretch"
            source={require('src/assets/imgs/gendan/detail_share_bg_btn.png')}>
            <Text style={{color: 'white', fontSize: 16}}>
              店铺：{shopInfo?.shopName}
            </Text>
          </ImageBackground>
          <View style={styles.QRCodeSize}>
            <View
              style={{
                backgroundColor: '#fff',
                width: kScreenWidth*0.5,
                height: kScreenWidth*0.5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {referralUrl && (
                <QRCode
                  value={referralUrl}
                  size={kScreenWidth*0.45}
                  color="black"
                  backgroundColor="white"
                  logoSize={0}
                  logoBackgroundColor="transparent"
                />
              )}
            </View>
          </View>
          <Text style={{color: 'red', fontSize: 16,marginTop:10}}>
            扫描上方二维码，开启幸运之路
          </Text>
          <Text style={{fontSize: 16,marginTop:8}}>——正规实体店出票——</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={1}
              onPress={takeScreenshotAndSave}>
              <Text style={styles.buttonText}>保存图片</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ImageBackground>
    </ViewShot>
  );
};

const styles = StyleSheet.create({
  topTitleImage: {
    marginTop: 35,
    width: '100%',
    height: kScreenHeight*0.06,
    resizeMode: 'contain',
  },
  codeCardBackground: {
    padding: kScreenHeight*0.02,
    width: kScreenWidth*0.8,
    height: kScreenWidth*0.8 * 1.51,
    resizeMode: 'stretch',
    alignItems: 'center',
    marginTop: kScreenHeight*0.01,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop:  kScreenWidth*0.32,
    color: '#ff3366',
    // marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  button: {
    backgroundColor: 'orange',
    borderRadius: 5,
    paddingVertical: 10,
    width:'100%',
    paddingHorizontal: 8,
    justifyContent:'center',
    alignItems:'center',
    marginTop:30
    // color:'black'
  },
  buttonText: {
    // color: 'white',
    fontSize: 20,
    fontWeight:'bold'
  },
 
  QRCodeSize: {
    width: kScreenWidth*0.55,
    height: kScreenWidth*0.55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    borderRadius: 8,
  },
});

export default QRCodeSharePage;
