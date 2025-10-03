import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import {router, useFocusEffect} from 'expo-router';
import {ICON_SIZES} from 'p138-react-common/utils/styles/theme';
import { AvatarVIP } from '@/p138-react-common/components';
import {useUserStore} from 'src/store';
import { getUserBasicInfoApi } from 'src/api/interface/users-auth';
const TopSection: React.FC = () => {
  const {userInfo,loginInfo,setUserInfo} = useUserStore();
  console.log(loginInfo,userInfo, 'loginInfo')
  useFocusEffect(

    useCallback(() => {
      getUserBasicInfoApi({
        userID: loginInfo?.userID || '',
      },{
        'X-Shop-Code': loginInfo?.shopCode ??1,
        'X-User-Type': loginInfo?.userType ??1,
        'X-Username': loginInfo?.username ?? '',
      },).then(res=>{
        if(res.success&&res.data){
          setUserInfo(res.data)
        }
      })
    }, [loginInfo]),
  );

  return (
    <View style={styles.topSection}>
      <View style={styles.baseInfo}>
        <AvatarVIP avatar={userInfo?.avatar} vipIndex={userInfo?.vipLevel} />
        <View style={styles.userText}>
          <Text style={styles.username}>{userInfo?.nickname}</Text>
          <Text style={styles.userStats}>
            粉丝 <Text style={styles.highlight}>0</Text> 人 | 关注{' '}
            <Text style={styles.highlight}>0</Text> 人
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.vipButton]}
        className="flex-row items-center gap-2 bg-red-500 px-[10px] py-[3px]"
        onPress={() => router.push('/personCenter/vip')}>
        <Image
          source={require('src/assets/imgs/mine/vip_logo.png')}
          style={{width: ICON_SIZES.small, height: ICON_SIZES.small}}
          resizeMode="stretch"
        />
        <Text style={styles.vipText}>VIP详情</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fef0f0',
    paddingVertical: 12,
    paddingLeft: 15,
    borderRadius: 4,
    marginHorizontal: 12,
  },
  baseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userStats: {
    fontSize: 12,
  },
  highlight: {
    color: '#ffc107',
  },
  vipButton: {
    backgroundColor: '#fe695a',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    paddingVertical: 3,
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 5,
  },
  vipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TopSection;
