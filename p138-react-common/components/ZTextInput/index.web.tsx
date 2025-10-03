import {ICON_SIZES} from '../../utils/styles/theme';
import React from 'react';
import {
  Image,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Input} from 'tamagui';

// 定义 Props 类型
interface CustomTextInputProps extends TextInputProps {
  label?: string; // 输入框的标签
  labelPosition?: 'top' | 'left'; // 标签位置
  labelStyle?: StyleProp<TextStyle>;
  className?: string;
  error?: string; // 错误提示信息
  secure?: boolean; // 是否为密码输入框
  value: string; // 输入框的值
  onChangeText: (text: string) => void; // 输入内容变化时的回调
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
}
const hideEye = require('src/assets/imgs/icon_login_hideye.png');
const showEye = require('src/assets/imgs/icon_login_eye.png');
const ZTextInput: React.FC<CustomTextInputProps> = ({
  label,
  labelPosition = 'top',
  labelStyle,
  className,
  error,
  secure = false,
  value,
  textStyle,
  onChangeText,
  containerStyle,
  suffix,
  prefix,
  ...props
}) => {
  const [isSecure, setIsSecure] = React.useState(secure);
  const [inputLayout, setInputLayout] = React.useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  return (
    <View className={`${className}`}>
      {/* 标签 */}
      {label && labelPosition === 'top' && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}

      {/* 输入框及可见图标 */}
      <View
        style={[
          styles.inputWrapper,
          error && {borderColor: '#f53b57'},
          styles.input,
          containerStyle,
        ]}>
        {prefix && prefix}
        {label && labelPosition === 'left' && (
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        )}
        <Input
          {...props}
          style={[
            {flex: 1, height: '100%',borderWidth:0 ,backgroundColor: 'transparent',fontSize: 16},
            error && {borderColor: '#f53b57'},
            textStyle,
          ]}
          value={value}
          editable={props.editable !== false}
          onChangeText={onChangeText}
          placeholderTextColor={'#ccc'}
          secureTextEntry={isSecure}
        />

        {suffix && suffix}
        {secure && Platform.OS !== 'web' && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
            <Image
              source={isSecure ? hideEye : showEye}
              style={{width: ICON_SIZES.medium, height: ICON_SIZES.medium}}
            />
          </TouchableOpacity>
        )}
      </View>
      {/* 错误提示 */}
      {error && (
        <Text
          style={[
            styles.errorText,
            {
              marginLeft: inputLayout.x,
            
            },
          ]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#333',
  },
  iconWrapper: {
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 12,
    textAlign: 'left',
    width: '100%',
  },
});

export default ZTextInput;
