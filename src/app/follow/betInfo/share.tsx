import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import QRCode from 'react-native-qrcode-svg';
import {useUserStore} from 'src/store/user';
import ViewShot, {captureRef} from 'react-native-view-shot';
import {router, useLocalSearchParams} from 'expo-router';
import {env} from '@/config/env';
import {IMAGE_SIZE} from '@/p138-react-common/utils/styles/theme';

import { AvatarVIP } from '@/p138-react-common/components';
import {kScreenHeight, kScreenWidth} from '@/p138-react-common/utils/styles';

const QRCodeSharePage = () => {
  const {orderInfo, userInfo} = useLocalSearchParams();
  const loginInfo = useUserStore(state => state.loginInfo);
  const userInfoObj: ServerCommonAuth.GetUserInfoResult = JSON.parse(
    userInfo as string,
  );
  const orderInfoObj: CommonFollowHall.GetTrackingOrderItemResult = JSON.parse(
    orderInfo as string,
  );
  const userID = userInfoObj?.userID;

  const [referralUrl, setReferralUrl] = useState<string>();
  const [showLeft, setShowLeft] = useState<boolean>(true);
  const viewShotRef = useRef<ViewShot>(null);

  const defaultBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/Home');
    }
  };

  useEffect(() => {
    if (userID) {
      setReferralUrl(
        `${env.H5_Client_URL}/register?${loginInfo.referralUrl}&userType=1`,
      );
    }
  }, [loginInfo?.referralUrl, userID]);

  const takeScreenshotAndSave = async () => {
    setShowLeft(false);
    try {
      if (viewShotRef.current) {
        const uri = await captureRef(viewShotRef, {
          height: 440,
          quality: 1,
        });
        await MediaLibrary.saveToLibraryAsync(uri);
        Toast.show('图片保存成功！');
      } else {
        Toast.show('viewShotRef 未设置');
      }
    } catch (error) {
      Toast.show('截图保存失败:' + error);
    }
    setShowLeft(true);
  };

  return (
    <ViewShot
      style={styles.fullScreen}
      ref={viewShotRef}
      options={{format: 'png', quality: 0.9}}>
      <ImageBackground
        source={require('src/assets/imgs/gendan/gendan_detail_share_bg.webp')}
        style={styles.fullScreen}
        resizeMode="repeat">
        {showLeft && (
          <TouchableOpacity
            onPress={defaultBackPress}
            style={styles.backButton}>
            <Image
              style={IMAGE_SIZE.IMAGE_SIZE20}
              source={require('src/assets/imgs/home/icon_back_arrow.png')}
            />
          </TouchableOpacity>
        )}

        <Image
          source={require('src/assets/imgs/gendan/detail_share_title.webp')}
          style={styles.topTitleImage}
        />

        <ImageBackground
          style={styles.codeCardBackground}
          resizeMode="contain"
          source={require('src/assets/imgs/gendan/detail_share_qr_bg.webp')}>
          <View style={styles.qrCardContent}>
            <View style={styles.avatarRow}>
              <AvatarVIP
                avatar={userInfoObj?.avatar}
                vipIndex={userInfoObj?.vipLevel}
              />
              <Text style={styles.nickname}>{userInfoObj?.nickname}</Text>
            </View>

            <Text style={styles.title}>方案详情</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRowHeader}>
                <Text style={styles.infoHeaderText}>彩种</Text>
                <Text style={styles.infoHeaderText}>方案金额</Text>
                <Text style={styles.infoHeaderText}>税后奖金</Text>
              </View>
              <View style={styles.infoRowData}>
                <Text style={styles.infoText}>
                  {orderInfoObj.lotteryChineseName}
                </Text>
                <Text style={styles.infoText}>{orderInfoObj.betAmount}</Text>
                <Text style={styles.infoText}>{orderInfoObj.calcAmount}</Text>
              </View>
            </View>

            <View style={styles.qrCodeWrapper}>
              {referralUrl && (
                <QRCode
                  value={referralUrl}
                  size={kScreenWidth * 0.3}
                  color="black"
                  backgroundColor="white"
                />
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={takeScreenshotAndSave}>
                <Text style={styles.buttonText}>保存图片</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footerText}>立即参与，实体店出票，安全可靠</Text>
        </ImageBackground>
      </ImageBackground>
    </ViewShot>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    width: kScreenWidth,
    height: kScreenHeight,
    justifyContent:'center',
    alignItems:'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    width: 20,
    height: 20,
  },
  topTitleImage: {
    marginTop: -75,
    width: '100%',
    height: kScreenHeight * 0.06,
    resizeMode: 'contain',
  },
  codeCardBackground: {
    padding: kScreenHeight * 0.02,
    width: kScreenWidth * 0.8,
    height: kScreenWidth * 0.8 * 1.51,
    alignItems: 'center',
    marginTop: kScreenHeight * 0.01,
  },
  qrCardContent: {
    paddingTop: 60,
    width: '70%',
    alignItems: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  nickname: {
    fontSize: 18,
  },
  title: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
    width: '100%',
  },
  infoCard: {
    marginTop: 8,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    width: '100%',
  },
  infoRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoRowData: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
  },
  infoHeaderText: {
    color: 'red',
    fontWeight: 'bold',
  },
  infoText: {
    color: 'red',
    fontWeight: 'bold',
  },
  qrCodeWrapper: {
    backgroundColor: '#fff',
    width: kScreenWidth * 0.4,
    height: kScreenWidth * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 5,
    paddingVertical: 10,
    width: '100%',
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
});

export default QRCodeSharePage;
