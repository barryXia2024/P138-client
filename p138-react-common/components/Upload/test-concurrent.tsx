import React, {useEffect, useState} from 'react';
import {Button, ScrollView, Text, View} from 'react-native';
import OSSImage, {
  clearImageCache,
  clearPendingRequests,
  getCachedImages,
  getImageCacheCount,
  getPendingImages,
  getPendingRequestsCount,
} from './OSSImage';

// 测试并发图片请求的组件
const TestConcurrentImages: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState({
    cacheCount: 0,
    pendingCount: 0,
    cachedImages: [] as string[],
    pendingImages: [] as string[],
  });

  const updateDebugInfo = () => {
    setDebugInfo({
      cacheCount: getImageCacheCount(),
      pendingCount: getPendingRequestsCount(),
      cachedImages: getCachedImages(),
      pendingImages: getPendingImages(),
    });
  };

  useEffect(() => {
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  const testImages = [
    '1948676346276929536/ossimg_default_header.png',
    '1948676346276929536/ossimg_default_header.png', // 重复的图片
    '1948676346276929536/ossimg_default_header.png', // 重复的图片
    '1948676346276929536/ossimg_default_header.png', // 重复的图片
    '1948676346276929536/ossimg_default_header.png', // 重复的图片
  ];

  return (
    <ScrollView style={{flex: 1, padding: 20}}>
      <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 20}}>
        测试并发图片请求优化
      </Text>

      <View style={{marginBottom: 20, padding: 10, backgroundColor: '#f0f0f0'}}>
        <Text style={{fontWeight: 'bold', marginBottom: 10}}>调试信息:</Text>
        <Text>缓存图片数量: {debugInfo.cacheCount}</Text>
        <Text>正在请求数量: {debugInfo.pendingCount}</Text>
        <Text>已缓存图片: {debugInfo.cachedImages.join(', ')}</Text>
        <Text>正在请求图片: {debugInfo.pendingImages.join(', ')}</Text>
      </View>

      <View style={{flexDirection: 'row', marginBottom: 20}}>
        <Button title="清除缓存" onPress={clearImageCache} />
        <Button title="清除请求" onPress={clearPendingRequests} />
        <Button title="刷新调试信息" onPress={updateDebugInfo} />
      </View>

      {testImages.map((imageUri, index) => (
        <View
          key={index}
          style={{
            marginBottom: 20,
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
          }}>
          <Text style={{marginBottom: 10}}>
            图片 {index + 1}: {imageUri}
          </Text>
          <OSSImage
            source={{uri: imageUri}}
            style={{width: 200, height: 150}}
            resizeMode="cover"
          />
        </View>
      ))}

      <Text style={{marginTop: 20, fontSize: 14, color: '#666'}}>
        预期行为：
        {'\n'}1. 所有图片都应该正常显示
        {'\n'}2. 只有第一个请求会发起网络请求
        {'\n'}3. 其他请求会等待第一个请求的结果
        {'\n'}4. 后续请求会从缓存获取
        {'\n'}5. 调试信息会显示缓存和请求状态
      </Text>
    </ScrollView>
  );
};

export default TestConcurrentImages;