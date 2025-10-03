import React from "react";
import { Text, View, ActivityIndicator, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { ButtonProps } from "./types";
import { themeBlueColor, themeRedColor } from "@/p138-react-common/utils/styles/color";
import { appConfig } from "src/config";

const Button: React.FC<ButtonProps> = ({
  title,
  children,
  onClick,
  onPress,
  type = 'default',
  size = 'middle',
  shape = 'default',
  disabled = false,
  loading = false,
  ghost = false,
  danger = false,
  block = false,
  style,
  textStyle,
  className,
  icon,
  iconPosition = 'left',
  activeOpacity = 0.6,
  onLongPress,
  onPressIn,
  onPressOut,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    onClick?.();
    onPress?.();
  };

  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.button];
    
    // 添加类型样式
    switch (type) {
      case 'primary':
        baseStyle.push(styles.type_primary);
        break;
      case 'dashed':
        baseStyle.push(styles.type_dashed);
        break;
      case 'link':
        baseStyle.push(styles.type_link);
        break;
      case 'text':
        baseStyle.push(styles.type_text);
        break;
        case 'gray':
          baseStyle.push(styles.type_gray);
          break;
      default:
        baseStyle.push(styles.type_default);
    }
    
    // 添加尺寸样式
    switch (size) {
      case 'large':
        baseStyle.push(styles.size_large);
        break;
      case 'small':
        baseStyle.push(styles.size_small);
        break;
      default:
        baseStyle.push(styles.size_middle);
    }
    
    // 添加形状样式
    switch (shape) {
      case 'round':
        baseStyle.push(styles.shape_round);
        break;
      case 'circle':
        baseStyle.push(styles.shape_circle);
        break;
      default:
        baseStyle.push(styles.shape_default);
    }
    
    // 添加幽灵模式样式
    if (ghost) {
      switch (type) {
        case 'primary':
          baseStyle.push(styles.ghost_primary);
          break;
        case 'dashed':
          baseStyle.push(styles.ghost_dashed);
          break;
        case 'link':
          baseStyle.push(styles.ghost_link);
          break;
        case 'text':
          baseStyle.push(styles.ghost_text);
          break;
        case 'gray':
          baseStyle.push(styles.ghost_gray);
          break;
        default:
          baseStyle.push(styles.ghost_default);
      }
    }
    
    // 添加其他样式
    if (danger) {
      baseStyle.push(styles.danger);
    }
    
    if (block) {
      baseStyle.push(styles.block);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text];
    
    if (ghost) {
      baseTextStyle.push(styles.text_ghost);
    }
    
    if (danger) {
      baseTextStyle.push(styles.text_danger);
    }
    if (type === 'primary') {
      baseTextStyle.push(styles.text_Primary);
    }
    
    if (disabled) {
      baseTextStyle.push(styles.text_disabled);
    }
    
    return baseTextStyle;
  };

  const renderContent = () => {
    const content = children || title;
    
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="small" 
            color={type === 'primary' ? '#fff' : '#1890ff'} 
          />
          <Text style={[getTextStyle(), styles.loadingText]}>{content}</Text>
        </View>
      );
    }

    if (icon) {
      return (
        <View style={[styles.iconContainer, iconPosition === 'right' && styles.iconRight]}>
          {iconPosition === 'left' && icon}
          <Text style={[getTextStyle(), textStyle]}>{content}</Text>
          {iconPosition === 'right' && icon}
        </View>
      );
    }

    return <Text style={[getTextStyle(), textStyle]}>{content}</Text>;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={handlePress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={activeOpacity}
      disabled={disabled || loading}
      className={className}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    backgroundColor: '#fff',
  },
  
  // 类型样式
  type_primary: {
    backgroundColor:appConfig.platform==='business' ? themeBlueColor : themeRedColor,
    borderColor: appConfig.platform==='business' ? themeBlueColor : themeRedColor,
  },
  type_default: {
    backgroundColor: '#fff',
    borderColor: '#d9d9d9',
  },
  type_dashed: {
    backgroundColor: '#fff',
    borderColor: '#d9d9d9',
    borderStyle: 'dashed',
  },
  type_link: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  type_text: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  type_gray: {
    backgroundColor: '#999',
    borderColor: '#999',
 
  },
  
  // 尺寸样式
  size_large: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 40,
  },
  size_middle: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 32,
  },
  size_small: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    minHeight: 24,
  },
  
  // 形状样式
  shape_default: {
    borderRadius: 6,
  },
  shape_round: {
    borderRadius: 16,
  },
  shape_circle: {
    borderRadius: 50,
    aspectRatio: 1,
  },
  
  // 幽灵模式
  ghost_primary: {
    backgroundColor: 'transparent',
    borderColor: '#1890ff',
  },
  ghost_default: {
    backgroundColor: 'transparent',
    borderColor: '#d9d9d9',
  },
  ghost_dashed: {
    backgroundColor: 'transparent',
    borderColor: '#d9d9d9',
  },
  ghost_link: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  ghost_text: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  ghost_gray: {
    backgroundColor: 'transparent',
    borderColor: '#999',
  },
  
  // 危险样式
  danger: {
    backgroundColor: '#ff4d4f',
    borderColor: '#ff4d4f',
  },
  
  // 块级样式
  block: {
    width: '100%',
  },
  
  // 禁用样式
  disabled: {
    opacity: 0.4,
  },
  
  // 文本样式
  text: {
    fontSize: 14,
    fontWeight: '400',
  },
  
  // 危险文本
  text_danger: {
    color: '#fff',
  },
  
  // 禁用文本
  text_disabled: {
    color: 'rgba(0, 0, 0, 0.25)',
  },
  text_Primary: {
    color: '#fff',
  },
  // 加载状态
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
  },
  
  // 图标容器
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconRight: {
    flexDirection: 'row-reverse',
  },
});

export default Button;
