import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Ionicons} from '@expo/vector-icons';
import CustomModal from '../CustomModal';

import {uploadToOss} from '../../utils/upload/rn-upload';
import OSSImage from './OSSImage';
import {kScreenHeight, kScreenWidth} from '../../utils/fuc/fc.rn';
import {ImageUploadItemProps} from './upload';

const ImageUpload: React.FC<ImageUploadItemProps> = ({
  label = '',
  source,
  defaultImage,
  previewImageClassName,
  previewImageStyle,
  uploadButtonClassName,
  uploadButtonStyle,
  previewImageProps,
  containerClassName,
  containerStyle,
  onImagePicked,
  showClearButton = false,
  canModify = true,
  className,
  style,
  maxCount = 1,
  uploadIcon,
  userID,
  disabled = false,
  allowModify,
}) => {
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>();

  useEffect(() => {
    
    if (source) {
      if (typeof source === 'string') {
     
        setImageUris([source]);
      } else if (Array.isArray(source)) {
 
        setImageUris(source);
      } else if (typeof source === 'number') {
        setImageUris([source.toString()]);
      } else if (typeof source === 'object') {
        setImageUris([source.uri]);
      }
    } else if (defaultImage) {
      if (typeof defaultImage === 'string') {
        setImageUris([defaultImage]);
      } else if (Array.isArray(defaultImage)) {
        setImageUris(defaultImage);
      }
    }
  }, [source, defaultImage]);

  const updateImages = async (imageInfo: ImagePicker.ImagePickerAsset) => {
    const fileName = await uploadToOss(imageInfo, userID);
    if (fileName) {
      if (maxCount === 1) {
        setImageUris([fileName]);
        onImagePicked && onImagePicked([fileName]);
      } else {
        const newUris = [...imageUris, fileName];
        setImageUris(newUris);
        onImagePicked && onImagePicked(newUris);
      }
    }
  };

  const pickImageFromGallery = async () => {
    setIsModalVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: maxCount > 1,
      selectionLimit: maxCount - imageUris.length,
    });

    if (!result.canceled && result.assets.length > 0) {
      for (const asset of result.assets) {
        await updateImages(asset);
      }
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      await updateImages(result.assets[0]);
      setIsModalVisible(false);
    }
  };

  const deleteImage = (index: number) => {
    const newUris = imageUris.filter((_, i) => i !== index);
    setImageUris(newUris);
    onImagePicked && onImagePicked(newUris);
  };
 
  return (
    <View className={className} style={style}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          className={` flex-row ${containerClassName}`}
          style={containerStyle}>
          {imageUris.map((uri, index) => (
            <View key={index} className="relative mr-2 flex-row">
              <TouchableOpacity
                disabled={disabled}
                onPress={() => {
                  if (allowModify && !allowModify()) {
                    return;
                  }

                  if (showClearButton) {
                    setPreviewImage(uri);
                    setIsPreviewModalVisible(true);
                  } else {
                    if (canModify) {
                      setIsModalVisible(true);
                    } else {
                      setPreviewImage(uri);
                      setIsPreviewModalVisible(true);
                    }
                  }
                }}
                className={previewImageClassName}>
                <OSSImage
                  source={{uri}}
                  className="w-36 h-28 rounded-lg"
                  resizeMode="contain"
                  style={[{width: 40, height: 40}, previewImageProps?.style]}
                  {...previewImageProps}
                />
              </TouchableOpacity>
              {showClearButton && (
                <TouchableOpacity
                  className="absolute top-1 right-1 z-10"
                  onPress={() => deleteImage(index)}>
                  <Ionicons name="close-circle" size={30} color="gray" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          {imageUris.length < maxCount && (
            <TouchableOpacity
              className={`justify-center items-center ${uploadButtonClassName}`}
              style={uploadButtonStyle}
              onPress={() => setIsModalVisible(true)}>
              {uploadIcon ? (
                uploadIcon
              ) : (
                <Ionicons name="camera" size={40} color="#007BFF" />
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
            onPress={() => setIsModalVisible(false)}>
            <Text className="text-lg">取消</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>

      <CustomModal
        isVisible={isPreviewModalVisible}
        onClose={() => setIsPreviewModalVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          className="rounded-lg  relative w-full h-[100%] justify-center items-center"
          style={{width: kScreenWidth, height: kScreenHeight}}
          onPress={() => setIsPreviewModalVisible(false)}>
          <OSSImage
            source={{uri: previewImage}}
            className="w-full h-full rounded-lg"
            style={{width: '100%', height: kScreenHeight * 0.95}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </CustomModal>
    </View>
  );
};

export default ImageUpload;
