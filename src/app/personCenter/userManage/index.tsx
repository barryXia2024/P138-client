import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

import {AppHeader} from '@/p138-react-common/components';
import {router} from 'expo-router';
import {proxyCountData} from 'src/api/interface/customer-agent';
import {useUserStore} from 'src/store';
import dayjs from 'dayjs';

const imgs: Record<string, number> = {
  '1': require('src/assets/imgs/mine/user/user_data_bg2.png'),
  '2': require('src/assets/imgs/mine/user/user_open_bg2.png'),
  '3': require('src/assets/imgs/mine/user/user_data_bg4.png'),
  '4': require('src/assets/imgs/mine/user/user_open_bg4.png'),
};

const UserManage = () => {
  const [currentDateData, setCurrentDateData] =
    useState<ServerCommonAgent.GetProxyCountDataResult>();
  const [currentMonthData, setCurrentMonthData] =
    useState<ServerCommonAgent.GetProxyCountDataResult>();
  const loginInfo = useUserStore(state => state.loginInfo);
  const currentDate = {
    startTime: dayjs().startOf('day').valueOf(),
    endTime: dayjs().endOf('day').valueOf(),
  };
  const currentMonth = {
    startTime: dayjs().startOf('month').valueOf(),
    endTime: dayjs().endOf('day').valueOf(),
  };

  useEffect(() => {
    proxyCountData(
      {
        shopCode: loginInfo?.shopCode || 0,
        parentUserID: loginInfo?.userID,
        ...currentMonth,
      },
      {
        shopCode: loginInfo?.shopCode || 0,
        parentUserID: loginInfo?.userID,
        ...currentMonth,
      },
    ).then(res => {
      setCurrentMonthData(res.data);
    });
    proxyCountData(
      {
        shopCode: loginInfo?.shopCode || 0,
        parentUserID: loginInfo?.userID,
        ...currentDate,
      },
      {
        shopCode: loginInfo?.shopCode || 0,
        parentUserID: loginInfo?.userID,
        ...currentDate,
      },
    ).then(res => {
      setCurrentDateData(res.data);
    });
  }, []);

  const ridItems = [
    {
      label: '本月销量累计 >',
      value: currentMonthData?.saleAmount,
      imageId: '1',
      gradient: ['#FFD700', '#FFA500'], // 黄色到橙色渐变
      screen: '/personCenter/userManage/orders',
      params: {
        ...currentMonthData,
        ...currentMonth,
      },
    },
    {
      label: '本月开户人数 >',
      value: currentMonthData?.registerUserCount,
      imageId: '2',
      gradient: ['#FFA500', '#FF4500'], // 橙色到红色渐变
      screen: '/personCenter/userManage/users',
      params: {
        ...currentMonthData,
        ...currentMonth,
      },
    },
    {
      label: '今日销量累计 >',
      value: currentDateData?.saleAmount,
      imageId: '3',
      gradient: ['#FFA500', '#FF4500'], // 橙色到红色渐变
      screen: '/personCenter/userManage/orders',
      params: {
        ...currentDateData,
        ...currentDate,
      },
    },
    {
      label: '今日开户人数 >',
      value: currentDateData?.registerUserCount,
      imageId: '4',
      gradient: ['#4169E1', '#1E90FF'], // 蓝色渐变
      screen: '/personCenter/userManage/users',
      params: {
        ...currentDateData,
        ...currentDate,
      },
    },
  ];

  const handleCardPress = (screen: string, params: Record<string, any>) => {
    // 处理卡片点击事件
    console.log('Navigate to:', screen);
    router.push({
      pathname: screen,
      params,
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader title="用户管理" />
      <View style={styles.content}>
        {/* 数据卡片网格 */}
        <View style={styles.cardsGrid}>
          {ridItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.cardContainer}
              onPress={() => handleCardPress(item.screen, item.params)}>
              <LinearGradient
                colors={item.gradient as [string, string]}
                style={styles.card}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.label}</Text>
                  </View>
                  <View style={styles.cardValue}>
                    <Text style={styles.valueText}>{item.value}</Text>
                  </View>
                  <View style={styles.cardIcon}>
                    <Image
                      source={imgs[item.imageId]}
                      style={styles.iconImage}
                    />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* 特别提示 */}
        <View style={styles.hintContainer}>
          <Text style={styles.hintTitle}>*特别提示:</Text>
          <Text style={styles.hintText}>
            "今日销量"和"本月销量"数据，均以店主完成出票的时间为准。只有店主成功出票的订单，才会被纳入销量统计。
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  cardContainer: {
    width: '45%',
    marginBottom: 15,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    height: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cardValue: {
    marginBottom: 8,
  },
  valueText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardIcon: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    opacity: 0.3,
  },
  iconImage: {
    width: 40,
    height: 40,
    tintColor: '#fff',
  },
  hintContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
});

export default UserManage;
