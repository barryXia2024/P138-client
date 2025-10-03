import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useRouter} from 'expo-router';
import {appConfig} from 'src/config';

interface AppHeaderProps {
  title?: string; // 标题文字
  onBackPress?: () => void; // 返回按钮点击事件
  leftComponent?: React.ReactNode; // 左侧自定义组件
  rightComponent?: React.ReactNode; // 右侧自定义组件
  titleDes?: string; //可以点击的副标题
  style?: StyleProp<ViewStyle>;
  titleDesOnPress?: () => void;
}
const themeColor = appConfig.platform === 'customer' ? '#f44336' : '#1984ff';
const homeUrl =
  appConfig.platform === 'customer' ? '/Home' : '/OrderManagement';

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  onBackPress,
  leftComponent,
  rightComponent,
  titleDes,
  style,
  titleDesOnPress,
}) => {
  const router = useRouter();
  const defaultBackPress = () => {
    if (!onBackPress) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace(homeUrl);
      }
    } else {
      onBackPress();
    }
  };
  return (
    <View style={[styles.container, style]}>
      {/* 左侧组件 */}
      <View style={styles.left}>
        {leftComponent ? (
          leftComponent
        ) : (
          <TouchableOpacity
            onPress={defaultBackPress}
            style={styles.backButton}>
            <Image
              style={styles.backImg}
              source={require('src/assets/imgs/icon_back_arrow.png')}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 标题 */}
      <View className="flex-row items-center justify-center">
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {titleDes && (
          <TouchableOpacity style={styles.helpRoot} onPress={titleDesOnPress}>
            <Text style={styles.helpText} numberOfLines={1}>
              {titleDes}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 右侧组件 */}
      <View style={styles.right}>
        {rightComponent || <View style={styles.placeHodleWidth} />}
        {/* 保持对称占位 */}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: themeColor,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 10,
  },
  helpRoot: {
    borderRadius: 2,
    marginLeft: 2,
    paddingVertical: 1,
    paddingHorizontal: 4,
    backgroundColor: '#fff',
  },
  helpText: {
    fontSize: 10,
    color: '#f44336',
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 10,
  },
  backImg: {
    width: 26,
    height: 32,
  },
  centerRoot: {
    flexDirection: 'row',
    width: 150,
  },
  title: {
    // flex: 1, // 占据中间空间
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center', // 确保文字居中
  },
  placeHodleWidth: {
    width: 20,
  },
});

export default AppHeader;
