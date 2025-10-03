import React, {useState} from 'react';
import {StyleProp, Text, TextStyle, ViewStyle} from 'react-native';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

interface TopTabProps {
  tabs: {label: string; key: string}[];
  onTabPress?: (tab: {label: string; key: string}) => void; // 保留 callback 用于外部需要监听的场景
  className?: string;
  activeClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  tabTextClassName?: string;
  activeTabTextClassName?: string;
  defaultSelectedTab?: string;
  selectedTab?: string; // 新增：外部控制的选中值
  style?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  activeTabStyle?: StyleProp<ViewStyle>;
  tabTextStyle?: StyleProp<TextStyle>;
  activeTabTextStyle?: StyleProp<TextStyle>;
}

const TopTab: React.FC<TopTabProps> = ({
  tabs,
  onTabPress,
  className,
  style,
  tabClassName,
  activeTabClassName,
  tabTextClassName,
  activeTabTextClassName,
  selectedTab, // 新增：外部控制的选中值
  tabStyle,
  activeTabStyle,
  tabTextStyle,
  activeTabTextStyle,
}) => {
  // 使用外部传入的selectedTab，如果没有则使用内部状态
  const [internalSelectedTab, setInternalSelectedTab] = useState<string>(tabs[0].key);
  const currentSelectedTab = selectedTab !== undefined ? selectedTab : internalSelectedTab;

  const handlePress = (tab: {label: string; key: string}) => {
    // 只有在没有外部控制时才更新内部状态
    if (selectedTab === undefined) {
      setInternalSelectedTab(tab.key);
    }
    if (onTabPress) {
      onTabPress(tab); // 外部回调
    }
  };

  return (
    <View style={[styles.container, style]} className={className}>
      {tabs?.map((tab: {label: string; key: string}, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          style={styles.tabItem}
          onPress={() => handlePress(tab)}>
          <View
            style={[tabStyle,currentSelectedTab === tab.key && styles.activeTabItem,currentSelectedTab === tab.key &&activeTabStyle,]}
            className={
              currentSelectedTab === tab.key ? activeTabClassName : tabClassName
            }>
            <Text
              style={[
                styles.tabText,
                tabTextStyle,
                currentSelectedTab === tab.key && styles.activeTabText,
         
                currentSelectedTab === tab.key && activeTabTextStyle,
              ]}
              className={
                currentSelectedTab === tab.key
                  ? activeTabTextClassName
                  : tabTextClassName
              }>
              {tab.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeTabItem: {
    backgroundColor: '#f44336',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TopTab;
