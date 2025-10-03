import React, {useState} from 'react';
import {StyleProp, Text, TextStyle, ViewStyle} from 'react-native';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

interface TopTabProps {
  tabs: string[];
  onTabPress?: (index: number) => void; // 保留 callback 用于外部需要监听的场景
  className?: string;
  activeClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  tabTextClassName?: string;
  activeTabTextClassName?: string;
  defaultSelectedTab?: number;
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
  defaultSelectedTab = 0,
  tabStyle,
  activeTabStyle,
  tabTextStyle,
  activeTabTextStyle,
}) => {
  const [selectedTab, setSelectedTab] = useState(defaultSelectedTab);

  const handlePress = (index: number) => {
    setSelectedTab(index);
    if (onTabPress) {
      onTabPress(index); // 外部回调
    }
  };

  return (
    <View style={[styles.container, style]} className={className}>
      {tabs?.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={styles.tabItem}
          onPress={() => handlePress(index)}>
          <View
            style={[tabStyle,selectedTab === index && styles.activeTabItem,selectedTab === index &&activeTabStyle,]}
            className={
              selectedTab === index ? activeTabClassName : tabClassName
            }>
            <Text
              style={[
                styles.tabText,
                tabTextStyle,
                selectedTab === index && styles.activeTabText,
         
                selectedTab === index && activeTabTextStyle,
              ]}
              className={
                selectedTab === index
                  ? activeTabTextClassName
                  : tabTextClassName
              }>
              {tab}
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
