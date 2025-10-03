import {Image} from 'expo-image';
import React from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';

interface CustomModalProps {
  isVisible?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  position?: 'center' | 'bottom' | 'right' | 'left';
  disabled?: boolean;
  height?: number;
}
const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  onClose,
  children,
  position = 'center',
  disabled = false,
  height,
}) => {
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType={position === 'bottom' ? 'slide' : 'fade'}
      onRequestClose={onClose}>
      <View
        style={[
          styles.overlay,

          position === 'bottom' && {justifyContent: 'flex-end'},
          position === 'right' && {
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          },
          position === 'left' && {
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          },
        ]}>
        {/* 背景蒙层，点击关闭 */}
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            position === 'center' && {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
          activeOpacity={1}
          onPress={onClose}
        />
        {/* 弹窗内容容器 */}
        {children}
        {disabled && (
          <TouchableOpacity onPress={onClose} style={{marginTop: 10}}>
            <Image
              source={require('src/assets/imgs/close2.png')}
              style={{width: 40, height: 40}}
            />
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    // width: kScreenWidth,
    flex: 1,
  },
});

export default CustomModal;
