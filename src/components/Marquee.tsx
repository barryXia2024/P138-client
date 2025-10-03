 
import { kScreenWidth } from "@/p138-react-common/utils/styles";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { View, Text, Animated } from "react-native";
import { isNaNofString } from "src/utils";
const isChinese = (char: string) => /[\u4e00-\u9fa5]/.test(char);
const estimeTextWidth = (text: string, fontSize: number) => {
  let totalWidth = 0;
  if(isNaNofString(text)) return 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const width = isChinese(char) ? fontSize * 1.5 : fontSize * 0.6;
    totalWidth += width;
  }
  return totalWidth;
};
const H5Marquee: React.FC<{
  text: string;
  onClick?: () => void;
  duration?: number;
}> = ({ text, duration = 20000, onClick }) => {
  const [scrollValue] = useState(new Animated.Value(0)); // 初始化动画值
  const [textWidth, setTextWidth] = useState(0); // 文本宽度
  // const [containerWidth, setContainerWidth] = useState(0); // 容器宽度
  const  mult = kScreenWidth/375 

  useEffect(() => {
    if (textWidth) {
      // 计算文本宽度和容器宽度的差值，设置动画的目标位置
      const scrollWidth = textWidth;
      // 动画函数
      const animateScroll = () => {
        scrollValue.setValue(kScreenWidth); // 从屏幕右侧开始
        Animated.timing(scrollValue, {
          toValue: -scrollWidth, // 向左滚动到文本的总宽度
          duration:(scrollWidth / kScreenWidth) * (duration*mult), // 控制滚动的时间
          useNativeDriver: true, // 使用原生驱动来提高性能
        }).start(() => animateScroll()); // 动画完成后，重新开始
      };

      animateScroll();
    }
  }, [scrollValue, textWidth]);
  useEffect(() => {
    setTextWidth(estimeTextWidth(text, 13));
  }, []);

  return (
    <View style={{ overflow: "hidden", width: "100%" }}>
      <Animated.View
        style={{
          flexDirection: "row",
          transform: [{ translateX: scrollValue }],
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text numberOfLines={1} style={{ fontSize: 16, width: textWidth }}>
            {text}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const AppMarquee: React.FC<{
  text: string;
  onClick?: () => void;
  duration?: number;
  width?: number;
}> = ({ text, duration = 15000, width = kScreenWidth }) => {
  const [scrollValue] = useState(new Animated.Value(0)); // 初始化动画值
  const [textWidth, setTextWidth] = useState(0); // 文本宽度

  useEffect(() => {
    if (textWidth > 0) {
      // 计算文本宽度和容器宽度的差值，设置动画的目标位置
      const scrollWidth = textWidth;

      // 动画函数
      const animateScroll = () => {
        scrollValue.setValue(kScreenWidth); // 从屏幕右侧开始
        Animated.timing(scrollValue, {
          toValue: -scrollWidth, // 向左滚动到文本的总宽度
          duration: (scrollWidth / kScreenWidth) * duration, // 控制滚动的时间
          useNativeDriver: true, // 使用原生驱动来提高性能
        }).start(() => animateScroll()); // 动画完成后，重新开始
      };

      animateScroll();
    }
  }, [scrollValue, textWidth]);

  return (
    <View style={{ overflow: "hidden", width }}>
      <Animated.View
        style={{
          flexDirection: "row",
          transform: [{ translateX: scrollValue }],
        }}
      >
        <Text
          style={{ fontSize: 16, width:estimeTextWidth(text, 12) }}
          onLayout={(e) => {
            const { width } = e.nativeEvent.layout;
            if (estimeTextWidth(text, 12) > width) {
              setTextWidth(estimeTextWidth(text, 12));
            } else {
              setTextWidth(width);
            }
          }}
          numberOfLines={1}
        >
          {text}
        </Text>
      </Animated.View>
    </View>
  );
};

export default Platform.OS === "web" ? H5Marquee : AppMarquee;
