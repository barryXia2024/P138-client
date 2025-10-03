import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  Platform,
} from 'react-native';
import {Checkbox, ZTextInput} from '@/p138-react-common/components';
import {useLogin} from './useLogin';
import {storageAdapter} from '@/p138-react-common/api/platforms/storage';
import {router} from 'expo-router';

const LoginScreen = () => {
  const {
    formState,
    updateCredentials,
    updatePreferences,
    updateCode,
    handleLogin,
    togglePasswordVisibility,
    getCaptcha,
  } = useLogin();

  const renderPasswordIcon = () => (
    <TouchableOpacity onPress={togglePasswordVisibility}>
      <Image
        source={
          formState.preferences.showPassword
            ? require('src/assets/imgs/login/icon_login_eye.png')
            : require('src/assets/imgs/login/icon_login_hideye.png')
        }
        style={styles.iconImage}
        resizeMode="stretch"
      />
    </TouchableOpacity>
  );
  React.useEffect(() => {
    storageAdapter.clear();
  }, []);

  return (
    <ImageBackground
      style={styles.container}
      resizeMode="stretch"
      source={require('src/assets/imgs/login/bg_login.webp')}>
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>欢迎,</Text>
        <Text style={[styles.welcomeText, styles.welcomeSubText]}>
          来到XXXXX平台
        </Text>

        <View style={styles.formContainer}>
          {/* 手机号输入框 */}
          <ZTextInput
            prefix={
              <Image
                source={require('src/assets/imgs/login/icon_account.png')}
                style={styles.captchaIcon}
                resizeMode="contain"
              />
            }
            className="rounded bg-none border-none"
            containerStyle={styles.inputContainer}
            style={styles.input}
            placeholder="请输入手机号"
            keyboardType="phone-pad"
            value={formState.credentials.phoneNumber}
            maxLength={11}
            onChangeText={phoneNumber =>
              updateCredentials('phoneNumber', phoneNumber)
            }
          />

          {/* 密码输入框 */}
          <ZTextInput
            prefix={
              <Image
                source={require('src/assets/imgs/login/icon_login_lock.png')}
                style={styles.captchaIcon}
                resizeMode="contain"
              />
            }
            className="rounded bg-none border-none"
            containerStyle={styles.inputContainer}
            style={styles.input}
            value={formState.credentials.password}
            placeholder="请输入密码"
            onChangeText={password => updateCredentials('password', password)}
            secureTextEntry={!formState.preferences.showPassword}
            suffix={renderPasswordIcon()}
          />

          {/* 验证码输入框 */}
          <View className='flex-row'>
            <ZTextInput
              className="rounded bg-none border-none flex-1"
              containerStyle={[
                styles.inputContainer,
                Platform.OS === 'web' ? {flex: 1} : {width:'80%'},
              ]}
              style={[styles.input]}
              prefix={
                <Image
                  source={require('src/assets/imgs/login/icon_code.png')}
                  style={styles.captchaIcon}
                  resizeMode="contain"
                />
              }
              placeholder=" 请输入验证码"
              value={formState.code}
              maxLength={4}
              keyboardType="phone-pad"
              onChangeText={updateCode}
            />

            <TouchableOpacity
              activeOpacity={1}
              onPress={getCaptcha}
              style={[styles.captchaButton,Platform.OS === 'web' ? { } : {width:65,height:30,marginLeft:-50,}]}>
              <Image
                source={{
                  uri: 'data:image/png;base64,' + formState.codeUrl?.captcha,
                }}
                style={styles.captchaImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* 复选框 */}
          <View style={styles.checkboxContainer}>
            {/* <Checkbox.CheckboxWithLabel
              size="$5"
              label="是否主播"
              checked={formState.preferences.isAnchor}
              onCheckedChange={() =>
                updatePreferences('isAnchor', !formState.preferences.isAnchor)
              }
            /> */}
            <Checkbox.CheckboxWithLabel
              size="$5"
              label="记住密码"
              checked={formState.preferences.rememberPassword}
              onCheckedChange={() =>
                updatePreferences(
                  'rememberPassword',
                  !formState.preferences.rememberPassword,
                )
              }
            />
            <Checkbox.CheckboxWithLabel
              size="$5"
              label="同意隐私协议"
              checked={formState.preferences.agreeToTerms}
              onCheckedChange={() =>
                updatePreferences(
                  'agreeToTerms',
                  !formState.preferences.agreeToTerms,
                )
              }
            />
          </View>

          {/* 登录按钮 */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              formState.isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={formState.isLoading}>
            <Text style={styles.loginButtonText}>
              {formState.isLoading ? '登录中...' : '立即登录'}
            </Text>
          </TouchableOpacity>

          {/* 忘记密码 */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push('/login/resetPassword')}>
            <Text style={styles.forgotPasswordText}>忘记密码？</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.versionText}>版本：1.0.0</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 100,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '100%',
  },
  welcomeSubText: {
    marginBottom: 50,
  },
  formContainer: {
    width: '100%',
    gap: 10,
  },
  inputContainer: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
    backgroundColor: 'transparent',
    // paddingHorizontal: 0,
    width: '100%',
    height: 44,
    paddingLeft: 0,
    justifyContent: 'center',
  },
  input: {
    height: 44,
    marginBottom: 10,
    paddingLeft: 15,
    borderWidth: 0,
    backgroundColor: 'transparent',
    textAlign: 'left',
    textAlignVertical: 'center',
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
  loginButton: {
    backgroundColor: '#FF4B3A',
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 60,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#FF4B3A',
  },
  checkboxContainer: {
    marginBottom: 20,
  },

  iconImage: {
    width: 25,
    height: 25,
  },
  versionText: {
    fontSize: 12,
    position: 'absolute',
    bottom: 0,
    right: 0,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default LoginScreen;
