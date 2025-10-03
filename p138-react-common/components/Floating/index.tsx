import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {Image} from 'expo-image';
import {themeBlueColor, themeRedColor} from '../../utils/styles/color';
import {appConfig} from 'src/config';
import businessIcon from './img/icon_message_float_b.png';
import consumerIcon from './img/icon_message_float.png';

const {height} = Dimensions.get('window'); // 获取屏幕高度

const FloatingButton: React.FC<{
  onPress: () => void;
  title: string;
  unreadCount: number;
}> = ({onPress, title, unreadCount}) => {
  const [showDot, setShowDot] = useState<boolean>(unreadCount > 0);
  const [dotGreen, setDotGreen] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevUnreadRef = useRef<number>(unreadCount);

  useEffect(() => {
    const prev = prevUnreadRef.current;
    // 0 -> >0 或 未读数增加时，重新显示并开始闪烁
    if ((prev === 0 && unreadCount > 0) || unreadCount > prev) {
      setShowDot(true);
    }
    // 归零时隐藏
    if (unreadCount === 0) {
      setShowDot(false);
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    // 小点颜色红/绿切换
    if (!showDot) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = setInterval(() => {
      setDotGreen(prev => !prev);
    }, 800);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [showDot]);
  const panY = useRef(new Animated.Value((height * 3) / 4)).current; // 初始 Y 轴位置
  const currentY = useRef(0); // 用于记录当前的 Y 轴位置
  const isDragging = useRef(false); // 标记是否正在拖拽
  const startTime = useRef(0); // 手势开始时间
  const startY = useRef(0); // 手势开始时的 Y 轴位置

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true, // 启用手势响应
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // PC 端提高阈值，避免轻微移动被判定为拖拽
      return Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3;
    },
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: (_, gestureState) => {
      isDragging.current = false; // 初始化为非拖拽
      startTime.current = Date.now(); // 记录手势开始时间
      startY.current = gestureState.y0; // 记录手势开始时的位置
      panY.stopAnimation(value => {
        currentY.current = value; // 记录当前位置
      });
    },
    onPanResponderMove: (_, gestureState) => {
      // 计算手指移动的距离
      const distance = Math.abs(gestureState.moveY - startY.current);
      if (distance > 10) {
        isDragging.current = true; // 如果移动距离大于 5，则认为是拖拽
      }
      if (isDragging.current) {
        // 实时更新拖拽位置
        const newY = Math.min(
          Math.max(currentY.current + gestureState.dy, 0), // 限制顶部
          height - 100, // 限制底部
        );
        panY.setValue(newY); // 设置新的位置
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      const distance = Math.abs(gestureState.moveY - startY.current);
      const duration = Date.now() - startTime.current; // 手势持续时间
      console.log(duration, distance);
      if (!isDragging.current && duration < 200) {
        // 如果手指移动距离小于 5 且时间小于 200ms，认为是点击
        handlePress();
      } else {
        // 吸附到合法位置
        const finalY = Math.min(
          Math.max(currentY.current + gestureState.dy, 0),
          height - 100,
        );
        Animated.spring(panY, {
          toValue: finalY,
          useNativeDriver: false,
        }).start(() => {
          currentY.current = finalY; // 更新当前位置
        });
      }
    },
  });

  const handlePress = () => {
    // 处理点击事件
    setShowDot(false); // 点击后小点消失
    onPress();
  };
  console.log(unreadCount, 'unreadCount');

  return (
    <Animated.View
      style={[
        styles.floatingButton,
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.3,
          // 防止 PC 端拖动选中文本/图片
          userSelect: 'none' as any,
        },
        // eslint-disable-next-line react-native/no-inline-styles
        {
          transform: [{translateY: panY}], // 动画样式
          right: 0, // 固定在屏幕右侧
        },
      ]}
      {...panResponder.panHandlers} // 绑定手势事件
    >
      <View
        style={[
          styles.touchableContent,
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}>
        <View>
          <Image
            source={
              appConfig.platform === 'business' ? businessIcon : consumerIcon
            }
            style={{
              width: 25,
              height: 25,
       
            }}
          />
          {showDot ? (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: dotGreen ? '#22c55e' : '#ef4444', // 绿/红
                borderWidth: 1,
                borderColor: '#fff',
                zIndex: 2,
              }}
            />
          ) : null}
        </View>

        <View>
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    width: 80,
    height: 35,
    backgroundColor: '#e22',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // 安卓阴影
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    zIndex: 1000,
  },
  touchableContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: appConfig.platform === 'business' ? themeBlueColor : themeRedColor,
    fontSize: 14,
    lineHeight: 16,
    width: 40,
    paddingHorizontal: 4,
  },
});

export default FloatingButton;
