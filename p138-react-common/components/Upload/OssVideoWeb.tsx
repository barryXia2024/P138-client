import {getFileFromOss} from '../../utils/upload/web-upload';
import {Modal, Spin} from 'antd';
import {PlayCircleOutlined} from '@ant-design/icons';
import React, {useEffect, useRef, useState} from 'react';

interface OSSVideoProps {
  src?: string | {uri: string};
  className?: string;
  style?: React.CSSProperties;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  width?: number | string;
  height?: number | string;
  onError?: () => void;
  onLoad?: () => void;
  preview?: boolean; // 是否启用预览模式
  previewWidth?: number | string; // 预览时的宽度
  previewHeight?: number | string; // 预览时的高度
}

export const judgeVideo = (src: string) => {
  if (!src) return false;

  // 检查是否是完整的URL
  if (src.startsWith('http') || src.startsWith('data:video')) {
    return true;
  }

  // 检查文件扩展名
  const videoExtensions = [
    '.mp4',
    '.avi',
    '.mov',
    '.wmv',
    '.flv',
    '.webm',
    '.mkv',
  ];
  const extension = src.toLowerCase().split('.').pop();

  return videoExtensions.includes(`.${extension}`);
};

const OSSVideo: React.FC<OSSVideoProps> = ({
  src,
  className,
  style,
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  poster,
  width,
  height,
  onError,
  onLoad,
  preview = false,
  previewWidth = 800,
  previewHeight = 600,
}) => {
  const [videoSrc, setVideoSrc] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const prevSourceRef = useRef<string | {uri: string}>();

  // 调试状态变化
  useEffect(() => {
    console.log('预览状态变化:', previewVisible);
  }, [previewVisible]);

  const getVideo = async (fileName: string) => {
    try {
      setIsLoading(true);
      const base64 = await getFileFromOss(fileName);
      setVideoSrc(base64);
    } catch (error) {
      console.error('加载视频失败:', error);
      onError?.();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 比较当前src和之前的src
    if (typeof src === 'string' && typeof prevSourceRef.current === 'string') {
      if (prevSourceRef.current === src) {
        return;
      }
    } else if (
      typeof src === 'object' &&
      typeof prevSourceRef.current === 'object'
    ) {
      if (prevSourceRef.current?.uri === src?.uri) {
        return;
      }
    }

    prevSourceRef.current = src;

    if (!src) {
      setVideoSrc(undefined);
      return;
    }

    // 处理对象类型的 source
    if (typeof src === 'object') {
      const uri = src.uri;
      if (!uri) return;

      if (uri.startsWith('http') || uri.startsWith('data:video')) {
        setVideoSrc(uri);
      } else {
        getVideo(uri);
      }
      return;
    }

    // 处理字符串类型的 source
    if (typeof src === 'string') {
      if (src.startsWith('http') || src.startsWith('data:video')) {
        setVideoSrc(src);
      } else {
        getVideo(src);
      }
    }
  }, [src]);

  if (isLoading) {
    return (
      <div
        className={`w-full h-full bg-gray-200 flex items-center justify-center ${className}`}
        style={style}>
        <Spin spinning={isLoading} />
        <span className="ml-2">加载视频中...</span>
      </div>
    );
  }

  if (!videoSrc) {
    return (
      <div
        className={`w-full h-full bg-gray-200 flex items-center justify-center ${className}`}
        style={style}>
        <span>暂无视频</span>
      </div>
    );
  }

  // 预览模式：显示缩略图和播放按钮
  if (preview) {
    return (
      <>
        <div
          className={`relative cursor-pointer ${className}`}
          style={style}
          onClick={() => {
            console.log('点击预览容器，设置预览可见');
            setPreviewVisible(true);
          }}>
          {/* 视频缩略图 - 不显示控制按钮 */}
          <video
            className="w-full h-full object-cover"
            src={videoSrc}
            muted={true}
            controls={false}
            width={width}
            height={height}
            onError={() => {
              console.log('视频缩略图加载失败', videoSrc);
              onError?.();
            }}
          />

          {/* 播放按钮遮罩 */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center hover:bg-opacity-50 transition-all duration-200"
            onClick={e => {
              e.stopPropagation();
              console.log('点击播放按钮遮罩');
              setPreviewVisible(true);
            }}>
            <div className="bg-white bg-opacity-20 rounded-full p-3 backdrop-blur-sm">
              <PlayCircleOutlined
                className="  text-5xl"
                style={{fontSize: '30px'}}
              />
            </div>
          </div>
        </div>

        {/* 预览弹窗 */}
        <Modal
          title="视频预览"
          open={previewVisible}
          onCancel={() => {
            console.log('关闭预览弹窗');
            setPreviewVisible(false);
          }}
          onOk={() => {
            console.log('确认关闭预览弹窗');
            setPreviewVisible(false);
          }}
          footer={null}
          width={previewWidth}
          destroyOnClose
          maskClosable={true}
          keyboard={true}
          centered>
          <div className="flex justify-center">
            <video
              className="w-full max-w-full"
              src={videoSrc}
              controls={true}
              autoPlay={true}
              muted={muted}
              loop={loop}
              poster={poster}
              height={previewHeight}
              onError={() => {
                console.log('视频加载失败', videoSrc);
                onError?.();
              }}
              onLoadedData={() => {
                console.log('视频加载成功');
                onLoad?.();
              }}>
              您的浏览器不支持视频播放。
            </video>
          </div>
        </Modal>
      </>
    );
  }

  // 正常模式：直接显示视频
  return (
    <video
      className={className}
      style={style}
      src={videoSrc}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      poster={poster}
      width={width}
      height={height}
      onError={() => {
        console.log('视频加载失败', videoSrc);
        onError?.();
      }}
      onLoadedData={() => {
        console.log('视频加载成功');
        onLoad?.();
      }}>
      您的浏览器不支持视频播放。
    </video>
  );
};

export default OSSVideo;