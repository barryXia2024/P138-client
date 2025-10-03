import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {appConfig} from 'src/config';
import { themeBlueColor,themeGrayColor, themeRedColor } from '../utils/styles/color';
interface Tab<T> {
  label: string;
  key: T;
}
type TabSwitcherProps<T> =
  | {
      tabs: Tab<T>[];
      activeTab?: T;
      onTabPress: (key: T) => void;
      labelInValue?: false;
      style?: any;
      numbers?: number[];
      className?: string;
      tabClassName?: string;
    }
  | {
      tabs: Tab<T>[];
      activeTab?: T;
      onTabPress: (tab: Tab<T>) => void;
      labelInValue: true;
      style?: any;
      numbers?: number[];
      className?: string;
      tabClassName?: string;
    };
// ✅ 泛型函数组件写法，能从 props.tabs 推导出 T
function TabSwitcher<T>(props: TabSwitcherProps<T>): React.ReactElement {
  const {
    tabs,
    activeTab,
    style,
    numbers,
    className,
    tabClassName = 'flex-1',
  } = props;
  const Wrapper = tabs.length > 5 ? ScrollView : View;

  const activeColor = appConfig.platform === 'business' ? themeBlueColor : themeRedColor;
  return (
    <Wrapper
      style={Wrapper === ScrollView ? {flexGrow: 0} : {}}
      horizontal={Wrapper === ScrollView}
      contentContainerStyle={{flex: 1}}
      className={`flex-row   w-full bg-white  ${style} ${className}`}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={String(tab.key)}
          className={` items-center   ${tabClassName}`}
          style={{paddingTop: 4}}
          onPress={() => {
            if ('labelInValue' in props && props.labelInValue) {
              props.onTabPress(tab); // 类型安全：labelInValue 为 true，onTabPress 是 Tab<T>
            } else {
              props.onTabPress(tab.key); // 否则是 key 类型
            }
          }}>
          <View className="flex-row items-center ">
            <Text
              style={{color: activeTab == tab.key ? activeColor : '#666'}}
              className={`text-[15px]   ${
                activeTab === tab.key ? `  font-bold` : ''
              }`}>
              {tab.label}
            </Text>
            {numbers && numbers[index] > 0 && (
              <View
                style={{
                  backgroundColor: '#FF0000',
                  borderRadius: 5,
                  position: 'absolute',
                  right: -20,
                  top: 3,
                  paddingHorizontal: 2,
                }}>
                <Text
                  className="text-xs text-white text-center"
                  style={{width: 16}}>
                  {numbers[index]}
                </Text>
              </View>
            )}
          </View>
          {activeTab === tab.key && (
            <View
              className="mt-1 h-0.5 w-1/6"
              style={{
                width: 20,
                height: 1,
                backgroundColor: activeColor,
                marginTop: 10,
              }}
            />
          )}
        </TouchableOpacity>
      ))}
    </Wrapper>
  );
}

export default TabSwitcher;
