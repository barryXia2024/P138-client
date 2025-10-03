import {Dimensions, StyleSheet} from 'react-native';
import {themeRedColor} from './color';

const {width, height} = Dimensions.get('window');

// 定义数值范围
const spacingSizes = [0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32];
const borderSizes = [0, 1, 2, 4, 8];
const fontSizes = [0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32];
const gapSizes = [0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24];
const iconSizes = [4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 30, 40, 60];

// 定义动态样式的类型
type DynamicStyles = {
  [key in
    | `padding${number}`
    | `paddingHorizontal${number}`
    | `paddingVertical${number}`
    | `margin${number}`
    | `marginTop${number}`
    | `marginBottom${number}`
    | `marginHorizontal${number}`
    | `marginVertical${number}`
    | `borderWidth${number}`
    | `gap${number}`
    | `iconSize${number}`
    | `fontSize${number}`]: {
    [key: string]: number;
  };
};

// 动态生成样式
const dynamicStyles: DynamicStyles = {
  // 生成 Padding 和 Margin 样式
  ...spacingSizes.reduce((acc, size) => {
    acc[`padding${size}`] = {padding: size};
    acc[`paddingHorizontal${size}`] = {paddingHorizontal: size};
    acc[`paddingVertical${size}`] = {paddingVertical: size};
    acc[`margin${size}`] = {margin: size};
    acc[`marginTop${size}`] = {marginTop: size};
    acc[`marginBottom${size}`] = {marginBottom: size};
    acc[`marginHorizontal${size}`] = {marginHorizontal: size};
    acc[`marginVertical${size}`] = {marginVertical: size};
    return acc;
  }, {} as DynamicStyles),

  // 生成 BorderWidth 样式
  ...borderSizes.reduce((acc, size) => {
    acc[`borderWidth${size}`] = {borderWidth: size};
    return acc;
  }, {} as DynamicStyles),

  // 生成 Gap 样式
  ...gapSizes.reduce((acc, size) => {
    acc[`gap${size}`] = {gap: size};
    return acc;
  }, {} as DynamicStyles),

  // 生成 FontSize 样式
  ...fontSizes.reduce((acc, size) => {
    acc[`fontSize${size}`] = {fontSize: size};
    return acc;
  }, {} as DynamicStyles),

  // 生成 FontSize 样式
  ...iconSizes.reduce((acc, size) => {
    acc[`iconSize${size}`] = {width: size, height: size};
    return acc;
  }, {} as DynamicStyles),
};

// 静态样式
const staticStyles = StyleSheet.create({
  // View Styles
  flex_1: {flex: 1},
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  alignCenter: {
    alignItems: 'center',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  row: {flexDirection: 'row'},
  column: {flexDirection: 'column'},
  between: {justifyContent: 'space-between'},
  flexWrap: {flexWrap: 'wrap', flexDirection: 'row'},

  // Background
  bgWhite: {backgroundColor: '#fff'},
  bgF0F0F0: {backgroundColor: '#f0f0f0'},
  bgThemRed: {backgroundColor: themeRedColor},

  // Text Colors
  fontColor333: {color: '#333'},
  fontColor999: {color: '#999'},
  fontColorFFF: {color: '#fff'},
  fontColorRed: {color: themeRedColor},
  fontCenter: {textAlign: 'center'},

  // Border Radius
  borderRadius4: {borderRadius: 4},
  borderRadius8: {borderRadius: 8},
  borderRadius16: {borderRadius: 16},

  borderWidth1CCC: {borderWidth: 0.5, borderColor: '#ccc'},

  // Shadow Styles
  shadowSmall: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  shadowMedium: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  // Input Styles
  input: {
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  leagueLogo: {
    width: 15,
    height: 15,
  },
  // Full-screen styles
  widthFullScreen: {width},
  heightFullScreen: {height},
});

// 合并动态样式和静态样式
const commonStyles = {
  ...staticStyles,
  ...dynamicStyles,
} as typeof staticStyles & DynamicStyles;
const kScreenWidth = width;
const kScreenHeight = height;
export {kScreenHeight, kScreenWidth};
export default commonStyles;
