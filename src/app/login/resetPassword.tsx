import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';



import {ZTextInput, AppHeader} from '@/p138-react-common/components';
import {
  generatorCaptcha,
  userResetPasswordApi,
} from 'src/api/interface/users-auth';
import {router, useLocalSearchParams} from 'expo-router';

const ResetPassword: React.FC = () => {
  //   const updateType = props.route.params.type;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [codeInfo, setCodeInfo] =
    useState<ServerCoreAuth.GenerateCaptchaResult>();
  const [code, setCode] = useState('');

  const [confirmPasswordError, setConfirmPasswordError] = useState('');
 
  useEffect(()=>{
    getCaptcha();
  },[])

  const validatePassword = (password: string) => {
    if (password.length < 6 || password.length > 18) {
      return '密码长度应为6-18位';
    }
    // if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/.test(password)) {
    //   return '密码必须包含字母和数字';
    // }
    return '';
  };
  // 获取验证码
  const getCaptcha = async () => {
    try {
      const response = await generatorCaptcha();
      if (response.success) {
        setCodeInfo(response.data);
      }
    } catch (error) {
      console.error('获取验证码失败:', error);
      throw error;
    }
  };

  const handleSubmit = () => {
    const newPasswordValidationError = validatePassword(newPassword);
    const confirmPasswordValidationError =
      newPassword !== confirmPassword ? '两次密码输入不一致' : '';

    setNewPasswordError(newPasswordValidationError);
    setConfirmPasswordError(confirmPasswordValidationError);

    if (!newPasswordValidationError && !confirmPasswordValidationError) {
      let dict = {
        isReset: true,
        loginPasswordInfo: {
          newLoginPassword: newPassword,
        },
        
      };
      

      userResetPasswordApi(dict, {
  
        'X-User-Type': 1,
        'X-Username': phoneNumber,
      }).then(res => {
        if (res.success) {
          Toast.show(
            `重置密码成功`,
          );
          router.back();
        } else {
           Toast.show(res.message || '');
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title='重置登录密码' />

      <View style={styles.contentContainer}>
        <ZTextInput
          label="手机号"
          placeholder="请输入手机号"
          secure={false}
          maxLength={11}
          keyboardType="phone-pad"
          value={phoneNumber}
          error={phoneNumberError}
          onChangeText={text => {
            setPhoneNumber(text);
            setPhoneNumberError(validatePassword(text));
          }}
        />
        <View style={styles.captchaContainer}>
          <ZTextInput
            label="验证码"
            placeholder="请输入验证码"
  
            value={code}
             className='flex-1'
            maxLength={4}
            keyboardType="phone-pad"
            onChangeText={text => {
              setCode(text);
              
            }}
          />

          <TouchableOpacity
            activeOpacity={1}
            onPress={getCaptcha}
            style={styles.captchaButton}>
            <Image
              source={{
                uri: 'data:image/png;base64,' + codeInfo?.captcha,
              }}
              style={styles.captchaImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
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

  inputContainer: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
    backgroundColor: 'transparent',
    // paddingHorizontal: 0,
    height: 44,
    paddingLeft: 0,
    justifyContent: 'center',
  },
  input: {
    height: 44,
    marginBottom: 10,
    flex: 1,
    paddingLeft: 15,
    borderWidth: 0,
    backgroundColor: 'transparent',
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  captchaContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  captchaInputContainer: {
    flex: 1,
    marginBottom: 0,
    height: 44,
  },
  captchaIcon: {
    width: 25,
    height: 25,
  },
  captchaButton: {
    marginLeft: 8,
  },
  captchaImage: {
    width: 65,
    height: 30,
  },
});

export default ResetPassword;
