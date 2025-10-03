import {ImageProps, ImageStyle, StyleProp, ViewStyle} from 'react-native';

export interface ImageUploadItemProps {
  /**
   * 标签
   */
  label?: string;

  /**
   * 图片选中回调
   */
  onImagePicked?: (uris: string[]) => void;
  /**
   * 预览图片样式
   */
  previewImageClassName?: string;
  /**
   * 源
   */
  source?: ImageProps['source']| string[];
  /**
   * 默认图片
   */
  defaultImage?: ImageProps['source'] | string;
  /**
   * 预览图片样式
   */
  previewImageStyle?: StyleProp<ImageStyle>;
  /**
   * 预览图片样式
   */
  previewImageProps?: ImageProps;
  /**
   * 上传按钮样式
   */
  uploadButtonClassName?: string;
  /**
   * 上传按钮样式
   */
  uploadButtonStyle?: StyleProp<ViewStyle>;
  /**
   * 容器样式
   */
  containerClassName?: string;
  /**
   * 容器样式
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * 是否显示清除按钮
   */
  showClearButton?: boolean;
  /**
   * 是否可修改
   */
  canModify?: boolean;
  /**
   * 容器样式
   */
  className?: string;
  /**
   * 容器样式
   */
  style?: StyleProp<ViewStyle>;
  /**
   * 最大上传数量
   */
  maxCount?: number;
  /**
   * 上传按钮图标
   */
  uploadIcon?: React.ReactNode;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 用户ID  用于图片上传归类
   */
  userID: string;
  /**
   * 是否允许修改
   */
  allowModify?: () => boolean;
  /**
   * 是否需要授权
   */
  needAuth?: boolean;
}

export interface VideoUploadItemProps {
  /**
   * 标签
   */
  label?: string;

  /**
   * 视频选中回调
   */
  onVideoPicked?: (uris: string[]) => void;
  /**
   * 预览视频样式
   */
  previewVideoClassName?: string;
  /**
   * 源
   */
  source?: string | string[] | number | {uri: string};
  /**
   * 默认视频
   */
  defaultVideo?: string | string[];
  /**
   * 预览视频样式
   */
  previewVideoStyle?: StyleProp<ViewStyle>;
  /**
   * 预览视频属性
   */
  previewVideoProps?: any;
  /**
   * 上传按钮样式
   */
  uploadButtonClassName?: string;
  /**
   * 上传按钮样式
   */
  uploadButtonStyle?: StyleProp<ViewStyle>;
  /**
   * 容器样式
   */
  containerClassName?: string;
  /**
   * 容器样式
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * 是否显示清除按钮
   */
  showClearButton?: boolean;
  /**
   * 是否可修改
   */
  canModify?: boolean;
  /**
   * 容器样式
   */
  className?: string;
  /**
   * 容器样式
   */
  style?: StyleProp<ViewStyle>;
  /**
   * 最大上传数量
   */
  maxCount?: number;
  /**
   * 上传按钮图标
   */
  uploadIcon?: React.ReactNode;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 用户ID  用于视频上传归类
   */
  userID?: string;
  /**
   * 是否允许修改
   */
  allowModify?: () => boolean;
  /**
   * 最大视频时长（秒）
   */
  maxDuration?: number;
  /**
   * 最大文件大小（MB）
   */
  maxFileSize?: number;
}
