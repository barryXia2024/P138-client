import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text} from 'react-native';
import {useToast} from './ToastContext';
import {PortalProvider} from 'tamagui';

const Toast = () => {
  const {visible, message, position, hideToast} = useToast();
  const opacity = useRef(new Animated.Value(0)).current; // 使用 `useRef` 确保动画值不会重置

  useEffect(() => {
 
    if (visible) {
  
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => hideToast());
      }, 3000);
    }
  }, [visible]);

  if (!visible) return null; // `visible=false` 时不渲染

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        position === 'bottom'
          ? styles.toastBottom
          : position === 'top'
            ? styles.toastTop
            : styles.toastCenter,
        {opacity},
      ]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    alignSelf: 'center', // ✅ 居中
    maxWidth: '80%', // ✅ 避免 `Toast` 过长
    paddingVertical: 10,
    paddingHorizontal: 15, // ✅ 增加水平内边距
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    // width:'100%',
    // backgroundColor:'red',
    zIndex: 99999, // 确保在最上层
  },
  toastText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    flexWrap: 'wrap', // ✅ 自动换行
  },
  toastTop: {
    top: 50,
  },
  toastBottom: {
    bottom: 50,
  },
  toastCenter: {
    top: '50%',
    transform: [{translateY: -30}], // ✅ 完全居中
  },
});

export default Toast;
