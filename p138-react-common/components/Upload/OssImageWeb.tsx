import {DEFAULT_IMAGE} from '../../config';
import {getImageFromOss} from '../../utils/upload/web-upload';
import {Image, Spin} from 'antd';
import type {ImageProps} from 'rc-image';
import React, {useEffect, useRef, useState} from 'react';

interface OSSImageProps extends ImageProps {
  className?: string;
}
export const judgeImage = (src: string) => {
  if (!src) return false;

  if (src.startsWith('http') || src.startsWith('data:image')) {
    return true;
  }
  return false;
};

const OSSImage: React.FC<OSSImageProps & ImageProps> = ({
  className,
  ...props
}) => {
  const {src} = props;
  const [imageUriSource, setImageUriSource] = useState<ImageProps>();
  const [isLoading, setIsLoading] = useState(false);
  const prevSourceRef = useRef<ImageProps>();

  const getImage = async (fileName: string) => {
    try {
      setIsLoading(true);
      const base64 = await getImageFromOss(fileName);
      setImageUriSource({src: base64});
    } catch (error) {
      console.error('加载图片失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof src === 'number') {
      if (prevSourceRef.current === src) {
        return;
      } else {
        prevSourceRef.current = src;
      }
      return;
    } else {
      if (prevSourceRef.current?.src === src) {
        return;
      } else {
        // prevSourceRef.current?.src = src;
      }
    }

    if (!src) {
      setImageUriSource({src: DEFAULT_IMAGE});
      return;
    }

    if (typeof src === 'number') {
      setImageUriSource(src);
      return;
    }

    if (typeof src === 'object') {
      const uri = src.uri;
      if (!uri) return;

      if (src.width && src.height) {
        setImageUriSource(src);
      } else if (uri.startsWith('http') || uri.startsWith('data:image')) {
        setImageUriSource({src});
      } else {
        getImage(uri);
      }
      return;
    }

    // 处理 require 导入的本地图片

    // 处理对象类型的 source
    const uri = src;
    if (!uri) return;
    if (uri.startsWith('http') || uri.startsWith('data:image')) {
      setImageUriSource({src});
    } else {
      getImage(uri);
    }
  }, [src]);

  if (isLoading) {
    return (
      <Spin
        spinning={isLoading}
        className="h-full aspect-auto bg-gray-200"></Spin>
    );
  }

  return (
    <Image
      {...props}
      loading="lazy"
      className={className}
      src={imageUriSource?.src}
      onError={() => {
        console.log('onError', imageUriSource?.src);
        setImageUriSource({src: DEFAULT_IMAGE});
      }}
    />
  );
};

export default OSSImage;
