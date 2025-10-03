import React, {useState} from 'react';
import {Alert, Text, View} from 'react-native';
import VideoUpload from './VideoSelector';

const VideoSelectorExample: React.FC = () => {
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

  const handleVideoPicked = (videoUris: string[]) => {
    console.log('选中的视频:', videoUris);
    setSelectedVideos(videoUris);
    Alert.alert('上传成功', `已上传 ${videoUris.length} 个视频`);
  };

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 20}}>
        视频上传示例
      </Text>

      {/* 基础用法 */}
      <Text style={{fontSize: 16, marginBottom: 10}}>基础用法：</Text>
      <VideoUpload
        label="上传视频"
        userID="user123"
        onVideoPicked={handleVideoPicked}
        maxCount={1}
        maxDuration={30}
        maxFileSize={20}
      />

      {/* 多选用法 */}
      <Text style={{fontSize: 16, marginTop: 20, marginBottom: 10}}>
        多选用法：
      </Text>
      <VideoUpload
        label="上传多个视频"
        userID="user123"
        onVideoPicked={handleVideoPicked}
        maxCount={3}
        maxDuration={60}
        maxFileSize={50}
        showClearButton={true}
      />

      {/* 带默认值 */}
      <Text style={{fontSize: 16, marginTop: 20, marginBottom: 10}}>
        带默认值：
      </Text>
      <VideoUpload
        label="默认视频"
        userID="user123"
        source="sample-video.mp4" // OSS文件名
        onVideoPicked={handleVideoPicked}
        maxCount={1}
      />

      {/* 禁用状态 */}
      <Text style={{fontSize: 16, marginTop: 20, marginBottom: 10}}>
        禁用状态：
      </Text>
      <VideoUpload
        label="禁用上传"
        userID="user123"
        onVideoPicked={handleVideoPicked}
        disabled={true}
        maxCount={1}
      />

      {/* 显示已选中的视频 */}
      {selectedVideos.length > 0 && (
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 16, marginBottom: 10}}>已选中的视频：</Text>
          {selectedVideos.map((video, index) => (
            <Text key={index} style={{marginBottom: 5, color: '#666'}}>
              {index + 1}. {video}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default VideoSelectorExample;