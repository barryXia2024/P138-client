import React from 'react';
import {Text, View} from 'react-native';
import OSSImage from './OSSImage';

const OSSImageExample: React.FC = () => {
  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 20}}>
        OSSImage 组件示例
      </Text>

      {/* 基本用法 */}
      <View style={{marginBottom: 20}}>
        <Text style={{fontSize: 16, marginBottom: 10}}>基本用法：</Text>
        <OSSImage
          source={{uri: 'https://example.com/image.jpg'}}
          style={{width: 200, height: 150}}
          className="rounded-lg"
        />
      </View>

      {/* 使用自定义错误图片 */}
      <View style={{marginBottom: 20}}>
        <Text style={{fontSize: 16, marginBottom: 10}}>
          使用自定义错误图片（fallbackImage）：
        </Text>
        <OSSImage
          source={{uri: 'https://invalid-url-that-will-fail.jpg'}}
          fallbackImage="https://example.com/error-image.jpg"
          style={{width: 200, height: 150}}
          className="rounded-lg"
        />
      </View>

      {/* 使用本地错误图片 */}
      <View style={{marginBottom: 20}}>
        <Text style={{fontSize: 16, marginBottom: 10}}>使用本地错误图片：</Text>
        <OSSImage
          source={{uri: 'https://another-invalid-url.jpg'}}
          fallbackImage={require('../../assets/imgs/avatar-default.png')}
          style={{width: 200, height: 150}}
          className="rounded-lg"
        />
      </View>

      {/* 不设置 fallbackImage，使用默认错误图片 */}
      <View style={{marginBottom: 20}}>
        <Text style={{fontSize: 16, marginBottom: 10}}>
          不设置 fallbackImage（使用默认错误图片）：
        </Text>
        <OSSImage
          source={{uri: 'https://third-invalid-url.jpg'}}
          style={{width: 200, height: 150}}
          className="rounded-lg"
        />
      </View>
    </View>
  );
};

export default OSSImageExample;