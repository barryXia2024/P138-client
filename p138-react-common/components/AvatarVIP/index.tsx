import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import OSSImage from '../Upload/OSSImage';
import {DEFAULT_IMAGE} from '@/config/env';
import {BORDER_RADIUS, IMAGE_SIZE} from '../../utils/styles/theme';

// const vipIcon = [
//     require('src/assets/imgs/mine/logo_lv0.png'),
//     require('src/assets/imgs/mine/logo_lv1.png'),
//     require('src/assets/imgs/mine/logo_lv2.png'),
//     require('src/assets/imgs/mine/logo_lv3.png'),
//     require('src/assets/imgs/mine/logo_lv4.png'),
//     require('src/assets/imgs/mine/logo_lv5.png'),
//     require('src/assets/imgs/mine/logo_lv6.png'),
//     require('src/assets/imgs/mine/logo_lv7.png'),
//     require('src/assets/imgs/mine/logo_lv8.png'),
//     require('src/assets/imgs/mine/logo_lv9.png'),
//     require('src/assets/imgs/mine/logo_lv10.png'),
//   ];

type AvatarVIPProps = {
  avatar?: string;
  vipIndex: number;
  className?: string;
  onPress?: () => void;
  activeOpacity?: number;
};

const AvatarVIP = ({
  avatar,
  vipIndex,
  className,
  onPress,
  activeOpacity = 1,
}: AvatarVIPProps) => {
  return (
    <TouchableOpacity
      className={className}
      onPress={onPress}
      activeOpacity={activeOpacity}>
      <OSSImage
        source={{uri: avatar ?? DEFAULT_IMAGE}}
        style={[IMAGE_SIZE.IMAGE_SIZE40, BORDER_RADIUS.RADIUS_40]}
      />
      {/* <Image source={vipIcon[vipIndex >= vipIcon.length ? vipIcon.length - 1 : vipIndex]} style={styles.vipIcon} resizeMode="stretch" /> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  vipIcon: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    width: 40,
    height: 15,
  },
});

export default AvatarVIP;
