import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet  } from 'react-native';
import { themeRedColor } from '@/p138-react-common/utils/styles/color';


const TabSwitch: React.FC<FollowProps.TabSwitchProps> = ({
  tabs,
  activeTab,
  onTabChange,
  style,
  tabStyle,
  activeTabStyle,
  textStyle,
  activeTextStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            tabStyle,
            activeTab === tab.key && styles.tabActive,
            activeTab === tab.key && activeTabStyle,
          ]}
          onPress={() => onTabChange(tab.key)}
        >
          <Text
            style={[
              styles.tabText,
              textStyle,
              activeTab === tab.key && styles.tabTextActive,
              activeTab === tab.key && activeTextStyle,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 50,
    marginHorizontal: 8,
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: themeRedColor,
  },
  tabText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '400',
  },
  tabTextActive: {
    color: themeRedColor,
    fontWeight: '600',
  },
});

export default TabSwitch; 