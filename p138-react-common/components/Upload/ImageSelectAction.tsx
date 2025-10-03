import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import CustomModal from '../CustomModal';

import {uploadToOss} from '../../utils/upload/rn-upload';
import {ImageProps} from 'expo-image';
import {kScreenWidth} from '../../utils/fuc/fc.rn';

interface ImageUploadItemProps {
  source?: ImageProps['source'];
  isVisible: boolean;
  onImagePicked?: (uri?: string) => void; // 回调上传的图片 URI
  onClose: () => void;
  userID: string;
}

const ImageSelectAction: React.FC<ImageUploadItemProps> = ({
  source,
  isVisible,
  onClose,
  onImagePicked,
  userID,
}) => {
  const [imageUri, setImageUri] = useState<ImageProps['source']>(source);

  console.log(imageUri, 'imageUri');
  useEffect(() => {
    setImageUri(source);
  }, [source]);
  const updateImgage = async (imageInfo: ImagePicker.ImagePickerAsset) => {
    const fileName = await uploadToOss(imageInfo, userID);

    if (fileName) {
      setImageUri({uri: fileName});
      onImagePicked && onImagePicked(fileName);
    }
  };

  // 打开相册选择图片
  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      updateImgage(result.assets[0]);

      onClose(); // 关闭模态框
    }
  };

  // 打开相机拍照
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      updateImgage(result.assets[0]);
      onClose(); // 关闭模态框
    }
  };

  return (
    <CustomModal isVisible={isVisible} onClose={onClose} position="bottom">
      <View
        style={{width: kScreenWidth}}
        className="bg-[#f0f0f0] rounded-lg items-center h-48 w-full justify-between overflow-hidden">
        <View style={{width: '100%'}} className="w-full bg-white">
          <TouchableOpacity
            className="py-3 px-4 border-b border-gray-300 w-full items-center justify-center"
            style={{
              width: '100%',
            }}
            onPress={pickImageFromGallery}>
            <Text className="text-lg">从相册选择</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-3 px-4 border-b border-gray-300 w-full items-center justify-center"
            onPress={takePhoto}>
            <Text className="text-lg">拍照上传</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="py-4 px-4 w-full items-center justify-center bg-white"
          onPress={onClose}>
          <Text className="text-lg">取消</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

export default ImageSelectAction;
