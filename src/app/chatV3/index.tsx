/**
 * 使用 P138OpenIM 库的新聊天模块
 * 演示如何在项目中使用独立的聊天库
 */

import {P138OpenIM} from '@/p138-react-common/OpenIM';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
 

 
const ChatV3Index: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>P138OpenIM 聊天库</Text>
      <Text style={styles.subtitle}>基于独立库的聊天实现</Text>
      <Text style={styles.description}>
        这个模块演示了如何使用 P138OpenIM 库{'\n'}
        库已初始化，可以开始使用聊天功能
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ChatV3Index;
