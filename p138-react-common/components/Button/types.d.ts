import {ReactNode, StyleProp, TextStyle, ViewStyle} from 'react-native';

export type ButtonType =
  | 'primary'
  | 'default'
  | 'dashed'
  | 'link'
  | 'text'
  | 'gray';
export type ButtonSize = 'large' | 'middle' | 'small';
export type ButtonShape = 'default' | 'circle' | 'round';
export type ButtonHTMLType = 'button' | 'submit' | 'reset';

export interface ButtonProps {
  // 基础属性
  title?: string;
  children?: ReactNode;
  onClick?: () => void;
  onPress?: () => void;

  // 类型和样式
  type?: ButtonType;
  size?: ButtonSize;
  shape?: ButtonShape;
  htmlType?: ButtonHTMLType;

  // 状态
  disabled?: boolean;
  loading?: boolean;
  ghost?: boolean;
  danger?: boolean;
  block?: boolean;

  // 样式
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  className?: string;

  // 图标
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';

  // 其他
  activeOpacity?: number;
  rippleColor?: string;
  rippleDuration?: number;

  // 事件
  onLongPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
}