/**
 * 使用 P138OpenIM 库的登录页面
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import {P138OpenIM} from '@/p138-react-common/OpenIM';
import md5 from 'md5';

const ChatV3Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

 

  // 监听登录结果
  useEffect(() => {
    const unsubscribeSuccess = P138OpenIM.onLoginSuccess((userInfo) => {
      console.log('登录成功:', userInfo);
      router.replace('/chatV3/list');
    });

    const unsubscribeFailed = P138OpenIM.onLoginFailed((error) => {
      console.error('登录失败:', error);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (typeof Toast !== 'undefined') {
        Toast.show('登录失败，请检查账号密码');
      }
    });

    return () => {
      unsubscribeSuccess();
      unsubscribeFailed();
    };
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (typeof Toast !== 'undefined') Toast.show('请输入用户名和密码');
      return;
    }

    try {
      setLoading(true);
      await P138OpenIM.loginWithPassword({
        username,
        password: md5(password),
      });
    } catch (error) {
      console.error('登录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>P138OpenIM 登录</Text>
      <Text style={styles.subtitle}>基于聊天库的登录实现</Text>
      
      <View style={styles.formItem}>
        <Text style={styles.label}>手机号</Text>
        <TextInput
          style={styles.input}
          placeholder="输入手机号"
          value={username}
          onChangeText={setUsername}
          maxLength={11}
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.formItem}>
        <Text style={styles.label}>密码</Text>
        <TextInput
          style={styles.input}
          placeholder="输入密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? '登录中...' : '登录并进入聊天'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  formItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0089FF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatV3Login;
