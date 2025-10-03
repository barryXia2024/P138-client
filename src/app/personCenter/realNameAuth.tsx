import { router } from 'expo-router';
import AppHeader from '@/p138-react-common/components/AppHeader';
import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput, Alert} from 'react-native';

import { userUpdateBasicInfoApi } from 'src/api/interface/users-auth';
import { useUserStore } from 'src/store';
import { Button } from 'tamagui';


const RealNameAuth  = () =>{
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const {userInfo,setUserInfo,loginInfo} = useUserStore();
  const validateInputs = () => {
    // 验证真实姓名
    if (!name.trim()) {
      Alert.alert('提示', '请输入真实姓名');
      return false;
    }

    // 验证身份证号
    const idCardRegex =
      /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])\d{3}(\d|X|x)$/;
    if (!idCardRegex.test(idNumber.trim())) {
      Alert.alert('提示', '请输入有效的身份证号码');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      // 提交逻辑
      loginInfo?.userID &&
      userUpdateBasicInfoApi(
          {
            realName: name,
            idCardNumber: idNumber,
          },
          {
            userID: loginInfo?.userID!,
          },
          {
            'X-Shop-Code': loginInfo.shopCode!,
            'X-User-Type': loginInfo.userType!,
            'X-Username': loginInfo.username!
          }
        ).then(res => {
          if (res.success) {
            globalThis.Toast.show('操作成功！');
            setUserInfo({
                ...userInfo!,
                realName:name,
                idCardNumber:idNumber,
            })
            router.back();
          } else {
            globalThis.Toast.show(res.error?.message || '');
          }
        });
    }
  };

  return (
    <View style={styles.container}>
      {/* 顶部栏 */}
      <AppHeader title="实名认证" />

      {/* 提示信息 */}
      <View style={styles.noticeContainer}>
        <Text style={styles.noticeText}>
          真实姓名和身份证是购彩和领取奖金的唯一凭证，提交后不可更改！
        </Text>
      </View>

      {/* 输入框 */}
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>真实姓名</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入您的真实姓名"
            placeholderTextColor="#ccc"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>身份证号码</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入您的身份证号码"
            placeholderTextColor="#ccc"
            value={idNumber}
            onChangeText={setIdNumber}
          />
        </View>
      </View>

      {/* 手机号信息 */}
      <Text style={styles.phoneInfo}>您绑定的手机号为：{loginInfo?.username}</Text>

      {/* 提醒信息 */}
      <Text style={styles.reminder}>提醒：禁止未成年人购彩</Text>

      {/* 确定按钮 */}
      <Button
        onPress={handleSubmit}
      >
        确定
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#f44336',
  },
  noticeContainer: {
    backgroundColor: '#fff2e8',
    padding: 10,
    marginBottom: 8,
  },
  noticeText: {
    color: '#ff6f00',
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingBottom: 16,
  },
  inputGroup: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
    width: 80,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 0.5,
    width: '75%',
    borderRadius: 4,
    fontSize: 14,
  },
  phoneInfo: {
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
  reminder: {
    color: '#f44336',
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 14,
  },
  confirmButton: {
    marginHorizontal: 16,
    backgroundColor: '#f44336',
    borderRadius: 4,
  },
  contactButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  contactText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default RealNameAuth;
