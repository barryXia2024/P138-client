import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Image, TouchableOpacity} from 'react-native';
import {ImageBackground} from 'expo-image';

import {useLocalSearchParams, useSearchParams} from 'expo-router/build/hooks';
import dayjs from 'dayjs';

import {
  decodeReferralUrl,
  generatorCaptcha,
  userSignInApi,
} from 'src/api/interface/users-auth';
import {env} from '@/config/env';
import {ZTextInput} from '@/p138-react-common/components';

const downloadURL = env.H5_Client_URL + '/download/138.apk';
// const downloadURL = "https://lknowsharing.aa146.cn/download/138.apk";
const InviteRegister = () => {
  const [account, setAccount] = useState('');

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [codeUrl, setCodeUrl] =
    useState<ServerCommonAuth.GenerateCaptchaResult>();
  const [params, setParams] = useState<string>();
  const [searchParams] = useSearchParams();
  const localParams = useLocalSearchParams();

  useEffect(() => {
    getCode();
    if (searchParams?.length > 0) {
      decodeReferralUrl({params: searchParams[1]}).then(res => {
        const resparams = res.data?.params;
        resparams && setParams(resparams);
      });
    }
  }, []);

  const getCode = async () => {
    generatorCaptcha().then(res => {
      console.log(res);
      res.data && setCodeUrl(res.data);
    });
    // const fakeCodeUrl = "https://example.com/code.png"; // 模拟验证码图片的URL
    // setCodeUrl(fakeCodeUrl);
  };

  const validateInputs = () => {
    if (!/^1[3-9]\d{9}$/.test(account)) {
      Toast.show('请输入正确的手机号码');

      return false;
    }
    if (password.length < 6) {
      Toast.show('密码长度不能少于6位');
      return false;
    }
    // if (!agreeToTerms) {
    //   // Alert.alert('错误', '请同意隐私协议');
    //   Toast.show("请先同意隐私协议");
    //   return false;15
    // }
    return true;
  };
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadURL + '?' + dayjs(); // 文件的全路径 URL
    link.download = '138.apk'; // 下载时保存的文件名
    document.body.appendChild(link);
    link.click(); // 触发下载
    document.body.removeChild(link);
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }
    if (!params) return;
    const paramsString = new URLSearchParams(params);
    console.log(searchParams);
    console.log(paramsString.get('userType'));
    userSignInApi({
      username: account,
      password,
      referralParam: localParams.params as string,
      userType: Number(localParams.userType) as ServerCommonUser.UserType,
      referralCode: paramsString.get('referralCode') || '',
      shopCode: Number(paramsString.get('shopCode') || 0),
      actionType: 1,
      sessionId: codeUrl?.sessionId,
      captcha: code,
    }).then(async response => {
      if (response.success) {
        Toast.show('您已注册成功!App下载中，请稍后....');
        handleDownload();
        // setIsSuccess(true);
      }
    });
  };
  return (
    <ImageBackground
      className="w-full h-full justify-center items-center bg-white p-6"
      source={require('src/assets/imgs/login/bg_login.webp')}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}>
      <View className='max-w-[400px]'>
        <Text className="mb-8 text-blod text-[22px]  text-left  leading-10">
          欢迎，
          <br />
          来到专属店铺
        </Text>

        <View className="mt-10 shadow-lg   p-6">
          {/* 手机号输入框 */}
          <View className="mb-4">
            <ZTextInput
              className=" rounded bg-none border-none border-b border-gray-30 "
              containerStyle={{borderWidth: 0, borderBottomWidth: 1}}
              placeholder="请输入账号(手机号格式)"
              value={account}
              placeholderTextColor="#999"
              onChangeText={setAccount}
              keyboardType="number-pad"
              maxLength={11}
              autoFocus={true}
              prefix={
                <Image
                  source={require('src/assets/imgs/login/icon_account.png')}
                  style={{width: 25, height: 25}}
                  resizeMode="contain"
                />
              }
              error="为了您的隐私安全，请勿使用真是手机号码注册"
            />
          </View>

          <View className="mb-4 flex-row items-center">
            <ZTextInput
              className=" rounded bg-none border-none border-b border-gray-30 flex-1 "
              containerStyle={{borderWidth: 0, borderBottomWidth: 1}}
              prefix={
                <Image
                  source={require('src/assets/imgs/login/icon_code.png')}
                  style={{width: 25, height: 25}}
                  resizeMode="contain"
                />
              }
              placeholder=" 请输入验证码"
              value={code}
              maxLength={4}
              onChangeText={setCode}
            />

            <TouchableOpacity
              activeOpacity={1}
              onPress={getCode}
              className="ml-2 border border-1 border-gray-300">
              <Image
                source={{uri: 'data:image/png;base64,' + codeUrl?.captcha}}
                style={{width: 65, height: 30}}
                resizeMode="contain"
              />
              {/* 验证码输入框 */}
            </TouchableOpacity>
          </View>

          {/* 密码输入框 */}
          <View className="mb-4">
            <ZTextInput
              className=" rounded bg-none border-none border-b border-gray-30 "
              placeholder=" 请输入登录密码"
              containerStyle={{borderWidth: 0, borderBottomWidth: 1}}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              prefix={
                <Image
                  source={require('src/assets/imgs/login/icon_login_lock.png')}
                  style={{width: 25, height: 25}}
                  resizeMode="contain"
                />
              }
            />
          </View>

          {/* 注册按钮 */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-red-500 p-4 rounded-full justify-center items-center">
            <Text className="text-white font-bold">立即注册</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDownload}
            className="mt-4 justify-center items-center">
            <Text>
              已注册账号{' '}
              <Text className="text-sm text-red-500 text-center mt-4">
                点击下载App
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {loading && <Text className="text-blue-500 mt-4">正在提交...</Text>}
      </View>
    </ImageBackground>
  );
};

export default InviteRegister;
