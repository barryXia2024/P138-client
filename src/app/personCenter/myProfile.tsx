import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as MediaLibrary from 'expo-media-library';

import {useUserStore} from 'src/store/user';
import RightTextButton from '@/p138-react-common/components/RightTextButton';
import {router} from 'expo-router';

import ImageUpload from 'p138-react-common/components/Upload/ImageSelector';
import {getImageUrl} from 'p138-react-common/utils/fuc';
import {DEFAULT_IMAGE} from '@/config/env';
import {getUserBasicInfoApi, getUserInfo, userUpdateBasicInfoApi} from 'src/api/interface/users-auth';

const MyProfile: React.FC = () => {
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const [isVisible, setIsVisible] = useState(false);
  const {userInfo, loginInfo, setUserInfo} = useUserStore();

  const [avatarImg, setAvatarImg] = useState<string>(
    userInfo.avatarToBeReviewed??userInfo?.avatar ,
  );
  console.log(avatarImg, 'avatarImg');
  console.log(userInfo, 'userInfo');
  const profileData = [
    {
      id: 1,
      label: '头像',
      type: 'image',
      value: userInfo?.avatar,
      editable: true,
    },
    {id: 2, label: '昵称', type: 'text', value: userInfo?.nickname, editable: true},
    {id: 3, label: '登录密码', type: 'text', value: '', editable: true},
    {id: 4, label: '支付密码', type: 'text', value: '', editable: true},
    {
      id: 5,
      label: '真实姓名',
      type: 'text',
      value: userInfo?.realName,
      editable: userInfo?.realName?.length > 0 ? false : true,
    },
    {
      id: 6,
      label: '身份证号码',
      type: 'text',
      value: userInfo?.idCardNumber,
      editable: userInfo?.idCardNumber?.length > 0 ? false : true,
    },
    {
      id: 7,
      label: '手机号码',
      type: 'text',
      value: userInfo?.username,
      editable: false,
    },
  ];
  const onPress = (id: number) => {
    console.log(id, 'id');
    switch (id) {
      case 1:
        // modalizeRef.current?.open();
        setIsVisible(true);
        break;
      case 2:
        router.push('/personCenter/updateNickName');
        break;
      case 3:
        router.push({
          pathname: '/personCenter/updatePassWord',
          params: {
            type: 'login',
          },
        });
        break;
      case 4:
        router.push({
          pathname: '/personCenter/updatePassWord',
          params: {
            type: 'pay',
          },
        });
        break;
      case 5:
        router.push('/personCenter/realAuth');
        break;
      case 6:
        router.push('/personCenter/realAuth');
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    console.log(loginInfo, 'loginInfo')
    if (status && status.status !== 'granted') {
      requestPermission();
      getUserBasicInfoApi({
        userID: loginInfo?.userID ?? '',
      },{
        'X-Shop-Code': loginInfo?.shopCode ?? 0,
        'X-User-Type': loginInfo?.userType ?? 2,
        'X-Username': loginInfo?.username ?? '',
      }).then(res=>{
        if(res.success){
          setUserInfo(res.data)
        }
      })
    }
  }, [status]);
  console.log(userInfo?.avatarToBeReviewed, 'userInfo?.avatarToBeReviewed');
  return (
    <View style={styles.container}>
      <AppHeader title="我的资料" />
      <View style={styles.content}>
        {profileData.map(item => {
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.row}
              onPress={() => item.editable && onPress(item.id)}
              activeOpacity={item.editable ? 0.7 : 1}>
              <Text style={styles.label}>{item.label}</Text>
              {item.type === 'image' ? (
                <ImageUpload
                  userID={loginInfo?.userID ?? ''}
                  containerStyle={styles.avatar}
                  needAuth
                  // disabled={userInfo?.avatarToBeReviewed ?true: false}
                  allowModify={()=>{
                    if(userInfo?.avatarToBeReviewed){
                      Toast.show('您有头像待审核，请耐心等待审核通过')
                      return false
                     
                    }else{
                      return true
                    }
                  }}
                  source={{
                    uri: getImageUrl(avatarImg),
                  }}
                  onImagePicked={fileName => {
                    console.log(fileName, 'fileName');
                    if (fileName?.length > 0) {
                      userUpdateBasicInfoApi(
                        {
                          avatarToBeReviewed: fileName[0],
                        },
                        {
                          userID: loginInfo?.userID ?? '',
                        },
                        {
                          'X-Shop-Code': loginInfo?.shopCode ?? 0,
                          'X-User-Type': loginInfo?.userType ?? 2,
                          'X-Username': loginInfo?.username ?? '',
                        },
                      ).then(res=>{
                       if(res.success){
                        setUserInfo({
                          ...res.data
                        })
                       }
                      })
                    }
                  }}
                />
              ) : (
                <RightTextButton title={item.value}  onPress={()=>{
                  if(item.editable){
                    onPress(item.id)
                  }
                }}/>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    color: '#333',
  },

  avatar: {
    width: 40,
    height: 40,
    // aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },

});

export default MyProfile;
