import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import { DEFAULT_IMAGE } from '@/p138-react-common/config';
import React from 'react';
import { View, StyleSheet,Image } from 'react-native';

type AvatarVIPProps = {
  avatar: string;
  vipIcon: string;
};

const AvatarVIP = ({ avatar, vipIcon }: AvatarVIPProps) => {
  return (
    <View>
      <OSSImage source={{ uri: avatar||DEFAULT_IMAGE }} style={styles.avatar} />
      <OSSImage source={{ uri: vipIcon }} style={styles.vipIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  vipIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 15,
    height: 15,
  },
});

export default AvatarVIP;
