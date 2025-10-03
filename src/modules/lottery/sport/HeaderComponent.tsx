import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

import {themeRedColor} from 'p138-react-common/utils/styles/color';
import {formattedWeekV2} from 'p138-react-common/utils/fuc';
import { Image } from 'expo-image';
/**
 * 头部组件
 * @param title 标题
 * @param totalMatches 总场次
 * @param toggleSection 切换折叠状态
 * @param collapsedSections 折叠状态
 * @returns 头部组件
*/
const HeaderComponent: React.FC<{
  title: string;
  totalMatches: number;
  toggleSection: (title: string) => void;
  collapsedSections: Record<string, boolean>;
}> = ({title, totalMatches, toggleSection, collapsedSections}) => {
  return (
    <TouchableOpacity
      style={styles.dateHeader}
      onPress={() => toggleSection(title)}>
      <Text style={styles.dateHeaderText}>
        {title} {formattedWeekV2(title)} 共
        <Text style={{color: themeRedColor}}>{totalMatches} </Text>
        场比赛
      </Text>
      {collapsedSections[title] ? (
        <Image
          source={require('src/assets/imgs/lottery/arrow_up_grey.png')}
          style={styles.cIcon}
        />
      ) : (
        <Image
          source={require('src/assets/imgs/lottery/arrow_down_grey.png')}
          style={styles.cIcon}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cIcon: {
    width: 11,
    height: 11,
    marginLeft: 11,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fef9f9',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  dateHeaderText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default HeaderComponent;
