import {getImageUrl} from '@/p138-react-common/utils/fuc';
import {getImageFromOss} from '@/p138-react-common/utils/upload/rn-upload';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Spinner} from 'tamagui';
import {Image, ImageProps, ImageSourcePropType, View} from 'react-native';
import {DEFAULT_IMAGE} from 'src/config/env';
import { useFocusEffect } from 'expo-router';

// 组件级别的缓存，避免重复请求
const componentCache = new Map<string, string>();

// 清理组件缓存的工具函数
export const clearOSSImageCache = (fileName?: string) => {
  if (fileName) {
    componentCache.delete(fileName);
  } else {
    componentCache.clear();
  }
};

interface OSSImageProps {
  className?: string;
  needAuth?: boolean;
  fallbackImage?: string;
  defaultImage?: string;
}

const OSSImage: React.FC<OSSImageProps & ImageProps> = ({
  className,
  needAuth = false,
  fallbackImage,
  defaultImage = DEFAULT_IMAGE,
  ...props
}) => {
  const {source} = props;
  const [imageUriSource, setImageUriSource] = useState<ImageProps['source']>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const prevUriRef = useRef<string | number | null>(null);
  const isLoadingRef = useRef(false);

  const getOssImage = async (fileName: string) => {
    // 检查组件级缓存
    if (componentCache.has(fileName)) {
      const cachedUri = componentCache.get(fileName);
      setImageUriSource({uri: cachedUri});
      setIsFailed(false);
      return;
    }

    // 防止重复请求
    if (isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      setIsLoading(true);
      setIsFailed(false);
      
      const base64 = await getImageFromOss(fileName);
      
      // 缓存成功的结果
      componentCache.set(fileName, base64);
      
      setImageUriSource({uri: base64});
      setIsLoading(false);
      isLoadingRef.current = false;
    } catch (error) {
      console.error('加载图片失败:', JSON.stringify(error));
      setIsFailed(true);
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  const getImage = (source?: ImageSourcePropType) => {
    if (!source) {
      if (prevUriRef.current !== defaultImage) {
        prevUriRef.current = defaultImage;
        setImageUriSource({uri: defaultImage});
        setIsFailed(false);
      }
      return;
    }

    // 本地静态资源
    if (typeof source === 'number') {
      if (prevUriRef.current !== source) {
        prevUriRef.current = source;
        setImageUriSource(source);
        setIsFailed(false);
      }
      return;
    }
   
    if (typeof source === 'object' && !Array.isArray(source) && source.uri) {
      const uri = source.uri;
      
      // 优化缓存判断：相同URI且不在加载中且没有失败时才跳过
      if (prevUriRef.current === uri && !isLoadingRef.current && !isFailed) {
        return;
      }

      prevUriRef.current = uri;

      if (uri.startsWith('http') || uri.startsWith('data:image')) {
        // HTTP URL 处理：检查组件缓存
        const cacheKey = `http_${uri}`;
        if (componentCache.has(cacheKey)) {
          const cachedUri = componentCache.get(cacheKey);
          setImageUriSource({uri: cachedUri});
          setIsFailed(false);
        } else {
          // 对于 HTTP URL，直接使用处理后的 URL
          const processedUrl = getImageUrl(uri);
          setImageUriSource({uri: processedUrl});
          setIsFailed(false);
          // 缓存处理后的 URL
          componentCache.set(cacheKey, processedUrl);
        }
      } else if (source.width) {
        setImageUriSource(source);
        setIsFailed(false);
      } else {
        // OSS 文件名，使用缓存机制
        getOssImage(uri);
      }
    } else if (typeof source === 'object' && !Array.isArray(source) && !source.uri) {
      getOssImage(defaultImage);
    }
  };

  useEffect(() => {
    getImage(source);
  }, [source]);

  // 优化焦点重试逻辑
  useFocusEffect(
    useCallback(() => {
      // 只有在失败状态下才重试
      if (isFailed && source && typeof source === 'object' && !Array.isArray(source) && source.uri) {
        const uri = source.uri;
        // 只对 OSS 文件名重试，不对 HTTP URL 重试
        if (!uri.startsWith('http') && !uri.startsWith('data:image')) {
          getImage(source);
        }
      }
    }, [isFailed, source]),
  );

  // 加载状态
  if (isLoading) {
    return (
      <View className={className}>
        <Spinner size="large" color="$red10" />
      </View>
    );
  }

  // 失败状态：显示默认图片而不是 null
  if (isFailed) {
    return (
      <Image
        {...props}
        className={className}
        source={{uri: fallbackImage || defaultImage}}
        onError={() => {
          console.log('默认图片也加载失败');
        }}
      />
    );
  }

  return (
    <Image
      {...props}
      className={className}
      source={imageUriSource}
      onError={e => {
        console.log(e, '图片加载失败');
        setIsFailed(true);
        // 不自动重试，让用户手动触发或通过焦点重试
      }}
    />
  );
};

export default OSSImage;
