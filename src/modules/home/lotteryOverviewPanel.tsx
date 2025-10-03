import { router } from 'expo-router';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
 
 

const LotteryOverviewPanel: React.FC  = ({
 
}) => {
  const onFollowPress=()=>{
    router.push({
      pathname: '/follow',
      params: {
        title: '合买大厅',
      },
    });
  }
  const onResultPress=()=>{
    router.push('/lottery/result/list');
  }
  const onTrendPress=()=>{
    router.push({
      pathname: '/lottery/trend',
      params: {
        title: '走势图表',
      },
    });
  }
   

  return (
    <View style={styles.container}>
      {/* 左侧图片 A - 合买大厅 */}
      <TouchableOpacity
        className="flex-1"
        onPress={onFollowPress}
      >
        <Image
          source={require('src/assets/imgs/home/hemai.webp')}
          style={[{ width: '100%', height: 125 }]}
          resizeMode="stretch"
        />
      </TouchableOpacity>
      
      {/* 右侧垂直排列的 B 和 C 图片 */}
      <View className="flex-1 gap-[6px]">
        {/* 开奖公告 */}
        <TouchableOpacity onPress={onResultPress}>
          <Image
            source={require('src/assets/imgs/home/lottery_bulletin.webp')}
            style={[{ width: '100%', height: 58 }]}
            resizeMode="stretch"
          />
        </TouchableOpacity>

        {/* 走势图表 */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={onTrendPress}
        >
          <Image
            source={require('src/assets/imgs/home/trend.webp')}
            style={[{ width: '100%', height: 58 }]}
            resizeMode="stretch"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // 横向排列
    justifyContent: 'space-between', // 左右两侧分布
    gap: 10,
    padding: 10,
  },
});

export default LotteryOverviewPanel;
