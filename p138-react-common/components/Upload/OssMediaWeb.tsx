import React from 'react';
import OSSImage, {judgeImage} from './OssImageWeb';
import OSSVideo, {judgeVideo} from './OssVideoWeb';

interface OSSMediaProps {
  src?: string | {uri: string};
  className?: string;
  style?: React.CSSProperties;
  // 图片相关属性
  imageProps?: any;
  // 视频相关属性
  videoProps?: {
    controls?: boolean;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    poster?: string;
    width?: number | string;
    height?: number | string;
    preview?: boolean;
    previewWidth?: number | string;
    previewHeight?: number | string;
  };
  // 预览相关属性
  preview?: boolean;
  previewWidth?: number | string;
  previewHeight?: number | string;
  alt?: string;
  onError?: () => void;
  onLoad?: () => void;
}

const OSSMedia: React.FC<OSSMediaProps> = ({
  src,
  className,
  style,
  imageProps = {},
  videoProps = {},
  preview,
  previewWidth,
  previewHeight,
  alt,
  onError,
  onLoad,
}) => {
  const getMediaType = (
    src: string | {uri: string} | undefined,
  ): 'image' | 'video' | 'unknown' => {
    if (!src) return 'unknown';

    let srcString: string;

    if (typeof src === 'string') {
      srcString = src;
    } else if (typeof src === 'object' && src.uri) {
      srcString = src.uri;
    } else {
      return 'unknown';
    }

    // 检查是否是视频
    if (judgeVideo(srcString)) {
      return 'video';
    }

    // 检查是否是图片
    if (judgeImage(srcString)) {
      return 'image';
    }

    // 根据文件扩展名判断
    const extension = srcString.toLowerCase().split('.').pop();
    const videoExtensions = [
      '.mp4',
      '.avi',
      '.mov',
      '.wmv',
      '.flv',
      '.webm',
      '.mkv',
    ];
    const imageExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.webp',
      '.svg',
    ];

    if (videoExtensions.includes(`.${extension}`)) {
      return 'video';
    }

    if (imageExtensions.includes(`.${extension}`)) {
      return 'image';
    }

    return 'unknown';
  };

  const mediaType = getMediaType(src);

  if (mediaType === 'video') {
    return (
      <OSSVideo
        src={src}
        className={className}
        style={style}
        onError={onError}
        onLoad={onLoad}
        preview={preview}
        previewWidth={previewWidth}
        previewHeight={previewHeight}
        {...videoProps}
      />
    );
  }

  if (mediaType === 'image') {
    return (
      <OSSImage
        src={src}
        className={className}
        style={style}
        onError={onError}
        alt={alt}
        {...imageProps}
      />
    );
  }

  // 未知类型或没有src时，显示默认内容
  return (
    <div
      className={`w-full h-full bg-gray-200 flex items-center justify-center ${className}`}
      style={style}>
      <span>不支持的文件类型</span>
    </div>
  );
};

export default OSSMedia;