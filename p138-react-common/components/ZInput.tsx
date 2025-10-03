import React from 'react';
import {
  KeyboardTypeOptions,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// 封装的 TextInput 组件
const ZInput = ({
  value,
  onChangeText,
  placeholder,
  leftIcon,
  rightIcon,
  secureTextEntry,
  keyboardType,
  maxLength,
  style,
  iconStyle,
  className,
}: {
  value?: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions | undefined;
  maxLength?: number;
  style?: object;
  iconStyle?: object;
  className?: string;
}) => {
  return (
    <View
      className={`flex-row items-center border border-gray-300 rounded ${className}`}
      style={style}>
      {/* 左侧图标 */}
      {leftIcon && <View className="mr-2">{leftIcon}</View>}

      {/* 输入框 */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        className="flex-1 py-2"
        style={{fontSize: 16, borderWidth: 0, paddingVertical: 0, ...style}}
      />

      {/* 右侧图标 */}
      {rightIcon && (
        <TouchableOpacity style={iconStyle}>{rightIcon}</TouchableOpacity>
      )}
    </View>
  );
};

export default ZInput;
