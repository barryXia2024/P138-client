import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {useUserStore} from 'src/store/user';

import {ZTextInput, AppHeader} from '@/p138-react-common/components';
import {userResetPasswordApi} from 'src/api/interface/users-auth';
import {router, useLocalSearchParams} from 'expo-router';

// 替换代码示例
const UpdatePassWordScreen: React.FC = () => {
  //   const updateType = props.route.params.type;
  const {type} = useLocalSearchParams();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const {loginInfo} = useUserStore();

  const validatePassword = (password: string) => {
    if (password.length < 6 || password.length > 18) {
      return '密码长度应为6-18位';
    }
    // if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/.test(password)) {
    //   return '密码必须包含字母和数字';
    // }
    return '';
  };

  const handleSubmit = () => {
    const newPasswordValidationError = validatePassword(newPassword);
    const confirmPasswordValidationError =
      newPassword !== confirmPassword ? '两次密码输入不一致' : '';

    setNewPasswordError(newPasswordValidationError);
    setConfirmPasswordError(confirmPasswordValidationError);

    type === 'login' &&
      oldPassword === '' &&
      setOldPasswordError('请输入旧密码');
    if (type === 'login' && oldPassword === '') {
      return;
    }

    if (!newPasswordValidationError && !confirmPasswordValidationError) {
      let dict =
        type === 'login'
          ? {
              loginPasswordInfo: {
                oldLoginPassword: oldPassword,
                newLoginPassword: newPassword,
              },
              userID: loginInfo?.userID!,
            }
          : {paymentPassword: newPassword, userID: loginInfo?.userID!};
      console.log(dict);
      loginInfo?.userID &&
        userResetPasswordApi(dict, {
          'X-Shop-Code': loginInfo?.shopCode!,
          'X-User-Type': loginInfo?.userType!,
          'X-Username': loginInfo?.username!,
        }).then(res => {
          if (res.success) {
            globalThis.Toast.show(
              `设置${type === 'login' ? '登录密码' : '支付密码'}成功`,
            );
            router.back();
          } else {
            globalThis.Toast.show(res.error?.message || '');
          }
        });
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={type === 'login' ? '设置登录密码' : '设置支付密码'} />

      <View style={styles.contentContainer}>
        {type === 'login' && (
          <ZTextInput
            label="旧密码"
            placeholder="请输入旧密码"
            secure={true}
            value={oldPassword}
            error={oldPasswordError}
            onChangeText={text => {
              setOldPassword(text);
              setOldPasswordError(validatePassword(text));
            }}
          />
        )}

        <ZTextInput
          label="新密码"
          placeholder="请输入新密码"
          secure={true}
          value={newPassword}
          error={newPasswordError}
          onChangeText={text => {
            setNewPassword(text);
            setNewPasswordError(validatePassword(text));
          }}
        />

        <ZTextInput
          label="确认新密码"
          placeholder="请再次输入新密码"
          secure={true}
          value={confirmPassword}
          error={confirmPasswordError}
          onChangeText={text => {
            setConfirmPassword(text);
            setConfirmPasswordError(
              text !== newPassword ? '两次密码输入不一致' : '',
            );
          }}
        />
      </View>

      {/* 提交按钮 */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>提交</Text>
      </TouchableOpacity>

      {/* 安全提示 */}
      <View style={styles.securityTipsContainer}>
        <Text style={styles.securityTip}>
          1. 密码至少6位，由大小写字母和数字混合组成，安全性最高；
        </Text>
        <Text style={styles.securityTip}>
          2. 不要与昵称太相似，容易被人猜到；
        </Text>
        <Text style={styles.securityTip}>
          3. 不要使用手机号码、生日、身份证号、车牌号等容易被猜到的信息。
        </Text>
      </View>
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
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginTop: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#333',
    backgroundColor: '#f0f0f0',
  },
  iconWrapper: {
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    fontSize: 12,
    color: '#f53b57',
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#f53b57',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  securityTipsContainer: {
    marginTop: 15,
    marginHorizontal: 15,
  },
  securityTip: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
});

export default UpdatePassWordScreen;
