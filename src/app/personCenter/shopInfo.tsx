import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Clipboard,
  ToastAndroid,
  Dimensions,
  Image,
} from 'react-native';
import {getByShopCodeApi} from 'src/api/interface/lottery-shop';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {useUserStore} from 'src/store/user';
import {router} from 'expo-router';
import { DEFAULT_IMAGE } from '@/p138-react-common/config';
import { kScreenWidth } from '@/p138-react-common/utils/styles';
const ShopInfo: React.FC = () => {
  const {loginInfo, setShopInfo, shopInfo} = useUserStore();
  const [imageDimensions, setImageDimensions] = useState({width: 0, height: 0});
  useEffect(() => {
    loginInfo?.shopCode &&
      getByShopCodeApi({shopCode: loginInfo?.shopCode}).then(res => {
        if (res.success && res.data) {
          if (shopInfo?.shopNoticeImage) {
            Image.getSize(shopInfo.shopNoticeImage, (width, height) => {
              setImageDimensions({width, height});
            });
          } else {
            // 如果没有图片则使用默认图片的尺寸
            // Image.getSize(defaultImage, (width, height) => {
            //   setImageDimensions({width, height});
            // });
          }
          setShopInfo(res.data);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setShopInfo, loginInfo?.shopCode]);
  const copyToClipboard = (referralUrl: string) => {
    if (referralUrl) {
      Clipboard.setString(referralUrl);
      ToastAndroid.show('链接已复制到剪贴板', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('未生成链接', ToastAndroid.SHORT);
    }
  };
  const dialPhone = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert('无法拨打电话', '请确认号码是否正确');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('Error dialing phone:', err));
  };
  // 获取屏幕宽度
  const screenWidth = Dimensions.get('window').width;

  // 计算适应屏幕宽度的高度（保持原比例）
  const aspectRatio = imageDimensions.width / imageDimensions.height;
  const calculatedHeight = (screenWidth * 0.9) / aspectRatio;
  return (
    <ScrollView style={styles.container}>
      {/* 顶部导航栏 */}
      <AppHeader
        title="店铺信息"
        rightComponent={
          <TouchableOpacity
            onPress={() => router.push('/personCenter/invitedUser')}>
            <Image
              style={{width: 25, height: 25}}
              source={require('src/assets/imgs/live/share.png')}
            />
          </TouchableOpacity>
        }
      />

      {/* 店铺展示图片 */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.storeImage}
          // source={{uri: shopInfo?.shopIcon}} // 替换为实际图片路径
          source={require('src/assets/imgs/mine/shop_icon.webp')} // 替换为实际图片路径
          resizeMode="stretch"
        />
      </View> 
      {/* 店铺基础信息 */}
      <View style={[styles.storeInfo, {marginBottom: 10}]}>
        <View style={styles.row}>
          <Text style={styles.storeName}>{shopInfo?.shopName}</Text>
          <Text style={styles.verified}>{shopInfo?.shopCode}</Text>
          <Text style={styles.verified}>{['','未认证', '审核中', '已认证', '已拒绝', '解除入驻'][shopInfo?.shopStatus]}</Text>
        </View>
        <Text style={styles.certificationDate}>
          {`店铺已于${dayjs(shopInfo?.registrationTime).format(
            'YYYY-MM-DD',
          )}通过实名认证`}
        </Text>
      </View>

      {/* 店铺详细信息 */}
      <View style={styles.details}>
        <View style={[styles.detailRow, styles.borderBottom]}>
          <Text style={styles.detailLabel}>店主姓名：</Text>
          <Text style={styles.detailValue}>{shopInfo?.shopkeeperName}</Text>
        </View>
        <View style={[styles.detailRow, styles.borderBottom]}>
          <Text style={styles.detailLabel}>店铺电话：</Text>
          <Text style={styles.detailValue}>{shopInfo?.shopPhone}</Text>
          {shopInfo?.shopPhone && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                shopInfo?.shopPhone && dialPhone(shopInfo?.shopPhone)
              }>
              <Text style={styles.actionText}>打电话</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.detailRow, styles.borderBottom]}>
          <Text style={styles.detailLabel}>店铺微信：</Text>
          <Text style={styles.detailValue}>{shopInfo?.shopWechat}</Text>
          {shopInfo?.shopPhone && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                shopInfo?.shopWechat && copyToClipboard(shopInfo?.shopWechat)
              }>
              <Text style={styles.actionText}>复制</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.detailRow, styles.borderBottom]}>
          <Text style={styles.detailLabel}>店铺地址：</Text>
          <Text style={styles.detailValue}>
            {[
              shopInfo?.province,
              shopInfo?.city,
              shopInfo?.district,
              shopInfo?.shopDetailedAddress,
            ]
              .filter(Boolean)
              .join('')}
          </Text>
        </View>
        {shopInfo?.shopNotice && (
          <View style={[styles.detailRow, styles.borderBottom]}>
            <Text style={styles.detailLabel}>店铺公告：</Text>
            <Text style={styles.detailValue}>{shopInfo?.shopNotice}</Text>
          </View>
        )}
      </View>

      {/* 公告图片部分 */}
      {shopInfo?.shopNoticeImage && (
        <View style={[styles.details, {paddingVertical: 0, marginBottom: 20}]}>
          <View style={[styles.detailRow]}>
            <Text style={styles.detailLabel}>公告图片：</Text>
          </View>
          <View style={styles.bannerContainer}>
            <Image
              style={[
                styles.bannerImage,
                {width: screenWidth * 0.9, height: calculatedHeight},
              ]}
              source={{uri: shopInfo?.shopNoticeImage || DEFAULT_IMAGE}}
              resizeMode="contain"
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default ShopInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  imageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  storeImage: {
    width: kScreenWidth,
    aspectRatio: 3/1,
    borderRadius: 10,
    backgroundColor: '#f5f5f5', // 与父容器背景一致
  },
  storeInfo: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  verified: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#f44336',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
  },
  certificationDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  details: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 80, // 保持标签宽度一致
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1, // 文本内容自适应宽度
  },
  actionButton: {
    backgroundColor: '#f44336',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  actionText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  bannerContainer: {
    alignItems: 'center',
  },
  bannerImage: {
    // width: '95%',
    height: 300,
    borderRadius: 10,
    backgroundColor: '#fff', // 添加白色背景
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // 浅灰色分割线
  },
});
