import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {uploadToOss} from '../../utils/upload/rn-upload';
import {useUserStore} from 'src/store';

interface UploadProps {
  type?: 'image' | 'video';
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  maxSize?: number; // 文件大小限制(单位:MB)
  children?: React.ReactNode;
  className?: string;
  style?: any;
}

export const Upload: React.FC<UploadProps> = ({
  type = 'image',
  onUploadSuccess,
  onUploadError,
  maxSize = 2,
  children,
  className,
  style,
}) => {
  const [loading, setLoading] = useState(false);
  const {loginInfo} = useUserStore();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          type === 'image'
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false, // 关闭裁剪功能
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // 检查文件大小
        if (asset.fileSize && asset.fileSize > maxSize * 1024 * 1024) {
          Toast.show(`文件大小不能超过${maxSize}MB`);
          return;
        }

        setLoading(true);
        try {
          const url = await uploadToOss(asset, loginInfo?.userID ?? '');
          onUploadSuccess?.(url);
          setLoading(false);
        } catch (error) {
          console.error('上传失败:', error);
          onUploadError?.(error as Error);
          Toast.show('上传失败');
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('选择文件失败:', error);
      Toast.show('选择文件失败');
    }
  };

  return (
    <TouchableOpacity
      onPress={pickImage}
      disabled={loading}
      className={className}
      style={style}>
      {loading ? (
        <View className="items-center justify-center">
          <ActivityIndicator size="small" color="#0000ff" />
          <Text className="mt-2 text-sm text-gray-500">上传中...</Text>
        </View>
      ) : (
        children || (
          <View className="items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg">
            <Image
              source={require('src/assets/jpImages/icon_upload2.png')}
              className="w-8 h-8"
            />
            <Text className="mt-2 text-sm text-gray-500">
              {type === 'image' ? '点击上传图片' : '点击上传视频'}
            </Text>
          </View>
        )
      )}
    </TouchableOpacity>
  );
};

export default Upload;