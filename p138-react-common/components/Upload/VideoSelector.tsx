import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Ionicons} from '@expo/vector-icons';
import CustomModal from '../CustomModal';
import {AVPlaybackStatus, ResizeMode, Video} from 'expo-av';

import {getImageFromOss, uploadToOss} from '../../utils/upload/rn-upload';
import {kScreenHeight, kScreenWidth} from '../../utils/fuc/fc.rn';
import {VideoUploadItemProps} from './upload';

// 获取OSS视频URL的函数
const getVideoFromOss = async (fileName: string): Promise<string> => {
  try {
    // 这里应该调用你的OSS获取视频的方法
    // 类似于 getImageFromOss 的实现
    const videoUrl = await getImageFromOss(fileName);
    return videoUrl;
  } catch (error) {
    console.error('获取OSS视频失败:', error);
    return '';
  }
};

const VideoUpload: React.FC<VideoUploadItemProps> = ({
  label = '',
  source,
  defaultVideo,
  previewVideoClassName,
  previewVideoStyle,
  uploadButtonClassName,
  uploadButtonStyle,
  previewVideoProps,
  containerClassName,
  containerStyle,
  onVideoPicked,
  showClearButton = false,
  canModify = true,
  className,
  style,
  maxCount = 1,
  uploadIcon,
  userID,
  disabled = false,
  allowModify,
  maxDuration = 60, // 默认最大60秒
  maxFileSize = 50, // 默认最大50MB
}) => {
  const [videoUris, setVideoUris] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]); // 存储OSS视频URL
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
 
    const loadVideoUrls = async () => {
      let uris: string[] = [];

      if (source) {
        if (typeof source === 'string') {
          
          uris = [source];
        } else if (Array.isArray(source)) {
         
          uris = source;
        } else if (typeof source === 'number') {
          uris = [source.toString()];
        } else if (typeof source === 'object') {
          uris = [source.uri];
        }
      } else if (defaultVideo) {
        if (typeof defaultVideo === 'string') {
          uris = [defaultVideo];
        } else if (Array.isArray(defaultVideo)) {
          uris = defaultVideo;
        }
      }

      setVideoUris(uris);

      // 获取OSS视频URL
      const urls = await Promise.all(
        uris.map(async uri => {
          if (uri.startsWith('http')) {
            return uri; // 如果是完整URL，直接使用
          } else {
            return await getVideoFromOss(uri); // 否则从OSS获取
          }
        }),
      );

      setVideoUrls(urls.filter(url => url !== ''));
    };

    loadVideoUrls();
  }, [source, defaultVideo]);

  const validateVideo = (asset: ImagePicker.ImagePickerAsset): boolean => {
    // 检查文件大小
    if (asset.fileSize && asset.fileSize > maxFileSize * 1024 * 1024) {
      alert(`视频文件大小不能超过${maxFileSize}MB`);
      return false;
    }

    // 检查视频时长
    if (asset.duration && asset.duration > maxDuration) {
      alert(`视频时长不能超过${maxDuration}秒`);
      return false;
    }

    return true;
  };

  const updateVideos = async (videoInfo: ImagePicker.ImagePickerAsset) => {
    // 验证视频
    if (!validateVideo(videoInfo)) {
      return;
    }

    if (!userID) {
      console.error('userID is required for video upload');
      return;
    }

    const fileName = await uploadToOss(videoInfo, userID);
    if (fileName) {
      // 获取OSS视频URL
      const videoUrl = await getVideoFromOss(fileName);

      if (maxCount === 1) {
        setVideoUris([fileName]);
        setVideoUrls([videoUrl]);
        onVideoPicked && onVideoPicked([fileName]);
      } else {
        const newUris = [...videoUris, fileName];
        const newUrls = [...videoUrls, videoUrl];
        setVideoUris(newUris);
        setVideoUrls(newUrls);
        onVideoPicked && onVideoPicked(newUris);
      }
    }
  };

  const pickVideoFromGallery = async () => {
    setIsModalVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
      allowsMultipleSelection: maxCount > 1,
      selectionLimit: maxCount - videoUris.length,
      videoMaxDuration: maxDuration,
    });

    if (!result.canceled && result.assets.length > 0) {
      for (const asset of result.assets) {
        await updateVideos(asset);
      }
    }
  };

  const takeVideo = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
      videoMaxDuration: maxDuration,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      await updateVideos(result.assets[0]);
      setIsModalVisible(false);
    }
  };

  const deleteVideo = (index: number) => {
    const newUris = videoUris.filter((_, i) => i !== index);
    const newUrls = videoUrls.filter((_, i) => i !== index);
    setVideoUris(newUris);
    setVideoUrls(newUrls);
    onVideoPicked && onVideoPicked(newUris);
  };

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
    }
  };

  const handleClosePreview = () => {
    if (videoRef.current) {
      videoRef.current.stopAsync();
    }
    setIsPlaying(false);
    setIsPreviewModalVisible(false);
  };

  return (
    <View className={className} style={style}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          className={`flex-row ${containerClassName}`}
          style={containerStyle}>
          {videoUris.map((uri, index) => {
            const videoUrl = videoUrls[index];
            return (
              <View key={index} className="relative mr-2 flex-row">
                <TouchableOpacity
                  disabled={disabled}
                  onPress={() => {
                    if (allowModify && !allowModify()) {
                      return;
                    }

                    if (showClearButton) {
                      setPreviewVideo(videoUrl);
                      setIsPreviewModalVisible(true);
                    } else {
                      if (canModify) {
                        setIsModalVisible(true);
                      } else {
                        setPreviewVideo(videoUrl);
                        setIsPreviewModalVisible(true);
                      }
                    }
                  }}
                  className={previewVideoClassName}>
                  <View
                    className="w-36 h-28 rounded-lg bg-gray-200 justify-center items-center relative"
                    style={[{width: 100, height: 100}, previewVideoStyle]}
                    {...previewVideoProps}>
                    {/* 视频缩略图 */}
                    {videoUrl ? (
                      <Video
                        source={{uri: videoUrl}}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 8,
                          position: 'absolute',
                        }}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay={false}
                        isMuted={true}
                        useNativeControls={false}
                      />
                    ) : (
                      <View className="w-full h-full bg-gray-300 rounded-lg" />
                    )}

                    {/* 播放按钮覆盖层 */}
                    <View className="absolute inset-0 justify-center items-center bg-black bg-opacity-30 rounded-lg">
                      <Ionicons name="play-circle" size={20} color="white" />
                    </View>
                  </View>
                </TouchableOpacity>
                {showClearButton && (
                  <TouchableOpacity
                    className="absolute top-1 right-1 z-10"
                    onPress={() => deleteVideo(index)}>
                    <Ionicons name="close-circle" size={30} color="gray" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
          {videoUris.length < maxCount && (
            <TouchableOpacity
              className={`justify-center items-center ${uploadButtonClassName}`}
              style={uploadButtonStyle}
              onPress={() => setIsModalVisible(true)}>
              {uploadIcon ? (
                uploadIcon
              ) : (
                <Ionicons name="videocam" size={40} color="#007BFF" />
              )}
              <Text className="mt-2 text-blue-500 text-sm">{label}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <CustomModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        position="bottom">
        <View
          style={{width: kScreenWidth}}
          className="bg-[#f0f0f0] rounded-lg items-center h-48 w-full justify-between overflow-hidden">
          <View style={{width: '100%'}} className="w-full bg-white">
            <TouchableOpacity
              className="py-3 px-4 border-b border-gray-300 w-full items-center justify-center"
              onPress={pickVideoFromGallery}>
              <Text className="text-lg">从相册选择视频</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-3 px-4 border-b border-gray-300 w-full items-center justify-center"
              onPress={takeVideo}>
              <Text className="text-lg">录制视频</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="py-4 px-4 w-full items-center justify-center bg-white"
            onPress={() => setIsModalVisible(false)}>
            <Text className="text-lg">取消</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>

      <CustomModal
        isVisible={isPreviewModalVisible}
        onClose={handleClosePreview}>
        <View
          className="rounded-lg relative  file: justify-center items-center bg-black"
          style={{width: kScreenWidth, height: kScreenHeight}}>
          {previewVideo && (
            <Video
              ref={videoRef}
              source={{uri: previewVideo}}
              style={{
                width: kScreenWidth,
                height: kScreenHeight,
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}
              useNativeControls={true}
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              onPlaybackStatusUpdate={handleVideoStatusUpdate}
            />
          )}

          {/* 播放控制按钮 */}
          <View
            className="absolute     top-0 left-0 right-0 flex-row  "
            style={{
              position: 'absolute',
              top: 50,
            }}>
            <TouchableOpacity
              onPress={handlePlayPause}
              className=" bg-opacity-30 rounded-full p-4 mx-2">
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={30}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleClosePreview}
              className="  bg-opacity-30 rounded-full p-4 mx-2">
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>
    </View>
  );
};

export default VideoUpload;
