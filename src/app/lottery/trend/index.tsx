import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import { router } from 'expo-router';
import TopTab from 'src/app/follow/components/topTab';

// 定义彩票类型数据结构
interface LotteryType {
  id: string;
  name: string;
  icon: any;
  type: 'welfare' | 'sports';
  uri?: string;
}

const lotteryTypes: LotteryType[] = [
  {
    id: 'ssq',
    name: '双色球',
    icon: require('src/assets/imgs/game/icon_game_double_colors.png'), 
    type: 'welfare',
    uri: '/lottery/trend/doubleBall'
  },
  {
    id: 'kl8',
    name: '快乐8',
    icon: require('src/assets/imgs/game/icon_game_happy8.png'), 
    type: 'welfare',
    uri: '/lottery/trend/happy8'

  },
  {
    id: 'fc3d',
    name: '福彩3D',
    icon: require('src/assets/imgs/game/icon_game_fucai_3d.png'), 
    type: 'welfare',
    uri: '/lottery/trend/fucai3D'
  },
  {
    id: 'qlc',
    name: '七乐彩',
    icon: require('src/assets/imgs/game/icon_game_qile.png'), 
    type: 'welfare',
    uri: '/lottery/trend/sevenHappy'
  }
];

const sportsLotteryTypes: LotteryType[] = [
    {
      id: 'ssq',
      name: '大乐透',
      icon: require('src/assets/imgs/game/icon_game_big_leto.png'), 
      type: 'sports',
      uri: '/lottery/trend/superLotto'
    },
    {
      id: 'kl8',
      name: '排列三',
      icon: require('src/assets/imgs/game/icon_game_rank3.png'), 
      type: 'sports',
      uri: '/lottery/trend/arrangedThree'
    },
    {
      id: 'fc3d',
      name: '排列五',
      icon: require('src/assets/imgs/game/icon_game_rank5.png'), 
      type: 'welfare',
      uri: '/lottery/trend/arrangedFive'
    },
    {
      id: 'qlc',
      name: '七星彩',
      icon: require('src/assets/imgs/game/icon_game_7star.png'), 
      type: 'welfare',
      uri: '/lottery/trend/sevenStar'
    }
  ];

const TrendPage = () => {
  const [activeTab, setActiveTab] = React.useState<number>(0);

  const renderLotteryItem = (item: LotteryType) => {

    return (
      <TouchableOpacity 
        key={item.id}
        style={styles.lotteryItem}
        onPress={() => item.uri&&router.push(item.uri)}
      >
        <View style={styles.lotteryContent}>
          <Image 
            source={item.icon}
            style={styles.lotteryIcon}
          />
          <Text style={styles.lotteryName}>{item.name}</Text>
          <View style={styles.trendButton}>
            <Text style={styles.trendButtonText}>走势图</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="走势图表" />
      
      {/* 顶部标签切换 */}
      <TopTab
        className="m-[10px]"
        tabs={['福利彩票', '体育彩票']}
        onTabPress={index => setActiveTab(index)}
      />

      {/* 彩票列表 */}
      <View style={styles.lotteryContainer}>
        {[lotteryTypes,sportsLotteryTypes][activeTab].map(renderLotteryItem)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
   
  lotteryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  lotteryItem: {
    width: '50%',
    padding: 5,
  },
  lotteryContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  lotteryIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  lotteryName: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
  },
  trendButton: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  trendButtonText: {
    color: '#FF4D4F',
    fontSize: 12,
  },
});

export default TrendPage;
