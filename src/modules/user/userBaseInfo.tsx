import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {router, useFocusEffect} from 'expo-router';
import {AvatarVIP} from '@/p138-react-common/components';
import {useUserStore} from 'src/store';
 
import useMineStore from './store/mine';
const UserBaseInfo: React.FC = () => {
  const {userInfo} = useUserStore();
  const {notReadCount} = useMineStore();
 


  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <AvatarVIP
          avatar={userInfo?.avatarToBeReviewed ?? userInfo?.avatar}
          vipIndex={userInfo?.vipLevel}
          onPress={() => router.push('/personCenter/myProfile')}
        />
        <View style={styles.userInfoContainer}>
          <Text style={styles.nickname}>{userInfo?.nickname}</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/follow/fans',
                params: {
                  userID: userInfo?.id,
                  shopCode: userInfo?.shopCode,
                },
              })
            }>
            <Text style={styles.fansInfo}>
              粉丝 <Text style={styles.fansCount}>{userInfo?.fansNum}</Text> 人
              | 关注 <Text style={styles.fansCount}>{userInfo?.followNum}</Text>{' '}
              人
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            router.push('/personCenter/myProfile');
          }}>
          <Image
            source={require('src/assets/imgs/mine/seetings.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, styles.messageButton]}
          onPress={() => {
            router.push('/personCenter/message');
          }}>
          <Image
            source={require('src/assets/imgs/mine/messages.png')}
            style={styles.icon}
          />
          <Text style={styles.badge}>{notReadCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingRight: 0,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoContainer: {
    marginLeft: 8,
  },
  nickname: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fansInfo: {
    fontSize: 14,
  },
  fansCount: {
    color: '#FF4B3A',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 7,
  },
  icon: {
    width: 25,
    height: 25,
  },
  messageButton: {
    position: 'relative',
  },
  badge: {
    fontSize: 10,
    color: '#fff',
    backgroundColor: 'red',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default UserBaseInfo;
