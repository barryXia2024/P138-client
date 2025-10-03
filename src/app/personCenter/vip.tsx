import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';

import CircularProgress from './components/circularProgress';
import Carousel from 'react-native-reanimated-carousel';
import AppHeader from '@/p138-react-common/components/AppHeader';
import { listVipLevelsApi } from 'src/api/interface/membership';
import OSSImage from 'p138-react-common/components/Upload/OSSImage';
import { useUserStore } from 'src/store';
 
import dayjs from 'dayjs';

const { width } = Dimensions.get('window');

const VIPCenter = () => {
  const { userInfo } = useUserStore();
  const [vipLevels, setVipLevels] =
    useState<ServerCommonVip.ListVIPResult>();
  const [currentVipLevel, setCurrentVipLevel] =
    useState<ServerCommonVip.VIP>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    listVipLevelsApi({
      levelCode: null,
      levelName: null,
      vipStatus: null,
      pageSize: 100,
    }).then(res => {
      const list = res.data?.list?.sort((a, b) => a.levelID - b.levelID);
      const data ={
        ...res.data,
        list: list ?? []
      }
      console.log(list, 'data');
      if (res.success) {
        setVipLevels(data);
        console.log(dayjs().valueOf())
        setLoading(false);
        if (data?.list?.length && data?.list?.length > 0) {
          if ((userInfo?.vipLevel ?? 0) >= data?.list?.length) {
            console.log(data?.list.length);
            setCurrentVipLevel(data?.list[data?.list?.length - 1]);
          } else {
            setCurrentVipLevel(data?.list[userInfo?.vipLevel ?? 0]);
          }
        }
      }
    });

  }, []);

  const currentVipLevelIndex =
    Number(userInfo?.vipLevel) >= Number(vipLevels?.list?.length)
      ? (vipLevels?.list?.length ?? 0) - 1
      : userInfo?.vipLevel;
      console.log(currentVipLevelIndex, 'currentVipLevelIndex');
      console.log(userInfo?.vipLevel, 'vipLevels?.vipLevel');
      
  return (
    <View style={styles.container}>
      {/* 导航栏 */}
      <AppHeader title="会员中心" />
      <ScrollView className="bg-gray-100">
        <View style={styles.carouselContainer}>
          {currentVipLevelIndex !== undefined && !loading && (
            <Carousel
              autoPlayInterval={2000}
              data={vipLevels?.list ?? []}
              height={258}
              loop={true}
              onSnapToItem={index => {
                setCurrentVipLevel(vipLevels?.list?.[index]);
              }}
              defaultIndex={currentVipLevelIndex}
              pagingEnabled
              snapEnabled
              width={width}
              style={{
                width: width,
              }}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: 50,
              }}
              renderItem={({ item }) => (
                <View key={item.id} style={styles.carouselItem}>
                  <OSSImage
                    source={{ uri: item.levelIcon }}
                    // source={require('src/assets/imgs/mine/share1.png')}
                    style={styles.image}
                  />
                </View>
              )}
            />
          )}
        </View>
        <View className="bg-white justify-center items-center py-6">
          <Text className="text-2xl font-bold">
            <Text className="text-red-500">{currentVipLevel?.levelName}</Text>
            专享特权
          </Text>
          <View className="flex-row justify-between w-full mt-2">
            <View className="flex-1 justify-center items-center">
              <Image
                source={require('src/assets/imgs/mine/level_live.png')}
                style={{ width: 50, height: 50 }}
              />
              <Text className="text-lg">
                直播间发言:{' '}
                <Text className="text-red-500">
                  {currentVipLevel?.chatFlag ? '是' : '否'}
                </Text>
              </Text>
            </View>
            <View className="flex-1 justify-center items-center">
              <Image
                source={require('src/assets/imgs/mine/level_color.png')}
                style={{ width: 50, height: 50 }}
              />
              <Text className="text-lg">专属等级颜色 </Text>
            </View>
            <View className="flex-1 justify-center items-center">
              <Image
                source={require('src/assets/imgs/mine/level_order.png')}
                style={{ width: 50, height: 50 }}
              />
              <Text className="text-lg">
                每日发单数：
                <Text className="text-red-500">
                  {currentVipLevel?.billing ?? 0}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        {/* 当前投注金额部分 */}
        <View className="bg-white justify-center items-center py-6 mt-3">
          <Text className="text-2xl font-bold">VIP等级详情</Text>
          <Text className="text-lg text-gray-500 py-3">
            等级积分在每天次日 <Text className="text-red-500">凌晨3:00</Text>{' '}
            开始更新
          </Text>
          <CircularProgress
            size={150} // 圆的大小
            strokeWidth={8} // 圆环宽度
            progress={
              Number(userInfo?.score ?? 0) /
              Number(vipLevels?.list?.[userInfo?.vipLevel ?? 0 + 1]?.score ?? 1)
            } // 进度，0~1
            color="#FF4D4F" // 进度条颜色
            backgroundColor="#F5F5F5" // 圆环背景颜色
            text={`${userInfo?.score ?? 0}`}
            subText={`当前投注金额`}
          />
          <Text style={styles.upgradeText}>
            升级到 {vipLevels?.list?.[userInfo?.vipLevel ?? 0 + 1]?.levelName}{' '}
            需要积分: {vipLevels?.list?.[userInfo?.vipLevel ?? 0 + 1]?.score}分
          </Text>
        </View>

        {/* VIP等级规则表格 */}
        <View className="bg-white">
          <Text style={styles.rulesTitle}>VIP等级规则</Text>
          <View style={styles.rulesRow}>
            <Text style={styles.rulesCell}>等级</Text>
            <Text style={styles.rulesCell}>投注金额</Text>
            <Text style={styles.rulesCell}>直播间发言</Text>
            <Text style={styles.rulesCell}>等级颜色</Text>
            <Text style={styles.rulesCell}>每日发单数</Text>
          </View>
          {vipLevels?.list
            ?.sort((a, b) => a.levelID - b.levelID)
            .map((item, index) => (
              <View style={styles.rulesRow} key={index}>
                <Text style={styles.rulesCell}>{item.levelName}</Text>
                <Text style={styles.rulesCell}>{item.score}</Text>
                <Text style={styles.rulesCell}>
                  {item.chatFlag ? '√' : '×'}
                </Text>
                <Text style={styles.rulesCell}>{item.levelColor}</Text>
                <Text style={styles.rulesCell}>{item.billing}</Text>
              </View>
            ))}
        </View>
        <View className="bg-white justify-center items-center py-6 px-4 gap-2">
          <Text className="text-2xl font-bold">VIP条款和规则</Text>
          <Text className="text-left w-full text-lg font-bold">VIP积分</Text>
          <Text className="text-left w-full text-sm text-gray-500">
            每投注1元，积1分。
          </Text>
          <Text className="text-left w-full text-lg font-bold">VIP福利</Text>
          <Text className="text-left w-full text-sm text-gray-500">
            用户VIP等级越高，相应的权益越高。
          </Text>
          <Text className="text-left w-full text-lg font-bold">VIP等级</Text>
          <Text className="text-left w-full text-sm text-gray-500">
            VIP等级统计从注册开始计算
          </Text>
          <Text className="text-left w-full text-lg font-bold">升级标准</Text>
          <Text className="text-left w-full text-sm text-gray-500">
            用户投注额达到相应的等级要求，在次日凌晨3点升级到相应VIP等级。
          </Text>
          <Text className="text-lg mt-3">
            平台保留对规则的修改及最终解释权。
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // 导航栏样式已由 AppHeader 控制

  // 轮播图样式
  carouselContainer: {
    marginTop: 10,
    height: 150,
    backgroundColor: '#fff',
  },
 
  carouselItem: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  
  upgradeText: {
    fontSize: 14,
    color: '#ff4d4f',
    marginTop: 10,
  },

  // VIP规则表格部分
  rulesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  rulesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rulesCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
 
});

export default VIPCenter;
