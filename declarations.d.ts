// src/declarations.d.ts 或项目根目录下的 declarations.d.ts
declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.webp' {
  const value: any;
  export default value;
}

// declarations.d.ts
declare module 'react-native-marquee-ab' {
  import {ComponentType} from 'react';
  import {ViewStyle, TextStyle} from 'react-native';

  // 公共的 MarqueeProps
  interface MarqueeProps {
    duration?: number; // 执行时间，单位毫秒，默认为10秒
    speed?: number; // 滚动速度，单位px/s，默认为0，建议传入60
    textList: {label: string; value: string}[]; // 滚动的文本数组，必须按照格式传参
    width?: number; // 组件的宽度，不能使用 flex
    height?: number; // 组件的高度，不能使用 flex
    direction?: 'left' | 'right' | 'up' | 'down'; // 滚动的方向
    reverse?: boolean; // 是否倒叙整个字符串
    separator?: number; // 两个项之间的间隙，默认20
    bgContainerStyle?: ViewStyle; // 背景样式
    textStyle?: TextStyle; // 文本样式
    onTextClick?: (item: {label: string; value: string}) => void; // 点击事件回调
    delay?: number; // 文本停顿时间，仅对 MarqueeVertical 有效，默认1200毫秒
    numberOfLines?: number; // 文本行数，默认为1，仅对 MarqueeVertical 有效
    viewStyle?: TextStyle; // 每一行文本的样式，仅对 MarqueeVertical 有效
    headViews?: React.ReactNode; // 滚动的header，仅对 MarqueeVertical 有效
  }

  // Horizontal Marquee
  const MarqueeHorizontal: ComponentType<MarqueeProps>;

  // Vertical Marquee
  const MarqueeVertical: ComponentType<MarqueeProps>;

  export {MarqueeHorizontal, MarqueeVertical};
}

declare module 'md5'

 