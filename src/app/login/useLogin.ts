import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { useUserStore } from 'src/store';
import { STORAGE_KEYS } from 'p138-react-common/config';
import { 
  generatorCaptcha, 
  getUserBasicInfoApi, 
  userSignInApi 
} from 'src/api/interface/users-auth';
import { getByShopCodeApi } from 'src/api/interface/lottery-shop';
import { storageAdapter } from '@/p138-react-common/api/platforms/storage';
import { BaseEventTypes, eventBus,IMEvents, IMEventTypes } from '@/p138-react-common/utils/eventBus';

// 登录凭据接口
interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

// 用户偏好设置接口
interface UserPreferences {
  rememberPassword: boolean;
  agreeToTerms: boolean;
  showPassword: boolean;
  isAnchor: boolean;
}

// 验证码数据接口
interface CaptchaData {
  sessionId?: string;
  captcha?: string;
}

// 登录表单状态接口
interface LoginFormState {
  credentials: LoginCredentials;
  code: string;
  codeUrl?: CaptchaData;
  preferences: UserPreferences;
  isLoading: boolean;
  errors: {
    phoneNumber?: string;
    password?: string;
    code?: string;
    general?: string;
  };
}

// 表单验证常量
const PHONE_REGEX = /^1[3-9]\d{9}$/;
const MIN_PASSWORD_LENGTH = 6;

/**
 * 登录相关的hooks
 * 单纯页面功能，使用useState管理状态即可
 */
export const useLogin = () => {
  const { setUserInfo, setLoginInfo, setShopInfo } = useUserStore();

  const [formState, setFormState] = useState<LoginFormState>({
    credentials: {
      phoneNumber: '',
      password: '',
    },
    code: '',
    codeUrl: undefined,
    preferences: {
      rememberPassword: false,
      agreeToTerms: false,
      showPassword: false,
      isAnchor: false,
    },
    isLoading: false,
    errors: {},
  });

  // 初始化
  useEffect(() => {
    initializeLogin();
  }, []);

  // 初始化登录相关设置
  const initializeLogin = async () => {
    await loadSavedCredentials();
    await getCaptcha();
  };

  // 加载保存的登录凭据
  const loadSavedCredentials = async () => {
    try {
      const savedCredentials = await storageAdapter.getItem(STORAGE_KEYS.CREDENTIALS);
      if (savedCredentials) {
        const credentials = JSON.parse(savedCredentials) as LoginCredentials;
        setFormState(prev => ({
          ...prev,
          credentials,
          preferences: {
            ...prev.preferences,
            rememberPassword: true,
            agreeToTerms: true,
          },
        }));
      }
    } catch (error) {
      console.error('加载保存的登录信息失败:', error);
    }
  };

  // 获取验证码
  const getCaptcha = async () => {
    try {
      const response = await generatorCaptcha();
      const captchaData = response.data || {};
      
      setFormState(prev => ({
        ...prev,
        codeUrl: captchaData,
      }));
    } catch (error) {
      console.error('获取验证码失败:', error);
      Toast.show('获取验证码失败');
    }
  };

  // 更新登录凭据
  const updateCredentials = (field: keyof LoginCredentials, value: string) => {
    setFormState(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [field]: value,
      },
      errors: {
        ...prev.errors,
        [field]: undefined, // 清除对应字段的错误
      },
    }));
  };

  // 更新用户偏好设置
  const updatePreferences = (field: keyof UserPreferences, value: boolean) => {
    setFormState(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  // 更新验证码
  const updateCode = (code: string) => {
    setFormState(prev => ({
      ...prev,
      code,
      errors: {
        ...prev.errors,
        code: undefined,
      },
    }));
  };

  // 切换密码可见性
  const togglePasswordVisibility = () => {
    updatePreferences('showPassword', !formState.preferences.showPassword);
  };

  // 表单验证
  const validateForm = (): boolean => {
    const errors: LoginFormState['errors'] = {};

    if (!PHONE_REGEX.test(formState.credentials.phoneNumber)) {
      errors.phoneNumber = '请输入正确的手机号码';
    }

    if (formState.credentials.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = '密码长度不能少于6位';
    }

    if (!formState.preferences.agreeToTerms) {
      errors.general = '请先同意隐私协议';
    }

    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({ ...prev, errors }));
      
      // 显示第一个错误
      const firstError = Object.values(errors)[0];
      if (firstError) {
        Toast.show(firstError);
      }
      
      return false;
    }

    return true;
  };

  // 处理用户认证
  const handleUserAuthentication = async (userID: string, shopCode: number) => {
    try {
      const userResponse = await getUserBasicInfoApi(
        { userID },
        {
          'X-Shop-Code': shopCode,
          'X-User-Type': 1,
          'X-Username': formState.credentials.phoneNumber,
        }
      );

      if (userResponse?.data?.id) {
        setUserInfo(userResponse.data);
      }

      const shopResponse = await getByShopCodeApi({ shopCode });
      if (shopResponse?.data?.id) {
        setShopInfo(shopResponse.data);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  };

  // 登录成功后的处理
  const handlePostLoginActions = async (loginData: any) => {
    // 设置登录信息
    setLoginInfo(loginData);

    // 获取用户和店铺信息
    await handleUserAuthentication(loginData.userID, loginData.shopCode);
  };

  // 保存登录凭据
  const saveCredentials = async () => {
    if (!formState.preferences.rememberPassword) return;
    
    try {
      await storageAdapter.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(formState.credentials));
    } catch (error) {
      console.error('保存登录信息失败:', error);
    }
  };

  // 清除登录凭据
  const clearCredentials = async () => {
    try {
      await storageAdapter.removeItem(STORAGE_KEYS.CREDENTIALS);
    } catch (error) {
      console.error('清除登录信息失败:', error);
    }
  };

  // 处理登录
  const handleLogin = async () => {
    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await userSignInApi({
        username: formState.credentials.phoneNumber,
        password: formState.credentials.password,
        userType: formState.preferences.isAnchor ? 5 : 1,
        actionType: 2,
        captcha: formState.code,
        sessionId: formState.codeUrl?.sessionId,
        platform: Platform.OS === 'web' ? 'pc' : Platform.OS as BasicTypes.Platform,
      });

      if (response?.data) {
        // 登录成功
        await handlePostLoginActions(response.data);

        // 处理记住密码逻辑
        if (formState.preferences.rememberPassword) {
          await saveCredentials();
        } else {
          await clearCredentials();
        }
        
        eventBus.emit(BaseEventTypes.LOGIN, response.data);
        router.replace('/Home');
      } else {
        // 登录失败，重新获取验证码
        await getCaptcha();
      
      }
    } catch (error) {
      console.error('登录失败:', error);

      Toast.show('登录失败，请重试');
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    // 状态
    formState,
    
    // UI交互方法
    updateCredentials,
    updatePreferences,
    updateCode,
    togglePasswordVisibility,
    handleLogin,
    getCaptcha,
  };
};