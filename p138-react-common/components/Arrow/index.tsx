import {ICON_SIZES} from '../../utils/styles/theme';
import React from 'react';
import {Image, ImageStyle, StyleProp} from 'react-native';

type IconType = 'upAndDown' | 'helpUpAndDown' | 'leftAndRight';
// 定义 Props 类型
interface ArrowIconProps {
  /**
   * 是否旋转
   */
  isTap?: boolean;
  style?: StyleProp<ImageStyle>;
  iconType?: IconType;
}

const ArrowIcon: React.FC<ArrowIconProps> = ({
  isTap = false,
  style,
  iconType = 'upAndDown',
}) => {
  const rotation = isTap ? '180deg' : '0deg';
  const iconMap: Record<IconType, number> = {
    helpUpAndDown: require('./imgs/icon_home_help_down.png'),
    upAndDown: require('./imgs/arrow_up_grey.png'),
    leftAndRight: require('./imgs/arrow_right_grey.png'),
  };
  return (
    <Image
      style={[
        {width: ICON_SIZES.small, height: ICON_SIZES.small},
        {transform: [{rotate: rotation}]},
        style,
      ]}
      source={iconMap[iconType]}
    />
  );
};

export default ArrowIcon;
