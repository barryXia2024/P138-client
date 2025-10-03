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
  activeClassName,
  tabClassName,
  activeTabClassName,
  tabTextClassName,
  activeTabTextClassName,
  defaultSelectedTab = '',
  tabStyle,
  activeTabStyle,
  tabTextStyle,
  activeTabTextStyle,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0].key);

  const handlePress = (tab: {label: string; key: string}) => {
    setSelectedTab(tab.key);
    if (onTabPress) {
      onTabPress(tab); // 外部回调
    }
  };

  return (
    <View style={[styles.container, style]} className={className}>
      {tabs?.map((tab: {label: string; key: string}, index) => (
        <TouchableOpacity
          key={index}
          style={styles.tabItem}
          onPress={() => handlePress(tab)}>
          <View
            style={[tabStyle,selectedTab === tab.key && styles.activeTabItem,selectedTab === tab.key &&activeTabStyle,]}
            className={
              selectedTab === tab.key ? activeTabClassName : tabClassName
            }>
            <Text
              style={[
                styles.tabText,
                tabTextStyle,
                selectedTab === tab.key && styles.activeTabText,
         
                selectedTab === tab.key && activeTabTextStyle,
              ]}
              className={
                selectedTab === tab.key
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
