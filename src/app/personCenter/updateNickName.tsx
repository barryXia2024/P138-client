import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';


import AppHeader from '@/p138-react-common/components/AppHeader';
import {useUserStore} from 'src/store/user';
import { router } from 'expo-router';
import { userUpdateBasicInfoApi } from 'src/api/interface/users-auth';

const UpdateNickName: React.FC= () => {
  const [nickname, setNickname] = useState('');
  const {loginInfo,setUserInfo,userInfo} = useUserStore();
  const handleSubmit = () => {
    if (!/^[\u4e00-\u9fa5]{2,7}$/.test(nickname)) {
      // Alert.alert('错误', '请输入2-7位汉字');
      Toast.show('请输入2-7位汉字');
      return;
    }
    userUpdateBasicInfoApi(
      {
        nickname,
      },
      {userID: loginInfo?.userID || ''},
      {
        'X-Shop-Code': loginInfo?.shopCode!,
        'X-User-Type': loginInfo?.userType!,
        'X-Username': loginInfo?.username!,
      },
    ).then(res => {
      if (res.success) {
        Toast.show('操作成功！');
        setUserInfo({
          ...userInfo!,
          nickname,
        });
        router.back();
      } else {
        Toast.show(res.error?.message || '');
      }
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader title="修改昵称" />

      <View style={styles.contentContainer}>
        <View className='flex flex-row items-center'>
          <Text style={styles.label}>昵称</Text>
          <Text style={styles.description}>
            （给自己起个响亮的名字，让别人记住你）
          </Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="2-7位，不包含字母和数字"
          placeholderTextColor="#ccc"
          value={nickname}
          onChangeText={setNickname}
        />
        <Text style={styles.hint}>
          *温馨提示：昵称只可以修改一次，请谨慎修改
        </Text>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>提交</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 8,
    padding: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: '#333',
    backgroundColor: '#f0f0f0',
  },
  hint: {
    fontSize: 12,
    color: '#f53b57',
    // marginVertical: 10,
  },
  submitButton: {
    backgroundColor: '#f53b57',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 15,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdateNickName;
