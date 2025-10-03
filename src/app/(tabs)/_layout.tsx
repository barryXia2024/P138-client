import {Tabs} from 'expo-router';
import {
  TouchableOpacity,
  Platform,
  TouchableOpacityProps,
  Image,
  View,
} from 'react-native';
import {Text} from 'react-native';

import {BottomTabBarButtonProps} from '@react-navigation/bottom-tabs';
import {COLORS} from '@/p138-react-common/utils/styles/theme';
import {useCallback} from 'react';
import { useIMStore } from '@/p138-react-common/OpenIM/store';

// 提前加载图标
const icons = {
  home: {
    focused: require('src/assets/imgs/tabs/home-active1.png'),
    default: require('src/assets/imgs/tabs/home1.png'),
  },
  live: {
    focused: require('src/assets/imgs/tabs/num-active1.png'),
    default: require('src/assets/imgs/tabs/num1.png'),
  },
  follow: {
    focused: require('src/assets/imgs/tabs/gendan-active.png'),
    default: require('src/assets/imgs/tabs/gendan.png'),
  },
  chat: {
    focused: require('src/assets/imgs/tabs/tab6s1.png'),
    default: require('src/assets/imgs/tabs/tab61.png'),
  },
  mine: {
    focused: require('src/assets/imgs/tabs/mine-active1.png'),
    default: require('src/assets/imgs/tabs/mine1.png'),
  },
};

// 定义类型
interface TabBarLabelProps {
  focused: boolean;
}

interface TabBarIconProps {
  focused: boolean;
}

const tabBarLabel = ({focused}: TabBarLabelProps, name: string) => {
  const color = focused ? COLORS.themeRed : COLORS.themeGray;
  return (
    <Text className="text-[14px] leading-6 flex-1" style={[{color}]}>
      {name}
    </Text>
  );
};

export default function TabLayout() {
  const unreadCount = useIMStore(state => state.getTotalUnread());

  console.log(unreadCount, '========unreadCount========');

  const createTabScreen = useCallback(
    (
      name: string,
      label: string,
      icon: {focused: any; default: any},
      showUnreadCount: boolean = false,
    ) => ({
      name,
      options: {
        tabBarLabel: (props: TabBarLabelProps) => tabBarLabel(props, label),
        tabBarStyle: {
          height: 60, // 设置 TabBar 高度
        },
        tabBarButton:
          Platform.OS !== 'web'
            ? (props: BottomTabBarButtonProps) => {
                const {delayLongPress, ...restProps} = props;
                return (
                  <TouchableOpacity
                    {...(restProps as TouchableOpacityProps)}
                    activeOpacity={1} // 取消点击时的动画效果
                  />
                );
              }
            : undefined,
        tabBarIcon: ({focused}: TabBarIconProps) => {
          const iconSource = focused ? icon.focused : icon.default;
          const currentUnreadCount = showUnreadCount ? unreadCount : 0;
          return (
            <View>
              {Number(currentUnreadCount) > 0 && (
                <View
                  className="w-[15] h-[15] bg-red-500 absolute top-[-5px] right-[-5px] rounded-full items-center justify-center"
                  style={{
                    zIndex: 1000,
                  }}>
                  <Text className="text-white text-xs text-center">
                    {currentUnreadCount}
                  </Text>
                </View>
              )}
              <Image
                className="w-[25] h-[25]"
                style={{width: 25, height: 25}}
                source={iconSource}
              />
            </View>
          );
        },
      },
    }),
    [unreadCount],
  );

  return (
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen {...createTabScreen('Home', '首页', icons.home)} />
      <Tabs.Screen {...createTabScreen('live', '直播', icons.live)} />
      <Tabs.Screen {...createTabScreen('follow', '跟单大厅', icons.follow)} />
      <Tabs.Screen
        name="Chat"
        options={{
          tabBarLabel: (props: TabBarLabelProps) => tabBarLabel(props, '聊天'),
          tabBarStyle: {
            height: 60, // 设置 TabBar 高度
          },
          // Only render tabBarButton for mobile platforms (iOS/Android)
          tabBarButton:
            Platform.OS !== 'web'
              ? props => (
                  <TouchableOpacity
                    {...(props as TouchableOpacityProps)}
                    activeOpacity={1} // 取消点击时的动画效果
                  />
                )
              : undefined,
          tabBarIcon: ({focused}: TabBarIconProps) => (
            <View>
              {Number(unreadCount) > 0 ? (
                <View
                  style={{
                    zIndex: 1000,
                  }}
                  className="w-[15] h-[15] bg-red-500 absolute top-[-5px] right-[-5px] rounded-full items-center justify-center">
                  <Text className="text-white text-xs text-center">
                    {unreadCount}
                  </Text>
                </View>
              ) : null}
              <Image
                className="w-[25] h-[25]"
                style={{width: 25, height: 25}}
                source={
                  focused
                    ? require('src/assets/imgs/tabs/tab6s1.png')
                    : require('src/assets/imgs/tabs/tab61.png')
                }
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen {...createTabScreen('mine', '我的', icons.mine)} />
    </Tabs>
  );
}
