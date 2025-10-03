import {AppHeader} from '@/p138-react-common/components';
import {useLocalSearchParams} from 'expo-router';
import {View, StyleSheet, Text} from 'react-native';

const WebScreen = () => {
  const {url} = useLocalSearchParams();
  const urlString = Array.isArray(url) ? url[0] : url;
  console.log('加载URL:', urlString);
  console.log('URL类型:', typeof urlString);

  // 如果没有URL，显示错误信息
  if (!urlString) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>未提供URL参数</Text>
          <Text style={styles.errorText}>请检查路由参数</Text>
        </View>
      </View>
    );
  }

  // 确保URL是完整的
  const fullUrl = urlString.startsWith('http') ? urlString : `https://${urlString}`;
  console.log('完整URL:', fullUrl);

  return (
    <View style={styles.container}>
      <AppHeader />
      <iframe
        src={fullUrl}
        style={styles.webview}
        onLoad={(e) => {
          console.log('iframe 加载完成:', e);
        }}
        onError={(e) => {
          console.error('iframe 加载失败:', e);
        }}
        // 移除 sandbox 限制，允许更多功能
        allow="fullscreen; camera; microphone; geolocation"
        referrerPolicy="no-referrer"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
});

export default WebScreen;
