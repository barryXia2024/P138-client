// 138.apk下载页面
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from '@/p138-react-common/components/Button';

// @ts-expect-error - ali-oss没有类型声明
import OSS from 'ali-oss';
import request from 'src/api/request';

function getAppDownloadUrl2(
  query: ServerCoreFilestroage.GetOSSAuthCommandQuery,
) {
  return request<
    BasicTypes.DefaultResponseWrapper<ServerCoreFilestroage.OssInfo>
  >({
    method: 'GET',
    url: '/api/v1/oss/get-app-download-auth',
    ignoreAuth: true,
    query,
  });
}

const DownloadApp: React.FC = () => {
  const [client, setClient] = useState<OSS>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<
    'idle' | 'downloading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    handleSubmit();
  }, []);

  const handleSubmit = async () => {
    try {
      const msg = await getAppDownloadUrl2({
        ossVendor: 'aliyun',
      });

      if (msg.data) {
        // 判断是否配置了自定义域名
       

        const client = new OSS({
          region: msg.data.region,
          accessKeyId: msg.data.accessKeyID,
          accessKeySecret: msg.data.accessKeySecret,
          stsToken: msg.data.securityToken,
          bucket: 'liangzai-dev-p138',
          secure: true,
          timeout: 60000,
          endpoint: msg.data.endpoint ,
          cname: true, // 开启 CNAME 模式
        });

        setClient(client);
      }
    } catch {
      setErrorMessage('获取下载权限失败');
      setDownloadStatus('error');
    }
  };

  const handleDownload = async () => {
    if (!client) {
      Toast.show('下载服务未就绪，请稍后重试');
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadStatus('downloading');
      setErrorMessage('');

      // 生成签名 URL
      const fileUrl = client.signatureUrl(
        'https://liangzai-dev-p138.oss-cn-hongkong.aliyuncs.com/1966849874116530176/ossimg_138.apk',
        {
          expires: 3600, // 1小时有效期
        },
      );

      // H5 场景：fetch 下载再触发浏览器保存
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('下载失败');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = '138.apk';
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      setDownloadStatus('success');
      Toast.show('下载完成！');
      setIsDownloading(false);
    } catch (e) {
      console.error(e);
      setErrorMessage('下载失败，请检查网络连接');
      setDownloadStatus('error');
      Toast.show('下载失败，请重试');
      setIsDownloading(false);
    }
  };

  const renderContent = () => {
    switch (downloadStatus) {
      case 'downloading':
        return (
          <View style={styles.container}>
            <Text style={styles.title}>正在下载应用...</Text>
            <Text style={styles.statusText}>请稍候，浏览器正在下载文件...</Text>
            <Text style={styles.tipText}>
              如果下载没有开始，请检查浏览器是否阻止了下载
            </Text>
          </View>
        );

      case 'success':
        return (
          <View style={styles.container}>
            <Text style={styles.title}>下载已开始！</Text>
            <Text style={styles.successText}>文件正在下载到您的设备</Text>
            <Text style={styles.tipText}>请检查浏览器的下载文件夹</Text>
            <Button
              title="重新下载"
              type="primary"
              onPress={handleDownload}
              style={styles.button}
            />
          </View>
        );

      case 'error':
        return (
          <View style={styles.container}>
            <Text style={styles.title}>下载失败</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Button
              title="重试下载"
              type="primary"
              onPress={handleDownload}
              style={styles.button}
            />
          </View>
        );

      default:
        return (
          <View style={styles.container}>
            <Text style={styles.title}>下载应用</Text>
            <Text style={styles.description}>
              点击下方按钮下载最新版本的138应用
            </Text>
            <Text style={styles.tipText}>支持Android设备安装</Text>
            <Button
              title="开始下载"
              type="primary"
              size="large"
              onPress={handleDownload}
              disabled={isDownloading}
              loading={isDownloading}
              style={styles.button}
            />
          </View>
        );
    }
  };

  return renderContent();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  button: {
    width: '100%',
    maxWidth: 300,
    marginTop: 20,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    color: '#52c41a',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4d4f',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default DownloadApp;
