import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Clipboard,
  Dimensions,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';

import {getByShopCodeApi} from 'src/api/interface/lottery-shop';
import {useUserStore} from 'src/store/user';
import {router} from 'expo-router';
import {IMAGE_SIZE} from '@/p138-react-common/utils/styles/theme';
 
import ImageUpload from '@/p138-react-common/components/Upload/ImageSelector';

const ShopInfo: React.FC = () => {
  const {loginInfo, setShopInfo, shopInfo} = useUserStore();
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
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
            //   setImageDimensions({ width, height });
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
      //   ToastAndroid.show('链接已复制到剪贴板', ToastAndroid.SHORT);
      Toast.show('链接已复制到剪贴板');
    } else {
      //   ToastAndroid.show('未生成链接', ToastAndroid.SHORT);
      Toast.show('未生成链接');
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
    <View className="flex-1 bg-[#f5f5f5]">
      {/* 顶部导航栏 */}
      <AppHeader
        title="店铺信息"
        rightComponent={
          <TouchableOpacity onPress={() => router.push('/home/shop/share')}>
            <Image
              style={IMAGE_SIZE.IMAGE_SIZE20}
              source={require('src/assets/imgs/live/share.png')}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView>
        {/* 店铺展示图片 */}
        <View className="w-full p-2">
          <Image
            style={[
              styles.storeImage,
              Platform.OS === 'web' ? {aspectRatio: 3 / 1} : {},
            ]}
            source={require('src/assets/imgs/mine/shop_icon.webp')}
            resizeMode="stretch"
          />
        </View>
        {/* 店铺基础信息 */}
        <View className="bg-white p-4 rounded-lg mb-2">
          <View className="flex-row items-center">
            <Text className="text-lg font-bold">
              {shopInfo?.shopName}({shopInfo?.shopCode})
            </Text>
            <Text className="text-[10px] text-white bg-red-500 px-2 py-1 rounded-md ml-2">
              已认证
            </Text>
          </View>
          <Text className="text-[10px]    py-1 rounded-md text-gray-500">
            {`店铺已于${dayjs(shopInfo?.registrationTime).format(
              'YYYY-MM-DD',
            )}通过实名认证`}
          </Text>
        </View>

        {/* 店铺详细信息 */}
        <View className="bg-white p-4 rounded-lg mb-2">
          <View className="flex-row items-center mb-2 border-b border-gray-200 pb-2">
            <Text className="text-md text-gray-500">店主姓名：</Text>
            <Text className="text-md flex-1  ">
              {shopInfo.showShopkeeperName
                ? shopInfo?.shopkeeperName
                : '*******'}
            </Text>
          </View>
          <View className="flex-row items-center mb-2 border-b border-gray-200 pb-2">
            <Text className="text-md text-gray-500">店铺电话：</Text>
            <Text className="text-md flex-1  ">{shopInfo?.shopPhone}</Text>
            {shopInfo?.shopPhone && (
              <TouchableOpacity
                className="bg-red-500 px-2 py-1 rounded-md"
                onPress={() =>
                  shopInfo?.shopPhone && dialPhone(shopInfo?.shopPhone)
                }>
                <Text className="text-sm text-white">打电话</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-row items-center mb-2 border-b border-gray-200 pb-2">
            <Text className="text-md text-gray-500">店铺微信：</Text>
            <Text className="text-md flex-1  ">{shopInfo?.shopWechat}</Text>
            {shopInfo?.shopWechat && (
              <TouchableOpacity
                className="bg-red-500 px-2 py-1 rounded-md"
                onPress={() =>
                  shopInfo?.shopWechat && copyToClipboard(shopInfo?.shopWechat)
                }>
                <Text className="text-sm text-white">复制</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-row items-center mb-2 border-b border-gray-200 pb-2">
            <Text className="text-md text-gray-500">店铺地址：</Text>
            <Text className="text-md flex-1  ">
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
            <View className="flex-row items-center mb-2 border-b border-gray-200 pb-2">
              <Text className="text-md text-gray-500">店铺公告：</Text>
              <Text className="text-md flex-1  ">{shopInfo?.shopNotice}</Text>
            </View>
          )}
        </View>

        {/* 公告图片部分 */}
        {shopInfo?.shopNoticePic && (
          <View className="bg-white p-4 rounded-lg mb-2">
            <View className="flex-row items-center mb-2 border-b border-gray-200 pb-2">
              <Text className="text-md text-gray-500">公告图片：</Text>
            </View>
            <View className="bannerContainer">
              <ImageUpload
                userID={loginInfo?.userID ?? ''}
                canModify={false}
                className="justify-center items-start"
                showClearButton={false}
                style={{width: '100%'}}
                previewImageClassName="w-full h-full"
                source={shopInfo?.shopNoticePic.split(',')}
                containerClassName="items-center justify-center"
                previewImageProps={{
                  style: {
                    width: screenWidth * 0.8,
                    aspectRatio: 1 / 2,
                    resizeMode: 'stretch',
                  },
                }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ShopInfo;

const styles = StyleSheet.create({
  storeImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    // aspectRatio: 3 / 1,
  },

  bannerImage: {
    // width: '95%',
    height: 300,
    borderRadius: 10,
    backgroundColor: '#fff', // 添加白色背景
  },
});
